import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export const purchaseService = {
  async createPurchase(purchase: PaymentInsert): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(purchase)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar compra:', error);
      return null;
    }
  },

  async getPurchaseById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar compra:', error);
      return null;
    }
  },

  async getUserPurchases(userId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar compras do usuário:', error);
      return [];
    }
  },

  async updatePurchaseStatus(id: string, status: Payment['status']): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status da compra:', error);
      return null;
    }
  },

  async getPurchaseBySimuladoId(simuladoId: string, userId: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('metadata->simulado_id', simuladoId)
        .eq('status', 'completed')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar compra do simulado:', error);
      return null;
    }
  },

  async getActivePurchases(userId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar compras ativas:', error);
      return [];
    }
  },

  async getPurchaseByTransactionId(transactionId: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('metadata->transaction_id', transactionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar compra por ID da transação:', error);
      return null;
    }
  }
}; 