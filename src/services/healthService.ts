import axios from 'axios';
import { API_URL } from '@/config';

/**
 * Serviço para verificar a saúde da API
 */

// Verificar se a API está disponível
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    // Configurar um timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    // Tentar acessar o endpoint de saúde da API
    const response = await axios.get(`${API_URL}/health`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Se a resposta for bem-sucedida (status 200), a API está disponível
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao verificar a saúde da API:', error);
    return false;
  }
};

// Verificar se o endpoint de simulados está disponível
export const checkSimuladosEndpoint = async (): Promise<boolean> => {
  try {
    // Configurar um timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    // Tentar acessar o endpoint de simulados da API
    const response = await axios.get(`${API_URL}/simulados`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Se a resposta for bem-sucedida (status 200), o endpoint está disponível
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao verificar o endpoint de simulados:', error);
    return false;
  }
};

// Verificar a disponibilidade de todos os endpoints críticos
export const checkAllEndpoints = async (): Promise<{
  health: boolean;
  simulados: boolean;
  overall: boolean;
}> => {
  const healthStatus = await checkAPIHealth();
  const simuladosStatus = await checkSimuladosEndpoint();
  
  return {
    health: healthStatus,
    simulados: simuladosStatus,
    overall: healthStatus && simuladosStatus
  };
};

export default {
  checkAPIHealth,
  checkSimuladosEndpoint,
  checkAllEndpoints
};
