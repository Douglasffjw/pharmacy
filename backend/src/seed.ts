import prisma from './lib/prisma';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Verifica se o admin já existe
    let adminUser = await prisma.usuario.findUnique({
      where: { email: 'admin@farmasaude.com' }
    });

    if (!adminUser) {
      // Cria o usuário admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await prisma.usuario.create({
        data: {
          email: 'admin@farmasaude.com',
          nome: 'Admin FarmaSaúde',
          senha: hashedPassword,
          papel: 'ADMIN' as const
        }
      });
      console.log('👤 Usuário admin criado com sucesso!');
    } else {
      console.log('✅ Usuário admin já existe.');
    }

    // Verifica se já existem produtos
    const productCount = await prisma.produto.count();
    
    if (productCount === 0) {
      console.log('📦 Criando produtos de exemplo...');
      
      const sampleProducts = [
        // Note: fixed `id` values are set to match the frontend static dataset IDs
        // so the demo frontend (which uses static product IDs) can place orders
        // without changing the frontend. If you prefer, remove `id` fields
        // and use API-backed products on the frontend instead.
        {
          id: '1',
          nome: 'Paracetamol 500mg',
          descricao: 'Analgésico e antitérmico para dor e febre',
          preco: 8.50,
          categoria: 'Medicamentos',
          marca: 'Genérico',
          quantidade: 100,
          emEstoque: true,
          imagens: ['/images/products/paracetamol.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '2',
          nome: 'Ibuprofeno 600mg',
          descricao: 'Anti-inflamatório para dores e inflamações',
          preco: 12.90,
          categoria: 'Medicamentos',
          marca: 'Advil',
          quantidade: 80,
          emEstoque: true,
          imagens: ['/images/products/ibuprofeno.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '3',
          nome: 'Dipirona 500mg',
          descricao: 'Analgésico e antitérmico de ação rápida',
          preco: 6.75,
          categoria: 'Medicamentos',
          marca: 'Novalgina',
          quantidade: 120,
          emEstoque: true,
          imagens: ['/images/products/dipirona.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '4',
          nome: 'Vitamina C 1g',
          descricao: 'Suplemento vitamínico para imunidade',
          preco: 15.80,
          categoria: 'Vitaminas',
          marca: 'Centrum',
          quantidade: 60,
          emEstoque: true,
          imagens: ['/images/products/vitamina-c.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '5',
          nome: 'Protetor Solar FPS 60',
          descricao: 'Proteção solar para pele sensível',
          preco: 35.90,
          categoria: 'Dermocosméticos',
          marca: 'La Roche Posay',
          quantidade: 40,
          emEstoque: true,
          imagens: ['/images/products/protetor-solar.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '6',
          nome: 'Shampoo Anticaspa',
          descricao: 'Tratamento para caspa e coceira no couro cabeludo',
          preco: 22.50,
          categoria: 'Higiene',
          marca: 'Head & Shoulders',
          quantidade: 35,
          emEstoque: true,
          imagens: ['/images/products/shampoo.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '7',
          nome: 'Termômetro Digital',
          descricao: 'Termômetro digital com display LCD',
          preco: 28.90,
          categoria: 'Equipamentos',
          marca: 'G-Tech',
          quantidade: 25,
          emEstoque: true,
          imagens: ['/images/products/termometro.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '8',
          nome: 'Máscara Cirúrgica (50un)',
          descricao: 'Máscaras descartáveis tripla camada',
          preco: 45.00,
          categoria: 'Equipamentos',
          marca: 'Descarpack',
          quantidade: 50,
          emEstoque: true,
          imagens: ['/images/products/mascara.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '9',
          nome: 'Omeprazol 20mg',
          descricao: 'Protetor gástrico para acidez e azia',
          preco: 18.40,
          categoria: 'Medicamentos',
          marca: 'Genérico',
          quantidade: 70,
          emEstoque: true,
          imagens: ['/images/products/omeprazol.jpg'],
          receita: false,
          criadoPor: adminUser.id
        },
        {
          id: '10',
          nome: 'Multivitamínico',
          descricao: 'Complexo com vitaminas e minerais essenciais',
          preco: 42.80,
          categoria: 'Vitaminas',
          marca: 'Centrum',
          quantidade: 30,
          emEstoque: true,
          imagens: ['/images/products/multivitaminico.jpg'],
          receita: false,
          criadoPor: adminUser.id
        }
      ];

      // Criar produtos em lote
      await prisma.produto.createMany({
        data: sampleProducts
      });

      console.log(`✅ ${sampleProducts.length} produtos criados com sucesso!`);
    } else {
      console.log(`✅ Banco já possui ${productCount} produtos.`);
    }

    // Criar um cliente de exemplo
    const customerExists = await prisma.usuario.findUnique({
      where: { email: 'cliente@exemplo.com' }
    });

    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await prisma.usuario.create({
        data: {
          email: 'cliente@exemplo.com',
          nome: 'Cliente Exemplo',
          senha: hashedPassword,
          papel: 'CLIENTE' as const,
          telefone: '11999999999',
          dataNascimento: new Date('1990-01-01')
        }
      });
      console.log('👤 Cliente exemplo criado com sucesso!');
    } else {
      console.log('✅ Cliente exemplo já existe.');
    }

      // Criar um vendedor de exemplo
      const sellerExists = await prisma.usuario.findUnique({
        where: { email: 'vendedor@exemplo.com' }
      });

      if (!sellerExists) {
        const hashedPassword = await bcrypt.hash('vendedor123', 10);
        await prisma.usuario.create({
          data: {
            email: 'vendedor@exemplo.com',
            nome: 'Vendedor Exemplo',
            senha: hashedPassword,
            papel: 'VENDEDOR',
            criadoPor: adminUser.id
          }
        });
        console.log('👤 Vendedor exemplo criado com sucesso!');
      } else {
        console.log('✅ Vendedor exemplo já existe.');
      }

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📝 Credenciais criadas:');
    console.log('🔑 Admin: admin@farmasaude.com / admin123');
    console.log('🔑 Cliente: cliente@exemplo.com / 123456');
      console.log('🔑 Vendedor: vendedor@exemplo.com / vendedor123');

  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error);
    throw error;
  }
}