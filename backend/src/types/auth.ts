import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  nome: string;
  papel: 'CLIENTE' | 'VENDEDOR' | 'ADMIN' | 'cliente' | 'vendedor' | 'admin';
  criadoPor?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: 'cliente' | 'vendedor' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CustomerRegistration extends LoginCredentials {
  name: string;
}

export interface SellerRegistration extends CustomerRegistration {
  createdBy?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

