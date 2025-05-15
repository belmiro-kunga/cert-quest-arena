import { api } from './api';
import { Exam } from '@/types/admin';

// Interface para os pacotes de simulados
export interface Pacote {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  preco_usd: number;
  is_gratis: boolean;
  duracao_dias: number;
  ativo: boolean;
  is_subscription: boolean;
  subscription_duration: number;
  subscription_price?: number;
  subscription_currency: string;
  simulados: Array<{ id: string; price: number }>;
  porcentagem_desconto: number;
  categoria: string;
  created_at: string;
  updated_at: string;
}

// Interface para criação/atualização de pacotes
export interface PacoteInput {
  titulo: string;
  descricao: string;
  preco_usd: number;
  preco?: number; // Mantido para compatibilidade com backend
  is_gratis: boolean;
  duracao_dias?: number;
  ativo?: boolean;
  is_subscription?: boolean;
  subscription_duration?: number;
  subscription_price?: number;
  subscription_currency?: string;
  categoria?: string;
  porcentagem_desconto?: number;
  simulado_ids?: string[];
}

// Obter todos os pacotes ativos
export const getAllPacotes = async (): Promise<Pacote[]> => {
  try {
    const response = await api.get('/pacotes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    throw error;
  }
};

// Obter pacote por ID
export const getPacoteById = async (id: string): Promise<Pacote> => {
  try {
    const response = await api.get(`/pacotes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pacote com ID ${id}:`, error);
    throw error;
  }
};

// Obter pacotes por categoria
export const getPacotesByCategoria = async (categoria: string): Promise<Pacote[]> => {
  try {
    const response = await api.get(`/pacotes/categoria/${categoria}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pacotes da categoria ${categoria}:`, error);
    throw error;
  }
};

// Criar novo pacote (apenas admin)
export const createPacote = async (pacoteData: PacoteInput): Promise<Pacote> => {
  try {
    // Garantir que os IDs dos simulados sejam números
    const formattedData = {
      ...pacoteData,
      // Usar preco_usd como valor padrão para preco também para manter compatibilidade
      preco: pacoteData.preco_usd,
      simulado_ids: pacoteData.simulado_ids?.map(id => parseInt(id, 10))
    };
    
    const response = await api.post('/pacotes', formattedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    throw error;
  }
};

// Atualizar pacote existente (apenas admin)
export const updatePacote = async (id: string, pacoteData: PacoteInput): Promise<Pacote> => {
  try {
    // Garantir que os IDs dos simulados sejam números
    const formattedData = {
      ...pacoteData,
      // Usar preco_usd como valor padrão para preco também para manter compatibilidade
      preco: pacoteData.preco_usd,
      simulado_ids: pacoteData.simulado_ids?.map(id => parseInt(id, 10))
    };
    
    const response = await api.put(`/pacotes/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar pacote com ID ${id}:`, error);
    throw error;
  }
};

// Excluir pacote (apenas admin)
export const deletePacote = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pacotes/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir pacote com ID ${id}:`, error);
    throw error;
  }
};

// Criar pacotes automaticamente a partir de simulados existentes (apenas admin)
export const criarPacotesAutomaticos = async (): Promise<{ message: string; pacotes: any[] }> => {
  try {
    const response = await api.post('/pacotes/criar-automaticos');
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pacotes automáticos:', error);
    throw error;
  }
};

// Calcular o preço total de um pacote sem desconto
export const calcularPrecoTotalSemDesconto = (pacote: Pacote): number => {
  return pacote.simulados.reduce((total, simulado) => total + (simulado.price || 0), 0);
};

// Calcular o preço total de um pacote com desconto
export const calcularPrecoTotalComDesconto = (pacote: Pacote): number => {
  const precoTotal = calcularPrecoTotalSemDesconto(pacote);
  const desconto = (precoTotal * pacote.porcentagem_desconto) / 100;
  return precoTotal - desconto;
};

// Calcular a economia em valor ao comprar o pacote
export const calcularEconomia = (pacote: Pacote): number => {
  const precoTotalSemDesconto = calcularPrecoTotalSemDesconto(pacote);
  const precoTotalComDesconto = calcularPrecoTotalComDesconto(pacote);
  return precoTotalSemDesconto - precoTotalComDesconto;
};

export function calcularPrecoSubscricao(pacote: Pacote): number {
  if (!pacote.is_subscription || !pacote.subscription_price) {
    return pacote.preco;
  }
  return pacote.subscription_price;
}

export function verificarAcessoPacote(pacote: Pacote, userId: number): boolean {
  // Implementar lógica de verificação de acesso baseada na subscrição
  // Por enquanto, retorna true se o pacote for gratuito
  return pacote.is_gratis;
}
