// import { supabase } from './supabaseClient'; // Arquivo removido, ajuste necessário
// TODO: Substituir por integração real ou mock
import { PaymentDetails } from '@/components/notifications/PaymentNotification';

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