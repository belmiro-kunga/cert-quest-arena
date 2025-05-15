import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalExams: number;
  completedExams: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface Payment {
  id: string;
  user_id: string;
  userName?: string;
  amount: number;
  status: string;
  method: string;
  created_at: string;
  updated_at?: string;
  transaction_id?: string;
  order_id?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/admin/users/${userId}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

export const getStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

export const getSystemLogs = async (page: number = 1, limit: number = 50): Promise<any[]> => {
  try {
    const response = await api.get('/admin/logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar logs do sistema:', error);
    return [];
  }
};

export const getErrorLogs = async (page: number = 1, limit: number = 50): Promise<any[]> => {
  try {
    const response = await api.get('/admin/error-logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar logs de erro:', error);
    return [];
  }
};

export const clearLogs = async (): Promise<void> => {
  try {
    await api.delete('/admin/logs');
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    throw error;
  }
};

export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const response = await api.get('/admin/payments');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return [];
  }
};

export const fetchLanguages = async (): Promise<Language[]> => {
  try {
    const response = await api.get('/admin/languages');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar idiomas:', error);
    return [];
  }
};

export const createLanguage = async (language: Language): Promise<Language> => {
  try {
    const response = await api.post('/admin/languages', language);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar idioma:', error);
    throw error;
  }
};

export const updateLanguage = async (language: Language): Promise<Language> => {
  try {
    const response = await api.put(`/admin/languages/${language.code}`, language);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar idioma:', error);
    throw error;
  }
};

export const deleteLanguage = async (code: string): Promise<void> => {
  try {
    await api.delete(`/admin/languages/${code}`);
  } catch (error) {
    console.error('Erro ao deletar idioma:', error);
    throw error;
  }
};

export const getAllExams = async (): Promise<Exam[]> => {
  try {
    const response = await api.get('/simulados/ativos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    return [];
  }
};
