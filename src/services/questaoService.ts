/**
 * Serviço para interagir com a API de questões
 */

import axios from 'axios';
import { BaseQuestion, MultipleChoiceQuestion, SingleChoiceQuestion } from '@/types/admin';

export type { BaseQuestion };

// Defina a URL base da API
const API_URL = 'http://localhost:3001/api';

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
    tags: question.tags
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

// Interface para alternativa de questão (formato para o simulado em andamento)
export interface Alternativa {
  id: string;
  texto: string;
  correta?: boolean;
}

// Interface para questão (formato para o simulado em andamento)
export interface Questao {
  id: number;
  simulado_id: number;
  enunciado: string;
  alternativas: Alternativa[];
  resposta_correta?: string;
}

// Buscar todas as questões de um simulado para o simulado em andamento
export const getQuestoesBySimuladoId = async (simuladoId: number): Promise<Questao[]> => {
  try {
    console.log(`Buscando questões do simulado ${simuladoId}...`);
    const response = await axios.get(`${API_URL}/questoes/simulado/${simuladoId}`);
    console.log('Questões recebidas:', response.data);
    
    // Converter para o formato necessário para o simulado em andamento
    const questoes = response.data.map((questao: any) => {
      const corretaId = questao.opcoes ? 
        questao.opcoes.find((opcao: any) => opcao.correta)?.id : undefined;
        
      return {
        id: questao.id,
        simulado_id: questao.simulado_id,
        enunciado: questao.texto,
        alternativas: questao.opcoes ? questao.opcoes.map((opcao: any) => ({
          id: String(opcao.id || Math.random().toString(36).substr(2, 9)),
          texto: opcao.texto,
          correta: opcao.correta || false
        })) : [],
        resposta_correta: corretaId ? String(corretaId) : undefined
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
