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
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .order('code');

    if (error) {
      console.error('Erro ao buscar moedas:', error);
      throw error;
    }

    return data;
  },

  async getCurrency(id: number): Promise<Currency> {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar moeda:', error);
      throw error;
    }

    return data;
  },

  async createCurrency(currency: CreateCurrencyData): Promise<Currency> {
    const { data, error } = await supabase
      .from('currencies')
      .insert(currency)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar moeda:', error);
      throw error;
    }

    return data;
  },

  async updateCurrency(id: number, currency: UpdateCurrencyData): Promise<Currency> {
    const { data, error } = await supabase
      .from('currencies')
      .update(currency)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar moeda:', error);
      throw error;
    }

    return data;
  },

  async deleteCurrency(id: number): Promise<void> {
    const { error } = await supabase
      .from('currencies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar moeda:', error);
      throw error;
    }
  },

  async toggleCurrencyStatus(id: number, is_active: boolean): Promise<Currency> {
    const { data, error } = await supabase
      .from('currencies')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar status da moeda:', error);
      throw error;
    }

    return data;
  },
}; 