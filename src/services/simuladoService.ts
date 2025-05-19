import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Simulado = Database['public']['Tables']['simulados']['Row'];
type SimuladoInsert = Database['public']['Tables']['simulados']['Insert'];
type SimuladoUpdate = Database['public']['Tables']['simulados']['Update'];

export interface SimuladoWithQuestions extends Simulado {
  questions: Database['public']['Tables']['questions']['Row'][];
}

export const simuladoService = {
  async getAllSimulados(): Promise<Simulado[]> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar simulados:', error);
      return [];
    }
  },

  async getSimuladoById(id: string): Promise<SimuladoWithQuestions | null> {
    try {
      const { data: simulado, error: simuladoError } = await supabase
        .from('simulados')
        .select('*')
        .eq('id', id)
        .single();

      if (simuladoError) throw simuladoError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('simulado_id', id)
        .order('created_at');

      if (questionsError) throw questionsError;

      return {
        ...simulado,
        questions: questions || []
      };
    } catch (error) {
      console.error('Erro ao buscar simulado:', error);
      return null;
    }
  },

  async createSimulado(simulado: SimuladoInsert): Promise<Simulado | null> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .insert(simulado)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar simulado:', error);
      return null;
    }
  },

  async updateSimulado(id: string, simulado: SimuladoUpdate): Promise<Simulado | null> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .update(simulado)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar simulado:', error);
      return null;
    }
  },

  async deleteSimulado(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('simulados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar simulado:', error);
      return false;
    }
  },

  async getActiveSimulados(): Promise<Simulado[]> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar simulados ativos:', error);
      return [];
    }
  },

  async toggleSimuladoStatus(id: string, isActive: boolean): Promise<Simulado | null> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao alterar status do simulado:', error);
      return null;
    }
  },

  async getSimuladosByCategory(category: string): Promise<Simulado[]> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar simulados por categoria:', error);
      return [];
    }
  },

  async searchSimulados(query: string): Promise<Simulado[]> {
    try {
      const { data, error } = await supabase
        .from('simulados')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar simulados:', error);
      return [];
    }
  }
}; 