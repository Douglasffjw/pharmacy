import type { Request, Response, NextFunction } from 'express-serve-static-core';
import { JwtPayload } from '../types/models';

export const sellerAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload | undefined;

  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (String(user.role).toLowerCase() !== 'vendedor') {
    const role = String(user.role).toLowerCase();
    if (role !== 'vendedor' && role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas vendedores têm permissão.' });
    }
  }

  next();
};

export const canCreateSeller = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload | undefined;

  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (String(user.role).toLowerCase() !== 'vendedor') {
    // Agora somente administradores podem criar vendedores
    if (String(user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem criar vendedores.' });
    }
  }

  // Adiciona o ID do vendedor que está criando
  req.body.createdBy = user.id;

  next();
};
