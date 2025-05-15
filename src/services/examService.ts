import { api } from './api';

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  priceUSD: number;
  language: string;
  difficulty: string;
  duration: number;
  questionsCount: number;
  category: string;
  imageUrl?: string;
  topics: string[];
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  answers: Record<string, string>;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export const examService = {
  async getAllExams(): Promise<Exam[]> {
    try {
      const response = await api.get('/exams');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      return [];
    }
  },

  async getExamById(id: string): Promise<Exam> {
    try {
      const response = await api.get(`/exams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exame:', error);
      throw error;
    }
  },

  async createExam(exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam> {
    try {
      const response = await api.post('/exams', exam);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar exame:', error);
      throw error;
    }
  },

  async updateExam(id: string, exam: Partial<Exam>): Promise<Exam> {
    try {
      const response = await api.put(`/exams/${id}`, exam);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar exame:', error);
      throw error;
    }
  },

  async deleteExam(id: string): Promise<void> {
    try {
      await api.delete(`/exams/${id}`);
    } catch (error) {
      console.error('Erro ao deletar exame:', error);
      throw error;
    }
  },

  async startExam(userId: string, examId: string): Promise<ExamAttempt> {
    try {
      const response = await api.post('/exam-attempts', { userId, examId });
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar exame:', error);
      throw error;
    }
  },

  async submitAnswer(attemptId: string, questionId: string, answer: string): Promise<ExamAttempt> {
    try {
      const response = await api.put(`/exam-attempts/${attemptId}/answers`, {
        questionId,
        answer
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      throw error;
    }
  },

  async completeExam(attemptId: string): Promise<ExamAttempt> {
    try {
      const response = await api.post(`/exam-attempts/${attemptId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Erro ao completar exame:', error);
      throw error;
    }
  },

  async getUserAttempts(userId: string): Promise<ExamAttempt[]> {
    try {
      const response = await api.get(`/exam-attempts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tentativas do usuário:', error);
      return [];
    }
  },
};
