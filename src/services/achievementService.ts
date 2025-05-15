// import { supabase } from './supabaseClient'; // Arquivo removido, ajuste necessário
// TODO: Substituir por integração real ou mock
import { api } from './api';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  requirements: {
    type: string;
    value: number;
  };
  isActive: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  achievement: Achievement;
}

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await api.get('/achievements');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return [];
  }
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conquistas do usuário:', error);
    return [];
  }
};

export const updateAchievementProgress = async (userId: string, achievementId: string, progress: number): Promise<UserAchievement> => {
  try {
    const response = await api.put(`/achievements/user/${userId}/${achievementId}`, { progress });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar progresso da conquista:', error);
    throw error;
  }
};

export const completeAchievement = async (userId: string, achievementId: string): Promise<UserAchievement> => {
  try {
    const response = await api.post(`/achievements/user/${userId}/${achievementId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Erro ao completar conquista:', error);
    throw error;
  }
};

export const createAchievement = async (achievement: Omit<Achievement, 'id'>): Promise<Achievement> => {
  try {
    const response = await api.post('/achievements', achievement);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    throw error;
  }
};

export const updateAchievement = async (id: string, achievement: Partial<Achievement>): Promise<Achievement> => {
  try {
    const response = await api.put(`/achievements/${id}`, achievement);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar conquista:', error);
    throw error;
  }
};

export const deleteAchievement = async (id: string): Promise<void> => {
  try {
    await api.delete(`/achievements/${id}`);
  } catch (error) {
    console.error('Erro ao deletar conquista:', error);
    throw error;
  }
};
