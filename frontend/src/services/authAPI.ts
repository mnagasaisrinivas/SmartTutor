
import { api } from './api';
import { User, LoginResponse, RegisterResponse } from '@/types';

class AuthAPI {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  async register(fullName: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await api.post('/api/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  }
}

export const authAPI = new AuthAPI();
