import { supabase } from '@/lib/supabase';

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCurrencyData {
  code: string;
  name: string;
  symbol: string;
}

export interface UpdateCurrencyData {
  code?: string;
  name?: string;
  symbol?: string;
  is_active?: boolean;
}

export const currencyService = {
  async getCurrencies(): Promise<Currency[]> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar moedas:', error);
      return [];
    }
  },

  async getCurrency(id: number): Promise<Currency> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Moeda não encontrada');
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar moeda:', error);
      throw error;
    }
  },

  async createCurrency(currency: CreateCurrencyData): Promise<Currency> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .insert({
          ...currency,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao criar moeda');
      
      return data;
    } catch (error) {
      console.error('Erro ao criar moeda:', error);
      throw error;
    }
  },

  async updateCurrency(id: number, currency: UpdateCurrencyData): Promise<Currency> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .update({
          ...currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Moeda não encontrada');
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error);
      throw error;
    }
  },

  async deleteCurrency(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar moeda:', error);
      throw error;
    }
  },

  async toggleCurrencyStatus(id: number, is_active: boolean): Promise<Currency> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .update({
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Moeda não encontrada');
      
      return data;
    } catch (error) {
      console.error('Erro ao alterar status da moeda:', error);
      throw error;
    }
  },
}; 