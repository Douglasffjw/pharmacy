import api from './api';
import { LoginCredentials, CustomerRegistration, SellerRegistration } from '../types/auth';

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerCustomer = async (data: CustomerRegistration) => {
  const response = await api.post('/auth/register-customer', data);
  return response.data;
};

export const registerSeller = async (data: SellerRegistration) => {
  const response = await api.post('/auth/register-seller', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const deleteSeller = async (id: string) => {
  const response = await api.delete(`/auth/sellers/${id}`);
  return response.data;
};