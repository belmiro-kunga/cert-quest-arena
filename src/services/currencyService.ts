import { api } from './api';

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
      const response = await api.get('/currencies');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar moedas:', error);
      return [];
    }
  },

  async getCurrency(id: number): Promise<Currency> {
    try {
      const response = await api.get(`/currencies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar moeda:', error);
      throw error;
    }
  },

  async createCurrency(currency: CreateCurrencyData): Promise<Currency> {
    try {
      const response = await api.post('/currencies', currency);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar moeda:', error);
      throw error;
    }
  },

  async updateCurrency(id: number, currency: UpdateCurrencyData): Promise<Currency> {
    try {
      const response = await api.put(`/currencies/${id}`, currency);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error);
      throw error;
    }
  },

  async deleteCurrency(id: number): Promise<void> {
    try {
      await api.delete(`/currencies/${id}`);
    } catch (error) {
      console.error('Erro ao deletar moeda:', error);
      throw error;
    }
  },

  async toggleCurrencyStatus(id: number, is_active: boolean): Promise<Currency> {
    try {
      const response = await api.put(`/currencies/${id}/toggle-status`, { is_active });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status da moeda:', error);
      throw error;
    }
  },
}; 