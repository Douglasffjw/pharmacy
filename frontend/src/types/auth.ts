export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Customer extends User {
  role: 'customer';
  phone: string;
  birthDate: string;
}

export interface Seller extends User {
  role: 'seller';
  registrationNumber: string; // Número de registro profissional
  createdBy?: string; // ID do vendedor que criou este vendedor
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CustomerRegistration extends Omit<Customer, 'id' | 'role'> {
  password: string;
}

export interface SellerRegistration extends Omit<Seller, 'id' | 'role'> {
  password: string;
}

export interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerCustomer: (data: CustomerRegistration) => Promise<void>;
  registerSeller: (data: SellerRegistration) => Promise<void>;
}