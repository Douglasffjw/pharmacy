import jwt from 'jsonwebtoken';
import { User, JwtPayload } from '../types/models';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no ambiente');
}

export const generateToken = (user: User): string => {
  const papelRaw: any = (user as any).papel || (user as any).role || '';
  const roleLower = String(papelRaw).toLowerCase();
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: roleLower === 'admin' ? 'admin' : (roleLower === 'vendedor' || roleLower === 'seller' ? 'vendedor' : 'cliente')
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return token;
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido');
  }
};