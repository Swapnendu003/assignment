import axiosInstance from './axios';
import { API_ROUTES } from '@/constants/api';
import { setCookie, removeCookie } from '@/utils/cookies';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );
    
    // Store token in cookie
    setCookie('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      credentials
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  removeCookie('token');
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw error;
  }
};