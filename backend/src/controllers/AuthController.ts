import type { Request, Response } from 'express-serve-static-core';
import { User, LoginCredentials, CustomerRegistration, SellerRegistration } from '../types/models';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export class AuthController {
  // Usando arrow functions para manter o contexto do this
  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password }: LoginCredentials = req.body;

      // Busca o usuário pelo email
      const user = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Verifica a senha
      const validPassword = await bcrypt.compare(password, user.senha as string);
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const token = generateToken(user as any);

      // Remove a senha do objeto de retorno
      const { senha: _, ...userWithoutPassword } = user as any;

      const papel = (user as any).papel ? String((user as any).papel).toLowerCase() : '';
      const roleForFrontend = papel === 'admin' ? 'admin' : (papel === 'vendedor' || papel === 'seller' ? 'seller' : 'customer');

      return res.json({ 
        user: {
          ...userWithoutPassword,
          role: roleForFrontend
        }, 
        token 
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(400).json({ error: 'Falha no login' });
    }
  };

  public registerCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data: CustomerRegistration = req.body;
      console.log('📥 Dados recebidos para registro:', JSON.stringify(data, null, 2));

      // Verifica se já existe um usuário com o mesmo email
      const existingUser = await prisma.usuario.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        console.log('❌ Email já cadastrado:', data.email);
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Cria novo usuário
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.usuario.create({
        data: {
          email: data.email,
          nome: data.name,
          senha: hashedPassword,
          telefone: data.phone,
          dataNascimento: data.birthDate ? new Date(data.birthDate) : null,
          papel: 'CLIENTE'
        }
      });

      const token = generateToken(user as any);

      // Remove a senha do objeto de retorno
      const { senha, ...userWithoutPassword } = user as any;

      console.log('✅ Usuário criado com sucesso:', {
        id: user.id,
        email: user.email,
        nome: user.nome
      });

      const papel2 = (user as any).papel ? String((user as any).papel).toLowerCase() : '';
      const roleForFrontend2 = papel2 === 'admin' ? 'admin' : (papel2 === 'vendedor' || papel2 === 'seller' ? 'seller' : 'customer');

      return res.status(201).json({ 
        user: {
          ...userWithoutPassword,
          role: roleForFrontend2
        }, 
        token 
      });
    } catch (error) {
      console.error('❌ Erro ao registrar cliente:', error);
      return res.status(400).json({ error: 'Falha no registro' });
    }
  };

  public registerSeller = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data: SellerRegistration = req.body;
      const currentUser = req.user as any;

      if (!currentUser || !currentUser.id) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      // Verifica papel do usuário diretamente no banco (mais seguro que confiar apenas no token)
      const userInDb = await prisma.usuario.findUnique({ where: { id: currentUser.id } });
      if (!userInDb || String(userInDb.papel).toUpperCase() !== 'ADMIN') {
        return res.status(403).json({ error: 'Não autorizado. Apenas administradores podem criar vendedores.' });
      }

      // Verifica se já existe um usuário com o mesmo email
      const existingUser = await prisma.usuario.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Cria novo vendedor
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.usuario.create({
        data: {
          email: data.email,
          nome: data.name,
          senha: hashedPassword,
          papel: 'VENDEDOR',
          criadoPor: currentUser.id
        }
      });

      const token = generateToken(user as any);

      // Remove a senha do objeto de retorno
      const { senha: pwd, ...userWithoutPassword2 } = user as any;

      const papel3 = (user as any).papel ? String((user as any).papel).toLowerCase() : '';
      const roleForFrontend3 = papel3 === 'admin' ? 'admin' : (papel3 === 'vendedor' || papel3 === 'seller' ? 'seller' : 'customer');

      return res.status(201).json({ 
        user: {
          ...userWithoutPassword2,
          role: roleForFrontend3
        }, 
        token 
      });
    } catch (error) {
      console.error('Erro ao registrar vendedor:', error);
      return res.status(400).json({ error: 'Falha no registro do vendedor' });
    }
  };

  public listUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await prisma.usuario.findMany();
      const sanitized = users.map(u => {
        const { senha, ...rest } = u as any;
        return rest;
      });
      return res.json({ users: sanitized });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Falha ao listar usuários' });
    }
  };

  public deleteSeller = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const user = await prisma.usuario.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      if (String(user.papel).toUpperCase() !== 'VENDEDOR') {
        return res.status(400).json({ error: 'Operação permitida apenas para vendedores' });
      }

      await prisma.usuario.delete({ where: { id } });
      return res.json({ message: 'Vendedor excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      return res.status(500).json({ error: 'Falha ao excluir vendedor' });
    }
  };
}