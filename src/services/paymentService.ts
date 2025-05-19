import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

// Tipos locais para tabelas que ainda não existem no Supabase
interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
}

interface RefundPolicy {
  id: string;
  refundPeriod: number;
  refundPolicy: string;
  automaticRefunds: boolean;
  refundNotifications: boolean;
  partialRefunds: boolean;
  processingTime: number;
  refundMethod: string;
  minAmount: number;
  maxAmount: number;
  refundFees: boolean;
  additionalNotes: string;
}

interface PaymentStatistics {
  id: string;
  totalRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;
  revenueByDay: Array<{ date: string; amount: number }>;
  paymentMethodDistribution: Array<{ method: string; count: number }>;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos locais para as tabelas que ainda não existem no Supabase
interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  start_date: string;
  end_date?: string;
  trial_end_date?: string;
  cancel_at_period_end: boolean;
  payment_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
type SubscriptionUpdate = Partial<SubscriptionInsert>;
type PlanInsert = Omit<Plan, 'id' | 'created_at' | 'updated_at'>;
type PlanUpdate = Partial<PlanInsert>;

export const paymentService = {
  // Métodos para Pagamentos
  async getAllPayments(userId?: string, status?: Payment['status']): Promise<Payment[]> {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar pagamentos:', error);
      return [];
    }
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar pagamento:', error);
      return null;
    }
  },

  async createPayment(payment: PaymentInsert): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar pagamento:', error);
      return null;
    }
  },

  async updatePayment(id: string, payment: PaymentUpdate): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(payment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar pagamento:', error);
      return null;
    }
  },

  async updatePaymentStatus(id: string, status: Payment['status']): Promise<Payment | null> {
    try {
      const updateData = {
        status,
        ...(status === 'completed' && { completed_at: new Date().toISOString() }),
        ...(status === 'refunded' && { refunded_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status do pagamento:', error);
      return null;
    }
  },

  // Métodos para Assinaturas
  async getAllSubscriptions(userId?: string, status?: Subscription['status']): Promise<Subscription[]> {
    try {
      let query = supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar assinaturas:', error);
      return [];
    }
  },

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar assinatura:', error);
      return null;
    }
  },

  async createSubscription(subscription: SubscriptionInsert): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar assinatura:', error);
      return null;
    }
  },

  async updateSubscription(id: string, subscription: SubscriptionUpdate): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscription)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar assinatura:', error);
      return null;
    }
  },

  async cancelSubscription(id: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          cancel_at_period_end: true
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao cancelar assinatura:', error);
      return null;
    }
  },

  // Métodos para Planos
  async getAllPlans(isActive?: boolean): Promise<Plan[]> {
    try {
      let query = supabase
        .from('plans')
        .select('*')
        .order('price');

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar planos:', error);
      return [];
    }
  },

  async getPlanById(id: string): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar plano:', error);
      return null;
    }
  },

  async createPlan(plan: PlanInsert): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert(plan)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar plano:', error);
      return null;
    }
  },

  async updatePlan(id: string, plan: PlanUpdate): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .update(plan)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar plano:', error);
      return null;
    }
  },

  async togglePlanStatus(id: string, isActive: boolean): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status do plano:', error);
      return null;
    }
  },

  async getTransactions(): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar transações:', error);
      return [];
    }
  },

  async getTransactionById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar transação:', error);
      return null;
    }
  },

  async getUserTransactions(userId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar transações do usuário:', error);
      return [];
    }
  },

  async approveTransaction(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao aprovar transação:', error);
      return null;
    }
  },

  async refundTransaction(id: string, amount?: number): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          status: 'refunded',
          metadata: { refund_amount: amount }
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao reembolsar transação:', error);
      return null;
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar métodos de pagamento:', error);
      // Retornar dados mockados para desenvolvimento
      return [
        { id: '1', name: 'Cartão de Crédito', enabled: true, icon: 'credit-card' },
        { id: '2', name: 'Boleto Bancário', enabled: true, icon: 'barcode' },
        { id: '3', name: 'PIX', enabled: true, icon: 'pix' }
      ];
    }
  },

  async getRefundPolicy(): Promise<RefundPolicy> {
    try {
      const { data, error } = await supabase
        .from('refund_policy')
        .select('*')
        .single();

      if (error) throw error;
      return data || {
        id: 'default',
        refundPeriod: 14,
        refundPolicy: 'Política padrão de reembolso de 14 dias.',
        automaticRefunds: false,
        refundNotifications: true,
        partialRefunds: false,
        processingTime: 3,
        refundMethod: 'original',
        minAmount: 0,
        maxAmount: 0,
        refundFees: false,
        additionalNotes: ''
      };
    } catch (error) {
      logger.error('Erro ao buscar política de reembolso:', error);
      return {
        id: 'default',
        refundPeriod: 14,
        refundPolicy: 'Política padrão de reembolso de 14 dias.',
        automaticRefunds: false,
        refundNotifications: true,
        partialRefunds: false,
        processingTime: 3,
        refundMethod: 'original',
        minAmount: 0,
        maxAmount: 0,
        refundFees: false,
        additionalNotes: ''
      };
    }
  },

  async getPaymentStatistics(): Promise<PaymentStatistics> {
    try {
      const { data, error } = await supabase
        .from('payment_statistics')
        .select('*')
        .single();

      if (error) throw error;
      return data || {
        id: 'current',
        totalRevenue: 12580.75,
        totalTransactions: 143,
        pendingTransactions: 12,
        refundedTransactions: 8,
        revenueByDay: [
          { date: '2023-05-01', amount: 1200.50 },
          { date: '2023-05-02', amount: 980.25 },
          { date: '2023-05-03', amount: 1450.00 },
          { date: '2023-05-04', amount: 875.00 },
          { date: '2023-05-05', amount: 1320.75 },
          { date: '2023-05-06', amount: 950.25 },
          { date: '2023-05-07', amount: 1100.00 }
        ],
        paymentMethodDistribution: [
          { method: 'Visa', count: 58 },
          { method: 'Mastercard', count: 42 },
          { method: 'PayPal', count: 25 },
          { method: 'Stripe', count: 15 },
          { method: 'Google Pay', count: 3 }
        ]
      };
    } catch (error) {
      logger.error('Erro ao buscar estatísticas de pagamento:', error);
      return {
        id: 'current',
        totalRevenue: 12580.75,
        totalTransactions: 143,
        pendingTransactions: 12,
        refundedTransactions: 8,
        revenueByDay: [
          { date: '2023-05-01', amount: 1200.50 },
          { date: '2023-05-02', amount: 980.25 },
          { date: '2023-05-03', amount: 1450.00 },
          { date: '2023-05-04', amount: 875.00 },
          { date: '2023-05-05', amount: 1320.75 },
          { date: '2023-05-06', amount: 950.25 },
          { date: '2023-05-07', amount: 1100.00 }
        ],
        paymentMethodDistribution: [
          { method: 'Visa', count: 58 },
          { method: 'Mastercard', count: 42 },
          { method: 'PayPal', count: 25 },
          { method: 'Stripe', count: 15 },
          { method: 'Google Pay', count: 3 }
        ]
      };
    }
  },

  async savePaymentMethods(methods: PaymentMethod[]): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert(methods)
        .select();

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao salvar métodos de pagamento:', error);
      return false;
    }
  },

  async saveRefundPolicy(policy: RefundPolicy): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('refund_policy')
        .update(policy)
        .select()
        .single();

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao salvar política de reembolso:', error);
      return false;
    }
  }
}; 