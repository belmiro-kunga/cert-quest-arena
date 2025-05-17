import axios from 'axios';
import { API_URL } from '@/config';

// Criar uma instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
  withCredentials: true, // Importante para CORS com cookies
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratar erros específicos aqui (ex: 401, 403, etc.)
    if (error.response && error.response.status === 401) {
      // Redirecionar para login ou limpar o localStorage
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
