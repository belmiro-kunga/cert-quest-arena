import { supabase } from '@/lib/supabase';
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
  porcentagem_desconto: number; // Campo obrigatório para o desconto
  simulado_ids?: string[];
}

// Dados de fallback para quando a API estiver indisponível
const fallbackPacotes: Pacote[] = [
  {
    id: 1,
    titulo: 'Pacote AWS Certified Solutions Architect',
    descricao: 'Prepare-se para a certificação AWS Solutions Architect com este pacote completo de simulados.',
    preco: 199.90,
    preco_usd: 39.99,
    is_gratis: false,
    duracao_dias: 90,
    ativo: true,
    is_subscription: false,
    subscription_duration: 0,
    subscription_currency: 'BRL',
    simulados: [
      { id: 'aws-saa-01', price: 79.90 },
      { id: 'aws-saa-02', price: 79.90 },
      { id: 'aws-saa-03', price: 79.90 }
    ],
    porcentagem_desconto: 20,
    categoria: 'aws',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    titulo: 'Pacote Microsoft Azure Administrator',
    descricao: 'Domine as habilidades necessárias para a certificação Azure Administrator com simulados práticos.',
    preco: 179.90,
    preco_usd: 35.99,
    is_gratis: false,
    duracao_dias: 90,
    ativo: true,
    is_subscription: false,
    subscription_duration: 0,
    subscription_currency: 'BRL',
    simulados: [
      { id: 'azure-admin-01', price: 69.90 },
      { id: 'azure-admin-02', price: 69.90 },
      { id: 'azure-admin-03', price: 69.90 }
    ],
    porcentagem_desconto: 15,
    categoria: 'azure',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Obter todos os pacotes ativos
export const getAllPacotes = async (): Promise<Pacote[]> => {
  try {
    const { data, error } = await supabase
      .from('pacotes')
      .select('*')
      .eq('ativo', true);

    if (error) {
      console.error('Erro ao buscar pacotes do Supabase:', error);
      console.log('Usando dados de fallback para pacotes devido a erro do Supabase');
      return fallbackPacotes;
    }
    
    // Se não houver dados ou se for um array vazio, usar fallback
    if (!data || data.length === 0) {
      console.log('Nenhum pacote encontrado no Supabase, usando dados de fallback');
      return fallbackPacotes;
    }
    
    return data;
  } catch (error) {
    // Capturar qualquer erro, incluindo erros de conexão
    console.error('Erro ao buscar pacotes:', error);
    console.log('Usando dados de fallback para pacotes devido a erro de conexão');
    return fallbackPacotes;
  }
};

// Obter pacote por ID
export const getPacoteById = async (id: string): Promise<Pacote> => {
  try {
    const { data, error } = await supabase
      .from('pacotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data) return data;

    // Se não encontrar no Supabase, usar fallback
    const fallbackPacote = fallbackPacotes.find(p => p.id.toString() === id);
    if (fallbackPacote) {
      console.log(`Usando dados de fallback para o pacote ${id} devido a erro`);
      return fallbackPacote;
    }
    return fallbackPacotes[0];
  } catch (error) {
    console.error(`Erro ao buscar pacote ${id}:`, error);
    const fallbackPacote = fallbackPacotes.find(p => p.id.toString() === id);
    return fallbackPacote || fallbackPacotes[0];
  }
};

// Obter pacotes por categoria
export const getPacotesByCategoria = async (categoria: string): Promise<Pacote[]> => {
  try {
    const { data, error } = await supabase
      .from('pacotes')
      .select('*')
      .eq('categoria', categoria)
      .eq('ativo', true);

    if (error) throw error;
    if (data && data.length > 0) return data;

    // Se não encontrar no Supabase, usar fallback
    const pacotesFiltrados = fallbackPacotes.filter(p => p.categoria === categoria);
    console.log(`Usando dados de fallback para pacotes da categoria ${categoria} devido a erro`);
    return pacotesFiltrados.length > 0 ? pacotesFiltrados : fallbackPacotes;
  } catch (error) {
    console.error(`Erro ao buscar pacotes da categoria ${categoria}:`, error);
    const pacotesFiltrados = fallbackPacotes.filter(p => p.categoria === categoria);
    return pacotesFiltrados.length > 0 ? pacotesFiltrados : fallbackPacotes;
  }
};

// Criar novo pacote (apenas admin)
export const createPacote = async (pacoteData: PacoteInput): Promise<Pacote> => {
  try {
    const { data, error } = await supabase
      .from('pacotes')
      .insert([{
        ...pacoteData,
        preco: pacoteData.preco_usd,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Pacote não foi criado');
    return data;
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    throw error;
  }
};

// Atualizar pacote existente (apenas admin)
export const updatePacote = async (id: string, pacoteData: PacoteInput): Promise<Pacote> => {
  try {
    const { data, error } = await supabase
      .from('pacotes')
      .update({
        ...pacoteData,
        preco: pacoteData.preco_usd,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Pacote não foi atualizado');
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar pacote com ID ${id}:`, error);
    throw error;
  }
};

// Excluir pacote (apenas admin)
export const deletePacote = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('pacotes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir pacote com ID ${id}:`, error);
    throw error;
  }
};

// Criar pacotes automaticamente a partir de simulados existentes (apenas admin)
export const criarPacotesAutomaticos = async (): Promise<{ message: string; pacotes: any[] }> => {
  try {
    // TODO: Implementar lógica de criação automática com Supabase
    console.log('TODO: Implementar criação automática de pacotes com Supabase');
    throw new Error('Funcionalidade ainda não implementada com Supabase');
  } catch (error) {
    console.error('Erro ao criar pacotes automáticos:', error);
    throw error;
  }
};

// Calcular o preço total de um pacote sem desconto
export const calcularPrecoTotalSemDesconto = (pacote: Pacote): number => {
  // Se o pacote tem um preço em USD definido, usá-lo diretamente
  if (typeof pacote.preco_usd === 'number' && !isNaN(pacote.preco_usd) && pacote.preco_usd > 0) {
    return pacote.preco_usd;
  }
  
  // Se o pacote tem um preço em BRL definido, usá-lo como fallback
  if (typeof pacote.preco === 'number' && !isNaN(pacote.preco) && pacote.preco > 0) {
    return pacote.preco;
  }
  
  // Se não tem preço definido, calcular baseado nos simulados
  if (Array.isArray(pacote.simulados) && pacote.simulados.length > 0) {
    return pacote.simulados.reduce((total, simulado) => {
      const price = typeof simulado.price === 'number' ? simulado.price : 0;
      return total + price;
    }, 0);
  }
  
  // Se não tem simulados ou preço, retornar 0
  return 0;
};

// Calcular o preço total de um pacote com desconto
export const calcularPrecoTotalComDesconto = (pacote: Pacote): number => {
  // Se o pacote é gratuito, retornar 0
  if (pacote.is_gratis) {
    return 0;
  }
  
  const precoTotal = calcularPrecoTotalSemDesconto(pacote);
  
  // Se não tem porcentagem de desconto definida ou é inválida, usar 0%
  const porcentagemDesconto = typeof pacote.porcentagem_desconto === 'number' && !isNaN(pacote.porcentagem_desconto) 
    ? pacote.porcentagem_desconto 
    : 0;
  
  const desconto = (precoTotal * porcentagemDesconto) / 100;
  return precoTotal - desconto;
};

// Calcular a economia em valor ao comprar o pacote
export const calcularEconomia = (pacote: Pacote): number => {
  // Se o pacote é gratuito, não há economia
  if (pacote.is_gratis) {
    return 0;
  }
  
  const precoTotalSemDesconto = calcularPrecoTotalSemDesconto(pacote);
  const precoTotalComDesconto = calcularPrecoTotalComDesconto(pacote);
  
  // Garantir que a economia não seja negativa
  return Math.max(0, precoTotalSemDesconto - precoTotalComDesconto);
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
