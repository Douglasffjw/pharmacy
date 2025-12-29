import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AuthRequest } from '../types/auth';
import prisma from '../lib/prisma';

export class OrderController {
  // Criar pedido (checkout)
  static async createOrder(req: AuthRequest, res: Response) {
    try {
      const { items } = req.body; // Array de { productId, quantity }
      const customerId = req.user!.id;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items do carrinho são obrigatórios' });
      }

      // Verificar se todos os produtos existem e têm estoque suficiente
      const productChecks = await Promise.all(
        items.map(async (item: { productId: string; quantity: number }) => {
          const product = await prisma.produto.findUnique({
            where: { id: item.productId },
            select: { id: true, preco: true, quantidade: true, nome: true, criadoPor: true }
          });

          if (!product) {
            throw new Error(`Produto ${item.productId} não encontrado`);
          }

          if ((product as any).quantidade < item.quantity) {
            throw new Error(`Estoque insuficiente para ${ (product as any).nome }. Disponível: ${ (product as any).quantidade }`);
          }

          return {
            ...item,
            product,
            subtotal: (product as any).preco * item.quantity
          };
        })
      );

      // Calcular total do pedido
      const total = productChecks.reduce((sum, item) => sum + item.subtotal, 0);

      // Criar o pedido e os itens em uma transação
      const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Criar o pedido
        const newOrder = await tx.pedido.create({
          data: {
            clienteId: customerId,
            total,
            statusPedido: 'PENDENTE'
          }
        });

        // Criar os itens do pedido e reduzir estoque
        const orderItems = await Promise.all(
          productChecks.map(async (item) => {
            // Criar item do pedido
            const orderItem = await tx.itemPedido.create({
              data: {
                pedidoId: newOrder.id,
                produtoId: item.productId,
                quantidade: item.quantity,
                preco: (item.product as any).preco
              }
            });

            // Reduzir estoque do produto
            await tx.produto.update({
              where: { id: item.productId },
              data: {
                quantidade: {
                  decrement: item.quantity
                }
              }
            });

            return orderItem;
          })
        );

        return { ...newOrder, items: orderItems };
      });

      // Buscar pedido completo com relacionamentos
      const completeOrder = await prisma.pedido.findUnique({
        where: { id: (order as any).id },
        include: {
          cliente: {
            select: { id: true, nome: true, email: true }
          },
          itens: {
            include: {
              produto: {
                select: { id: true, nome: true, imagens: true }
              }
            }
          }
        }
      });

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        order: completeOrder
      });

    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Listar pedidos do cliente logado
  static async getCustomerOrders(req: AuthRequest, res: Response) {
    try {
      const customerId = req.user!.id;

      const orders = await prisma.pedido.findMany({
        where: { clienteId: customerId },
        include: {
          itens: {
            include: {
              produto: {
                select: { id: true, nome: true, imagens: true, categoria: true }
              }
            }
          }
        },
        orderBy: { criadoEm: 'desc' }
      });

      res.json({ orders });

    } catch (error: any) {
      console.error('Erro ao buscar pedidos do cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Listar todas as vendas (apenas para vendedores)
  static async getAllSales(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      
      if (user.role !== 'SELLER') {
        return res.status(403).json({ error: 'Acesso negado. Apenas vendedores podem ver todas as vendas.' });
      }

      const orders = await prisma.pedido.findMany({
        include: {
          cliente: {
            select: { id: true, nome: true, email: true }
          },
          itens: {
            include: {
              produto: {
                select: { id: true, nome: true, imagens: true, categoria: true, criadoPor: true },
                include: {
                  criador: {
                    select: { id: true, nome: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { criadoEm: 'desc' }
      });

      res.json({ orders });

    } catch (error: any) {
      console.error('Erro ao buscar todas as vendas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Cancelar pedido
  static async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const user = req.user!;

      // Buscar o pedido
      const order = await prisma.pedido.findUnique({
        where: { id: orderId },
        include: {
          itens: {
            include: {
              produto: {
                select: { criadoPor: true }
              }
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if ((order as any).statusPedido === 'CANCELADO') {
        return res.status(400).json({ error: 'Pedido já foi cancelado' });
      }

      if ((order as any).statusPedido === 'CONCLUIDO') {
        return res.status(400).json({ error: 'Não é possível cancelar um pedido já finalizado' });
      }

      // Verificar permissões
      const canCancel = 
        String(user.role) === 'cliente' && (order as any).clienteId === user.id || // Cliente pode cancelar seus pedidos
        String(user.role) === 'vendedor' && (order as any).itens.some((item: any) => (item.produto as any).criadoPor === user.id); // Vendedor pode cancelar suas vendas

      if (!canCancel) {
        return res.status(403).json({ error: 'Você não tem permissão para cancelar este pedido' });
      }

      // Cancelar pedido e devolver estoque em transação
      const cancelledOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Atualizar status do pedido
        const updatedOrder = await tx.pedido.update({
          where: { id: orderId },
          data: { statusPedido: 'CANCELADO' }
        });

        // Devolver estoque dos produtos
        await Promise.all(
          order.items.map(async (item: any) => {
            await tx.produto.update({
              where: { id: item.produtoId || item.productId },
              data: {
                quantidade: {
                  increment: item.quantidade || item.quantity
                }
              }
            });
          })
        );

        return updatedOrder;
      });

      res.json({
        message: 'Pedido cancelado com sucesso',
        order: cancelledOrder
      });

    } catch (error: any) {
      console.error('Erro ao cancelar pedido:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar detalhes de um pedido específico
  static async getOrderById(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const user = req.user!;

      const order = await prisma.pedido.findUnique({
        where: { id: orderId },
        include: {
          cliente: {
            select: { id: true, nome: true, email: true }
          },
          itens: {
            include: {
              produto: {
                select: { id: true, nome: true, imagens: true, categoria: true, criadoPor: true },
                include: {
                  criador: {
                    select: { id: true, nome: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Verificar permissões
      const canView = 
        user.role === 'CUSTOMER' && order.customerId === user.id || // Cliente pode ver seus pedidos
        user.role === 'SELLER'; // Vendedor pode ver todos os pedidos

      if (!canView) {
        return res.status(403).json({ error: 'Você não tem permissão para ver este pedido' });
      }

      res.json({ order });

    } catch (error: any) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}