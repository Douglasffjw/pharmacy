import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Configura o dotenv com o caminho absoluto do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import authRouter from './routes/auth';
import { authMiddleware, adminMiddleware } from './middlewares/auth';
import { seedDatabase } from './seed';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';



const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], // URLs do frontend
  credentials: true
}));
app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas de autenticação (router)
app.use('/auth', authRouter);

// Rotas de produtos
app.use('/products', productRoutes);

// Rotas de pedidos
app.use('/orders', orderRoutes);

// Inicialização do servidor
app.listen(port, async () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  
  // Inicializa o banco de dados com o usuário admin
  await seedDatabase();
});