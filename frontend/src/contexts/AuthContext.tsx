import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  User,
  AuthContextData,
  LoginCredentials,
  CustomerRegistration,
  SellerRegistration
} from '../types/auth';
import * as authService from '../services/auth';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Verificar se há usuário no localStorage
    const storedUser = localStorage.getItem('@FarmaSaude:user');
    const storedToken = localStorage.getItem('@FarmaSaude:token');
    
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
    
    return null;
  });
  
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      localStorage.setItem('@FarmaSaude:user', JSON.stringify(response.user));
      localStorage.setItem('@FarmaSaude:token', response.token);
      
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@FarmaSaude:user');
    localStorage.removeItem('@FarmaSaude:token');
    setUser(null);
  }, []);

  const registerCustomer = useCallback(async (data: CustomerRegistration) => {
    try {
      setLoading(true);
      const response = await authService.registerCustomer(data);
      
      localStorage.setItem('@FarmaSaude:user', JSON.stringify(response.user));
      localStorage.setItem('@FarmaSaude:token', response.token);
      
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerSeller = useCallback(async (data: SellerRegistration) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      if (user.role !== 'admin') {
        throw new Error('Apenas administradores podem registrar vendedores');
      }
      await authService.registerSeller(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        loading,
        login,
        logout,
        registerCustomer,
        registerSeller
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};