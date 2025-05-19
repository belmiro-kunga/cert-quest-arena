import { supabase } from '@/lib/supabase';

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  price_usd: number;
  language: string;
  difficulty: string;
  duration: number;
  questions_count: number;
  category: string;
  image_url?: string;
  topics: string[];
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  answers: Record<string, string>;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export const examService = {
  async getAllExams(): Promise<Exam[]> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      return [];
    }
  },

  async getExamById(id: string): Promise<Exam> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Exame não encontrado');
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar exame:', error);
      throw error;
    }
  },

  async createExam(exam: Omit<Exam, 'id' | 'created_at' | 'updated_at'>): Promise<Exam> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert({
          ...exam,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao criar exame');
      
      return data;
    } catch (error) {
      console.error('Erro ao criar exame:', error);
      throw error;
    }
  },

  async updateExam(id: string, exam: Partial<Exam>): Promise<Exam> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .update({
          ...exam,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Exame não encontrado');
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar exame:', error);
      throw error;
    }
  },

  async deleteExam(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar exame:', error);
      throw error;
    }
  },

  async startExam(userId: string, examId: string): Promise<ExamAttempt> {
    try {
      const { data, error } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: userId,
          exam_id: examId,
          start_time: new Date().toISOString(),
          status: 'in_progress',
          answers: {}
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao iniciar exame');
      
      return data;
    } catch (error) {
      console.error('Erro ao iniciar exame:', error);
      throw error;
    }
  },

  async submitAnswer(attemptId: string, questionId: string, answer: string): Promise<ExamAttempt> {
    try {
      // Primeiro, buscar a tentativa atual
      const { data: attempt, error: fetchError } = await supabase
        .from('exam_attempts')
        .select('answers')
        .eq('id', attemptId)
        .single();

      if (fetchError) throw fetchError;
      if (!attempt) throw new Error('Tentativa não encontrada');

      // Atualizar as respostas
      const updatedAnswers = {
        ...attempt.answers,
        [questionId]: answer
      };

      const { data, error } = await supabase
        .from('exam_attempts')
        .update({
          answers: updatedAnswers,
          updated_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao atualizar resposta');
      
      return data;
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      throw error;
    }
  },

  async completeExam(attemptId: string): Promise<ExamAttempt> {
    try {
      const { data, error } = await supabase
        .from('exam_attempts')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Tentativa não encontrada');
      
      return data;
    } catch (error) {
      console.error('Erro ao completar exame:', error);
      throw error;
    }
  },

  async getUserAttempts(userId: string): Promise<ExamAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar tentativas do usuário:', error);
      return [];
    }
  },
};
