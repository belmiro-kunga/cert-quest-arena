// import { supabase } from './supabaseClient'; // Arquivo removido, ajuste necessário
// TODO: Substituir por integração real ou mock
import { PaymentDetails } from '@/components/notifications/PaymentNotification';
import { api } from './api';

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'paypal' | 'stripe' | 'google_pay';
  isEnabled: boolean;
  credentials: {
    clientId?: string;
    secretKey?: string;
    publicKey?: string;
    merchantId?: string;
    environment: 'sandbox' | 'production';
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  type: 'paypal' | 'stripe' | 'google_pay';
  isEnabled: boolean;
  credentials: {
    clientId?: string;
    secretKey?: string;
    publicKey?: string;
    merchantId?: string;
    environment: 'sandbox' | 'production';
  };
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Buscar configurações dos gateways
export const getPaymentGateways = async (): Promise<PaymentGateway[]> => {
  // TODO: Substituir por integração real com o backend
  const data = [];
  const error = null;

  if (error) {
    console.error('Error fetching payment gateways:', error);
    throw error;
  }

  return data as PaymentGateway[];
};

// Atualizar configuração do gateway
export const updatePaymentGateway = async (
  id: string,
  config: Partial<PaymentGatewayConfig>
): Promise<PaymentGateway> => {
  // TODO: Substituir por integração real com o backend
  const data = { id, ...config, updatedAt: new Date().toISOString() };
  const error = null;

  if (error) {
    console.error('Error updating payment gateway:', error);
    throw error;
  }

  return data as PaymentGateway;
};

// Criar nova configuração de gateway
export const createPaymentGateway = async (
  config: Omit<PaymentGatewayConfig, 'id'>
): Promise<PaymentGateway> => {
  // TODO: Substituir por integração real com o backend
  const data = { id: 'mock', ...config, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const error = null;

  if (error) {
    console.error('Error creating payment gateway:', error);
    throw error;
  }

  return data as PaymentGateway;
};

// Excluir configuração do gateway
export const deletePaymentGateway = async (id: string): Promise<void> => {
  // TODO: Substituir por integração real com o backend
  const error = null;

  if (error) {
    console.error('Error deleting payment gateway:', error);
    throw error;
  }
};

// Testar conexão com o gateway
export const testGatewayConnection = async (
  type: 'paypal' | 'stripe' | 'google_pay',
  credentials: PaymentGatewayConfig['credentials']
): Promise<boolean> => {
  try {
    switch (type) {
      case 'paypal':
        // Implementar teste de conexão com PayPal
        return true;
      case 'stripe':
        // Implementar teste de conexão com Stripe
        return true;
      case 'google_pay':
        // Implementar teste de conexão com Google Pay
        return true;
      default:
        throw new Error('Gateway não suportado');
    }
  } catch (error) {
    console.error('Error testing gateway connection:', error);
    throw error;
  }
};

export const paymentService = {
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return [];
    }
  },

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      throw error;
    }
  },

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    try {
      const response = await api.post('/payments', payment);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  },

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    try {
      const response = await api.put(`/payments/${id}`, payment);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      throw error;
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get('/payment-methods');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error);
      return [];
    }
  },

  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      const response = await api.post('/payment-methods', method);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  },

  async removePaymentMethod(id: string): Promise<void> {
    try {
      await api.delete(`/payment-methods/${id}`);
    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error);
      throw error;
    }
  },

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      const response = await api.put(`/payment-methods/${id}/default`);
      return response.data;
    } catch (error) {
      console.error('Erro ao definir método de pagamento padrão:', error);
      throw error;
    }
  },
}; 