import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, adminMiddleware, sellerMiddleware } from '../middlewares/auth';

const authRouter = Router();
const authController = new AuthController();

// Rotas públicas
authRouter.post('/login', authController.login);
authRouter.post('/register-customer', authController.registerCustomer);

// Rotas protegidas
authRouter.post('/register-seller', authMiddleware, adminMiddleware, authController.registerSeller);

// Admin routes: listar usuários e deletar vendedor
authRouter.get('/users', authMiddleware, adminMiddleware, authController.listUsers);
authRouter.delete('/sellers/:id', authMiddleware, adminMiddleware, authController.deleteSeller);

export default authRouter;