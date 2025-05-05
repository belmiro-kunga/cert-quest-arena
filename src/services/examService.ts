
import axios from 'axios';
import { Exam } from '@/types/admin';

const API_URL = 'http://localhost:3001';

export const fetchExams = async (): Promise<Exam[]> => {
  try {
    const response = await axios.get(`${API_URL}/simulados`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    return [];
  }
};

export const createExam = async (examData: Partial<Exam>): Promise<Exam | null> => {
  try {
    const response = await axios.post(`${API_URL}/simulados`, examData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar simulado:', error);
    return null;
  }
};

export const updateExam = async (id: string, examData: Partial<Exam>): Promise<Exam | null> => {
  try {
    const response = await axios.put(`${API_URL}/simulados/${id}`, examData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar simulado:', error);
    return null;
  }
};

export const deleteExam = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/simulados/${id}`);
    return true;
  } catch (error) {
    console.error('Erro ao excluir simulado:', error);
    return false;
  }
};
