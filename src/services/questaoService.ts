/**
 * Serviço para interagir com a API de questões
 */

import axios from 'axios';
import { BaseQuestion, MultipleChoiceQuestion, SingleChoiceQuestion } from '@/types/admin';
import { API_URL } from '@/config';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type { BaseQuestion };

// Interface para o tipo QuestaoBackend (backend)
export interface QuestaoBackend {
  id?: number;
  simulado_id: number;
  texto: string;
  tipo: string;
  explicacao?: string;
  categoria?: string;
  dificuldade?: string;
  pontos?: number;
  tags?: string[];
  opcoes?: OpcaoQuestao[];
  url_referencia?: string;
  referencia_ativa?: boolean;
}

// Interface para opções de questões
export interface OpcaoQuestao {
  id?: number;
  questao_id?: number;
  texto: string;
  correta: boolean;
}

// Função para converter QuestaoBackend (backend) para Question (frontend)
export const questaoToQuestion = (questao: QuestaoBackend): BaseQuestion => {
  const baseQuestion: BaseQuestion = {
    id: String(questao.id),
    examId: String(questao.simulado_id),
    type: questao.tipo as any,
    text: questao.texto,
    explanation: questao.explicacao || '',
    category: questao.categoria || '',
    difficulty: questao.dificuldade as any || 'Médio',
    tags: questao.tags || [],
    points: questao.pontos || 1
  };

  // Converter para o tipo específico de questão
  if (questao.tipo === 'multiple_choice' && questao.opcoes) {
    const multipleChoiceQuestion: MultipleChoiceQuestion = {
      ...baseQuestion,
      type: 'multiple_choice',
      options: questao.opcoes.map(opcao => opcao.texto),
      correctOptions: questao.opcoes.filter(opcao => opcao.correta).map(opcao => opcao.texto)
    };
    return multipleChoiceQuestion;
  } else if (questao.tipo === 'single_choice' && questao.opcoes) {
    const singleChoiceQuestion: SingleChoiceQuestion = {
      ...baseQuestion,
      type: 'single_choice',
      options: questao.opcoes.map(opcao => opcao.texto),
      correctOption: questao.opcoes.find(opcao => opcao.correta)?.texto || ''
    };
    return singleChoiceQuestion;
  }

  return baseQuestion;
};

// Função para converter Question (frontend) para QuestaoBackend (backend)
export const questionToQuestao = (question: BaseQuestion): QuestaoBackend => {
  const questao: QuestaoBackend = {
    id: question.id ? Number(question.id) : undefined,
    simulado_id: Number(question.examId),
    texto: question.text,
    tipo: question.type,
    explicacao: question.explanation,
    categoria: question.category,
    dificuldade: question.difficulty,
    pontos: question.points,
    tags: question.tags,
    url_referencia: (question as any).url_referencia || '',
    referencia_ativa: typeof (question as any).referencia_ativa === 'boolean' ? (question as any).referencia_ativa : true
  };

  // Converter opções baseado no tipo de questão
  if (question.type === 'multiple_choice') {
    const multipleChoiceQuestion = question as MultipleChoiceQuestion;
    questao.opcoes = multipleChoiceQuestion.options.map(option => ({
      texto: option,
      correta: multipleChoiceQuestion.correctOptions.includes(option)
    }));
  } else if (question.type === 'single_choice') {
    const singleChoiceQuestion = question as SingleChoiceQuestion;
    questao.opcoes = singleChoiceQuestion.options.map(option => ({
      texto: option,
      correta: option === singleChoiceQuestion.correctOption
    }));
  }

  return questao;
};

// Buscar todas as questões de um simulado
export const getQuestionsByExamId = async (examId: string): Promise<BaseQuestion[]> => {
  try {
    const response = await axios.get(`${API_URL}/questoes/simulado/${examId}`);
    return response.data.map(questaoToQuestion);
  } catch (error) {
    console.error(`Erro ao buscar questões do simulado ${examId}:`, error);
    throw error;
  }
};

// Tipos centralizados para o simulado
import type { Alternativa, Questao } from '@/types/simulado';

