import axios from 'axios';
import { API_URL } from '@/config';

/**
 * Função para testar a conexão com a API
 * @returns Promise<boolean> - true se a API estiver disponível, false caso contrário
 */
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao testar conexão com a API:', error);
    return false;
  }
};

/**
 * Função para testar a rota de registro
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param name Nome do usuário
 * @returns Promise<any> - Dados do usuário registrado ou erro
 */
export const testRegister = async (email: string, password: string, name: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao testar registro:', error);
    throw new Error(error.response?.data?.error || 'Erro ao registrar usuário');
  }
};
