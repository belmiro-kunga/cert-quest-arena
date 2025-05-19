import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para as tabelas de estatísticas que ainda não existem no Supabase
interface UserStats {
  id: string;
  user_id: string;
  total_simulados: number;
  completed_simulados: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  average_score: number;
  best_score: number;
  total_time: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface SimuladoStats {
  id: string;
  simulado_id: string;
  total_participants: number;
  average_score: number;
  best_score: number;
  worst_score: number;
  completion_rate: number;
  average_time: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface QuestionStats {
  id: string;
  question_id: string;
  total_attempts: number;
  correct_attempts: number;
  wrong_attempts: number;
  difficulty_score: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

type UserStatsInsert = Omit<UserStats, 'id' | 'created_at' | 'updated_at'>;
type UserStatsUpdate = Partial<UserStatsInsert>;
type SimuladoStatsInsert = Omit<SimuladoStats, 'id' | 'created_at' | 'updated_at'>;
type SimuladoStatsUpdate = Partial<SimuladoStatsInsert>;
type QuestionStatsInsert = Omit<QuestionStats, 'id' | 'created_at' | 'updated_at'>;
type QuestionStatsUpdate = Partial<QuestionStatsInsert>;

export const statsService = {
  // Métodos para Estatísticas de Usuário
  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas do usuário:', error);
      return null;
    }
  },

  async updateUserStats(userId: string, stats: UserStatsUpdate): Promise<UserStats | null> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .upsert({ user_id: userId, ...stats })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar estatísticas do usuário:', error);
      return null;
    }
  },

  async incrementUserStats(userId: string, field: keyof UserStatsUpdate, value: number = 1): Promise<UserStats | null> {
    try {
      const { data, error } = await supabase.rpc('increment_user_stats', {
        p_user_id: userId,
        p_field: field,
        p_value: value
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao incrementar estatísticas do usuário:', error);
      return null;
    }
  },

  // Métodos para Estatísticas de Simulado
  async getSimuladoStats(simuladoId: string): Promise<SimuladoStats | null> {
    try {
      const { data, error } = await supabase
        .from('simulado_stats')
        .select('*')
        .eq('simulado_id', simuladoId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas do simulado:', error);
      return null;
    }
  },

  async updateSimuladoStats(simuladoId: string, stats: SimuladoStatsUpdate): Promise<SimuladoStats | null> {
    try {
      const { data, error } = await supabase
        .from('simulado_stats')
        .upsert({ simulado_id: simuladoId, ...stats })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar estatísticas do simulado:', error);
      return null;
    }
  },

  async incrementSimuladoStats(simuladoId: string, field: keyof SimuladoStatsUpdate, value: number = 1): Promise<SimuladoStats | null> {
    try {
      const { data, error } = await supabase.rpc('increment_simulado_stats', {
        p_simulado_id: simuladoId,
        p_field: field,
        p_value: value
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao incrementar estatísticas do simulado:', error);
      return null;
    }
  },

  // Métodos para Estatísticas de Questão
  async getQuestionStats(questionId: string): Promise<QuestionStats | null> {
    try {
      const { data, error } = await supabase
        .from('question_stats')
        .select('*')
        .eq('question_id', questionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas da questão:', error);
      return null;
    }
  },

  async updateQuestionStats(questionId: string, stats: QuestionStatsUpdate): Promise<QuestionStats | null> {
    try {
      const { data, error } = await supabase
        .from('question_stats')
        .upsert({ question_id: questionId, ...stats })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar estatísticas da questão:', error);
      return null;
    }
  },

  async incrementQuestionStats(questionId: string, field: keyof QuestionStatsUpdate, value: number = 1): Promise<QuestionStats | null> {
    try {
      const { data, error } = await supabase.rpc('increment_question_stats', {
        p_question_id: questionId,
        p_field: field,
        p_value: value
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao incrementar estatísticas da questão:', error);
      return null;
    }
  },

  // Métodos para Relatórios e Análises
  async getTopUsers(limit: number = 10): Promise<UserStats[]> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('average_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar top usuários:', error);
      return [];
    }
  },

  async getTopSimulados(limit: number = 10): Promise<SimuladoStats[]> {
    try {
      const { data, error } = await supabase
        .from('simulado_stats')
        .select('*')
        .order('average_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar top simulados:', error);
      return [];
    }
  },

  async getMostDifficultQuestions(limit: number = 10): Promise<QuestionStats[]> {
    try {
      const { data, error } = await supabase
        .from('question_stats')
        .select('*')
        .order('difficulty_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar questões mais difíceis:', error);
      return [];
    }
  },

  async getGlobalStats(): Promise<{
    total_users: number;
    total_simulados: number;
    total_questions: number;
    average_score: number;
    completion_rate: number;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_global_stats');

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas globais:', error);
      return {
        total_users: 0,
        total_simulados: 0,
        total_questions: 0,
        average_score: 0,
        completion_rate: 0
      };
    }
  }
}; 