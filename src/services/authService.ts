import axios from 'axios';
import { API_URL } from '@/config';

export interface AffiliateInfo {
  status: 'pending' | 'approved' | 'rejected' | null;
  earnings: number;
  referrals: number;
  link: string;
  applicationDate?: string;
}

export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  photoURL?: string;
  affiliate?: AffiliateInfo;
  twoFactorAuth?: TwoFactorAuth;
  createdAt?: string;
  updatedAt?: string;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      // Registra o usuário na API local
      const response = await axios.post(`${API_URL}/auth/register`, {
        nome: name,
        email: email,
        senha: password
      });

      // Armazenar o token no localStorage
      localStorage.setItem('token', response.data.token);

      return response.data.user;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.response?.data?.error || 'Erro ao registrar usuário');
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      // Armazenar o token no localStorage
      localStorage.setItem('token', response.data.token);

      return response.data.user;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.error || 'Credenciais inválidas');
    }
  },

  async signOut(): Promise<void> {
    try {
      // Remover o token do localStorage
      localStorage.removeItem('token');
      
      // Opcional: notificar o servidor sobre o logout
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error: any) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, remover o token local
      localStorage.removeItem('token');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.user;
    } catch (error: any) {
      console.error('Erro ao buscar usuário atual:', error);
      // Se o token for inválido, remover do localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        return null;
      }
      return null;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email });
    } catch (error: any) {
      console.error('Erro na redefinição de senha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao solicitar redefinição de senha');
    }
  },

  async updatePassword(password: string, token?: string): Promise<void> {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('Usuário não autenticado');
      }

      await axios.post(
        `${API_URL}/auth/update-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar senha');
    }
  },
}; 