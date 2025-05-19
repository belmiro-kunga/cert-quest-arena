import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  achievement: Achievement;
}

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return [];
  }
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar conquistas do usuário:', error);
    return [];
  }
};

export const updateAchievementProgress = async (userId: string, achievementId: string, progress: number): Promise<UserAchievement> => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .update({
        progress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .select(`
        *,
        achievement:achievements(*)
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Progresso da conquista não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar progresso da conquista:', error);
    throw error;
  }
};

export const completeAchievement = async (userId: string, achievementId: string): Promise<UserAchievement> => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .select(`
        *,
        achievement:achievements(*)
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Conquista do usuário não encontrada');
    
    return data;
  } catch (error) {
    console.error('Erro ao completar conquista:', error);
    throw error;
  }
};

export const createAchievement = async (achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>): Promise<Achievement> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        ...achievement,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Erro ao criar conquista');
    
    return data;
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    throw error;
  }
};

export const updateAchievement = async (id: string, achievement: Partial<Achievement>): Promise<Achievement> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .update({
        ...achievement,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Conquista não encontrada');
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar conquista:', error);
    throw error;
  }
};

export const deleteAchievement = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar conquista:', error);
    throw error;
  }
};
