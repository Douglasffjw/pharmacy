export interface User {
  id: string;
  email: string;
  nome: string;
  senha?: string;
  telefone?: string;
  dataNascimento?: string;
  papel: 'cliente' | 'vendedor' | 'admin';
  criadoPor?: string; // ID do vendedor que criou (apenas para vendedores)
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
  phone?: string;
  birthDate?: string;
}

export interface SellerRegistration extends CustomerRegistration {
  createdBy: string; // ID do vendedor que está criando o novo vendedor
}