// Buscar todas as questões de um simulado para o simulado em andamento
export const getQuestoesBySimuladoId = async (simuladoId: number, language?: string): Promise<Questao[]> => {
  try {
    console.log(`Buscando questões do simulado ${simuladoId}...`);
    const url = language
      ? `${API_URL}/questoes/simulado/${simuladoId}?language=${language}`
      : `${API_URL}/questoes/simulado/${simuladoId}`;
    const response = await axios.get(url);
    console.log('Questões recebidas:', response.data);
    
    // Converter para o formato necessário para o simulado em andamento
    const questoes = response.data.map((questao: any) => {
      // Verificar se é múltipla escolha
      const isMultipleChoice = questao.tipo === 'multiple_choice';
      
      // Para múltipla escolha, capturamos todos os IDs das respostas corretas
      let resposta_correta: string | string[] = '';
      
      if (isMultipleChoice) {
        // Para múltipla escolha, criamos um array com os IDs das opções corretas
        resposta_correta = questao.opcoes
          ? questao.opcoes
              .filter((opcao: any) => opcao.correta)
              .map((opcao: any) => String(opcao.id))
          : [];
          
        console.log(`Questão de múltipla escolha (ID: ${questao.id}) - respostas corretas:`, resposta_correta);
      } else {
        // Para escolha única, só pegamos o ID da opção correta
        const corretaId = questao.opcoes
          ? questao.opcoes.find((opcao: any) => opcao.correta)?.id
          : undefined;
        
        resposta_correta = corretaId ? String(corretaId) : '';
      }
      
      return {
        id: questao.id,
        simulado_id: questao.simulado_id,
        enunciado: questao.texto,
        tipo: questao.tipo, // Adicionamos o tipo da questão
        alternativas: questao.opcoes ? questao.opcoes.map((opcao: any) => ({
          id: String(opcao.id),
          texto: opcao.texto,
          correta: opcao.correta || false
        })) : [],
        resposta_correta: resposta_correta,
        explicacao: questao.explicacao || 'Nenhuma explicação disponível para esta questão.',
        url_referencia: questao.url_referencia || '',
        referencia_ativa: typeof questao.referencia_ativa === 'boolean' ? questao.referencia_ativa : true
      };
    });
    
    console.log('Questões convertidas:', questoes);
    return questoes;
  } catch (error) {
    console.error(`Erro ao buscar questões do simulado ${simuladoId}:`, error);
    throw error;
  }
};

// Buscar uma questão específica pelo ID
export const getQuestionById = async (questionId: string): Promise<BaseQuestion> => {
  try {
    const response = await axios.get(`${API_URL}/questoes/${questionId}`);
    return questaoToQuestion(response.data);
  } catch (error) {
    console.error(`Erro ao buscar questão ${questionId}:`, error);
    throw error;
  }
};

// Criar uma nova questão
export const createQuestion = async (question: BaseQuestion): Promise<BaseQuestion> => {
  try {
    const questao = questionToQuestao(question);
    const response = await axios.post(`${API_URL}/questoes`, questao);
    return questaoToQuestion(response.data);
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    throw error;
  }
};

// Atualizar uma questão existente
export const updateQuestion = async (questionId: string, question: BaseQuestion): Promise<BaseQuestion> => {
  try {
    const questao = questionToQuestao(question);
    const response = await axios.put(`${API_URL}/questoes/${questionId}`, questao);
    return questaoToQuestion(response.data);
  } catch (error) {
    console.error(`Erro ao atualizar questão ${questionId}:`, error);
    throw error;
  }
};

// Excluir uma questão
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/questoes/${questionId}`);
  } catch (error) {
    console.error(`Erro ao excluir questão ${questionId}:`, error);
    throw error;
  }
};

type Questao = Database['public']['Tables']['questions']['Row'];
type QuestaoInsert = Database['public']['Tables']['questions']['Insert'];
type QuestaoUpdate = Database['public']['Tables']['questions']['Update'];

export const questaoService = {
  async getQuestoesBySimulado(simuladoId: string): Promise<Questao[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('simulado_id', simuladoId)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      return [];
    }
  },

  async getQuestaoById(id: string): Promise<Questao | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar questão:', error);
      return null;
    }
  },

  async createQuestao(questao: QuestaoInsert): Promise<Questao | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(questao)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      return null;
    }
  },

  async updateQuestao(id: string, questao: QuestaoUpdate): Promise<Questao | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(questao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      return null;
    }
  },

  async deleteQuestao(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      return false;
    }
  },

  async getQuestoesByCategory(category: string): Promise<Questao[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar questões por categoria:', error);
      return [];
    }
  },

  async getQuestoesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Questao[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('difficulty', difficulty)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar questões por dificuldade:', error);
      return [];
    }
  },

  async searchQuestoes(query: string): Promise<Questao[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .or(`question_text.ilike.%${query}%,explanation.ilike.%${query}%`)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      return [];
    }
  }
};
