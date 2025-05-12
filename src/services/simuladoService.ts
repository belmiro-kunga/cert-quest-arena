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
  // Log para depuração
  console.log('Convertendo simulado:', simulado);
  
  // Garantir que todos os campos obrigatórios tenham valores padrão
  const exam = {
    id: String(simulado.id || 0),
    title: simulado.titulo || 'Sem título',
    description: simulado.descricao || '',
    isFree: simulado.is_gratis || false,
    price: typeof simulado.preco === 'number' ? simulado.preco : (simulado.preco ? parseFloat(simulado.preco) : 0),
    discountPrice: simulado.preco_desconto ? parseFloat(String(simulado.preco_desconto)) : null,
    discountPercentage: simulado.porcentagem_desconto,
    discountExpiresAt: simulado.desconto_expira_em,
    // Garantir que quantidade_questoes seja tratado como número, mesmo que venha como string
    questionsCount: typeof simulado.quantidade_questoes === 'number' 
      ? simulado.quantidade_questoes 
      : (simulado.quantidade_questoes ? parseInt(String(simulado.quantidade_questoes), 10) : 0),
    duration: simulado.duracao_minutos || 60,
    difficulty: simulado.nivel_dificuldade || 'Médio',
    passingScore: simulado.nota_minima || 70,
    createdAt: simulado.data_criacao,
    active: simulado.ativo === true
  };
  
  // Log para depuração
  console.log('Exam convertido:', exam);
  
  return exam;
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
 * Busca um simulado pelo ID e converte para o formato Exam
 */
export const getSimuladoById = async (id: number): Promise<Exam> => {
  try {
    console.log(`Buscando simulado com ID ${id}...`);
    const response = await axios.get(`${API_URL}/simulados/${id}`);
    console.log('Resposta da API:', response.data);
    
    if (!response.data) {
      throw new Error(`Simulado com ID ${id} não encontrado`);
    }
    
    return simuladoToExam(response.data);
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
    console.error(`Erro ao excluir simulado ${id}:`, error);
    throw error;
  }
};

// Busca todos os simulados ativos para os alunos
export const getActiveExams = async (): Promise<Exam[]> => {
  try {
    console.log('Chamando API para buscar simulados ativos:', `${API_URL}/simulados/ativos`);
    const response = await axios.get(`${API_URL}/simulados/ativos`);
    console.log('Resposta da API de simulados ativos:', response.data);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Resposta da API não é um array:', response.data);
      return [];
    }
    
    const exams = response.data.map(simulado => {
      console.log('Convertendo simulado para exam:', simulado);
      return simuladoToExam(simulado);
    });
    
    console.log('Exams convertidos:', exams);
    return exams;
  } catch (error) {
    console.error('Erro ao buscar simulados ativos:', error);
    throw error;
  }
};


