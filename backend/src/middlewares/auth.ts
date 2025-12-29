import type { Request, Response, NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/models';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authorization.replace('Bearer ', '').trim();

  // O bloco try...catch DEVE começar AQUI, dentro da função. ✅
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('Erro crítico: JWT_SECRET não está definido.');
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      req.user = decoded;
      return next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error("Erro específico do JWT:", {
          name: error.name,
          message: error.message
        });
      }
      throw error;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Falha na verificação do token:', err.message);
    } else {
      console.error('Falha na verificação do token:', err);
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
} // <- A função authMiddleware termina aqui.

export function sellerMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  const role = String(req.user.role).toLowerCase();
  if (role !== 'vendedor' && role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas vendedores ou administradores podem acessar este recurso.' });
  }
  return next();
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  return next();
}