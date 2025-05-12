/**
 * Serviço para interagir com a API de simulados
 */

import axios from 'axios';

// Defina a URL base da API
const API_URL = 'http://localhost:3001/api';

// Interface para o tipo Simulado
export interface Simulado {
  id?: number;
  titulo: string;
  descricao?: string;
  is_gratis?: boolean;
  preco?: number;
  preco_desconto?: number | null;
  porcentagem_desconto?: number | null;
  desconto_expira_em?: string | null;
  quantidade_questoes?: number;
  duracao_minutos: number;
  nivel_dificuldade?: string;
  nota_minima?: number;
  data_criacao?: string;
  ativo?: boolean;
}

// Interface para mapear entre o tipo Exam do frontend e o tipo Simulado do backend
export interface Exam {
  id: string;
  title: string;
  description: string;
  isFree?: boolean;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  discountExpiresAt?: string | null;
  questionsCount: number;
  duration: number;
  difficulty: string;
  passingScore: number;
  createdAt?: string;
  active?: boolean;
}

// Função para converter Simulado (backend) para Exam (frontend)
export const simuladoToExam = (simulado: Simulado): Exam => {
  return {
    id: String(simulado.id),
    title: simulado.titulo,
    description: simulado.descricao || '',
    isFree: simulado.is_gratis,
    price: simulado.preco || 0,
    discountPrice: simulado.preco_desconto,
    discountPercentage: simulado.porcentagem_desconto,
    discountExpiresAt: simulado.desconto_expira_em,
    questionsCount: simulado.quantidade_questoes || 0,
    duration: simulado.duracao_minutos,
    difficulty: simulado.nivel_dificuldade || 'Médio',
    passingScore: simulado.nota_minima || 70,
    createdAt: simulado.data_criacao,
    active: simulado.ativo
  };
};

// Função para converter Exam (frontend) para Simulado (backend)
export const examToSimulado = (exam: Exam): Simulado => {
  return {
    id: exam.id ? Number(exam.id) : undefined,
    titulo: exam.title,
    descricao: exam.description,
    is_gratis: exam.isFree,
    preco: exam.price,
    preco_desconto: exam.discountPrice,
    porcentagem_desconto: exam.discountPercentage,
    desconto_expira_em: exam.discountExpiresAt,
    quantidade_questoes: exam.questionsCount,
    duracao_minutos: exam.duration,
    nivel_dificuldade: exam.difficulty,
    nota_minima: exam.passingScore,
    ativo: exam.active
  };
};

/**
 * Busca todos os simulados e converte para o formato Exam
 */
export const getExams = async (): Promise<Exam[]> => {
  try {
    const response = await axios.get(`${API_URL}/simulados`);
    return response.data.map(simuladoToExam);
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    throw error;
  }
};

/**
 * Busca todos os simulados no formato original
 */
export const getSimulados = async (): Promise<Simulado[]> => {
  try {
    const response = await axios.get(`${API_URL}/simulados`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    throw error;
  }
};

/**
 * Busca um simulado pelo ID e converte para o formato Exam
 */
export const getExamById = async (id: string): Promise<Exam> => {
  try {
    const response = await axios.get(`${API_URL}/simulados/${id}`);
    return simuladoToExam(response.data);
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Busca um simulado pelo ID no formato original
 */
export const getSimuladoById = async (id: number): Promise<Simulado> => {
  try {
    const response = await axios.get(`${API_URL}/simulados/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo exame (converte de Exam para Simulado e depois cria)
 */
export const createExam = async (exam: Exam): Promise<Exam> => {
  console.log('Enviando dados para criar exame:', exam);
  try {
    // Converter para o formato do backend
    const simulado = examToSimulado(exam);
    console.log('Dados convertidos para formato do backend:', simulado);
    
    const response = await axios.post(`${API_URL}/simulados`, simulado);
    console.log('Resposta do servidor:', response.data);
    return simuladoToExam(response.data);
  } catch (error: any) {
    console.error('Erro ao criar exame:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Resposta de erro do servidor:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    throw error;
  }
};

/**
 * Cria um novo simulado no formato original
 */
export const createSimulado = async (simulado: Simulado): Promise<Simulado> => {
  console.log('Enviando dados para criar simulado:', simulado);
  try {
    // Garantir que duracao_minutos seja um número
    const dadosParaEnviar = {
      ...simulado,
      duracao_minutos: Number(simulado.duracao_minutos)
    };
    
    console.log('Dados formatados para envio:', dadosParaEnviar);
    
    const response = await axios.post(`${API_URL}/simulados`, dadosParaEnviar);
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar simulado:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Resposta de erro do servidor:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    throw error;
  }
};

/**
 * Atualiza um exame existente (converte de Exam para Simulado e depois atualiza)
 */
export const updateExam = async (id: string, exam: Exam): Promise<Exam> => {
  try {
    // Converter para o formato do backend
    const simulado = examToSimulado(exam);
    console.log(`Atualizando exame com ID ${id}:`, simulado);
    
    const response = await axios.put(`${API_URL}/simulados/${id}`, simulado);
    return simuladoToExam(response.data);
  } catch (error) {
    console.error(`Erro ao atualizar exame com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Atualiza um simulado existente no formato original
 */
export const updateSimulado = async (id: number, simulado: Simulado): Promise<Simulado> => {
  try {
    const response = await axios.put(`${API_URL}/simulados/${id}`, simulado);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta um exame
 */
export const deleteExam = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/simulados/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar exame com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta um simulado
 */
export const deleteSimulado = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/simulados/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar simulado com ID ${id}:`, error);
    throw error;
  }
};
