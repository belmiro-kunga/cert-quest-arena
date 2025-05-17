import axios from 'axios';
import { API_URL } from '@/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export const userService = {
  // Buscar todos os usuários (apenas para administradores)
  async getAllUsers(): Promise<User[]> {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer admin-token`
        }
      });

      return response.data.users;
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar usuários');
    }
  },

  // Buscar usuários por papel (role)
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.get(`${API_URL}/users?role=${role}`, {
        headers: {
          Authorization: `Bearer admin-token`
        }
      });

      return response.data.users;
    } catch (error: any) {
      console.error(`Erro ao buscar usuários com papel ${role}:`, error);
      throw new Error(error.response?.data?.error || `Erro ao buscar usuários com papel ${role}`);
    }
  },

  // Buscar um usuário específico
  async getUserById(userId: string): Promise<User> {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer admin-token`
        }
      });

      return response.data.user;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar usuário');
    }
  },

  // Atualizar um usuário
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer admin-token`
        }
      });

      return response.data.user;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar usuário');
    }
  },

  // Excluir um usuário
  async deleteUser(userId: string): Promise<void> {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer admin-token`
        }
      });
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao excluir usuário');
    }
  }
};
