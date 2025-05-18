import axios from 'axios';
import { API_URL } from '@/config';

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

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  config?: Record<string, any>;
}

export interface RefundPolicy {
  refundPeriod: number;
  refundPolicy: string;
  automaticRefunds: boolean;
  refundNotifications: boolean;
  partialRefunds: boolean;
  processingTime: number;
  refundMethod: 'original' | 'credit' | 'transfer';
  minAmount: number;
  maxAmount: number;
  refundFees: boolean;
  additionalNotes: string;
}

export interface PaymentStatistics {
  totalRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;
  revenueByDay: { date: string; amount: number }[];
  paymentMethodDistribution: { method: string; count: number }[];
}

export const paymentService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${API_URL}/api/payments`, {
        headers: { Authorization: `Bearer admin-token` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await axios.get(`${API_URL}/api/payments/methods`, {
        headers: { Authorization: `Bearer admin-token` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error);
      // Retornar dados mockados para desenvolvimento
      return [
        {
          id: 'visa',
          name: 'Visa',
          enabled: true,
          processingFee: 2.5
        },
        {
          id: 'mastercard',
          name: 'Mastercard',
          enabled: true,
          processingFee: 2.5
        },
        {
          id: 'stripe',
          name: 'Stripe',
          enabled: true,
          processingFee: 2.9
        },
        {
          id: 'paypal',
          name: 'PayPal',
          enabled: true,
          processingFee: 3.5
        },
        {
          id: 'googlepay',
          name: 'Google Pay',
          enabled: true,
          processingFee: 2.2
        }
      ];
    }
  },

  async getRefundPolicy(): Promise<RefundPolicy> {
    try {
      const response = await axios.get(`${API_URL}/api/payments/refund-policy`, {
        headers: { Authorization: `Bearer admin-token` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar política de reembolso:', error);
      // Retornar dados mockados para desenvolvimento
      return {
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
      const response = await axios.get(`${API_URL}/api/payments/statistics`, {
        headers: { Authorization: `Bearer admin-token` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de pagamento:', error);
      // Retornar dados mockados para desenvolvimento
      return {
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
      await axios.post(
        `${API_URL}/api/payments/methods`,
        { methods },
        { headers: { Authorization: `Bearer admin-token` } }
      );
      return true;
    } catch (error) {
      console.error('Erro ao salvar métodos de pagamento:', error);
      return false;
    }
  },

  async saveRefundPolicy(policy: RefundPolicy): Promise<boolean> {
    try {
      await axios.post(
        `${API_URL}/api/payments/refund-policy`,
        policy,
        { headers: { Authorization: `Bearer admin-token` } }
      );
      return true;
    } catch (error) {
      console.error('Erro ao salvar política de reembolso:', error);
      return false;
    }
  },

  async approveTransaction(transactionId: string): Promise<boolean> {
    try {
      await axios.post(
        `${API_URL}/api/payments/${transactionId}/approve`,
        {},
        { headers: { Authorization: `Bearer admin-token` } }
      );
      return true;
    } catch (error) {
      console.error('Erro ao aprovar transação:', error);
      return false;
    }
  },

  async refundTransaction(transactionId: string, amount?: number): Promise<boolean> {
    try {
      await axios.post(
        `${API_URL}/api/payments/${transactionId}/refund`,
        { amount },
        { headers: { Authorization: `Bearer admin-token` } }
      );
      return true;
    } catch (error) {
      console.error('Erro ao reembolsar transação:', error);
      return false;
    }
  }
}; 