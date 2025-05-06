import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface PaymentMethodConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
}

interface PaymentConfigContextType {
  isLoading: boolean;
  error: string | null;
  paymentConfigs: PaymentMethodConfig[];
  fetchConfigurations: () => Promise<void>;
  updateConfiguration: (config: PaymentMethodConfig) => Promise<void>;
  updateConfigurations: (configs: PaymentMethodConfig[]) => Promise<void>;
}

const PaymentConfigContext = createContext<PaymentConfigContextType | undefined>(undefined);

export const usePaymentConfig = () => {
  const context = useContext(PaymentConfigContext);
  if (!context) {
    throw new Error('usePaymentConfig must be used within a PaymentConfigProvider');
  }
  return context;
};

export const PaymentConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentMethodConfig[]>([
    {
      id: 'VISA',
      name: 'Visa',
      enabled: true,
      merchantId: ''
    },
    {
      id: 'MASTERCARD',
      name: 'Mastercard',
      enabled: true,
      merchantId: ''
    },
    {
      id: 'PAYPAL',
      name: 'PayPal',
      enabled: true,
      apiKey: '',
      secretKey: ''
    },
    {
      id: 'GOOGLEPAY',
      name: 'Google Pay',
      enabled: false,
      merchantId: ''
    },
    {
      id: 'SKRILL',
      name: 'Skrill',
      enabled: false,
      merchantId: '',
      secretKey: ''
    },
    {
      id: 'STRIPE',
      name: 'Stripe',
      enabled: true,
      apiKey: '',
      secretKey: ''
    }
  ]);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Adiciona o token de autenticação em todas as requisições
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchConfigurations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/payment-config');
      setPaymentConfigs(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('Erro ao carregar configurações de pagamento');
      }
      // Se houver erro, mantém as configurações padrão
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfiguration = useCallback(async (config: PaymentMethodConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/api/admin/payment-config/${config.id}`, config);
      setPaymentConfigs(configs =>
        configs.map(c => c.id === config.id ? config : c)
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('Erro ao atualizar configuração de pagamento');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfigurations = useCallback(async (configs: PaymentMethodConfig[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.put('/api/admin/payment-config', { configs });
      setPaymentConfigs(configs);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('Erro ao atualizar configurações de pagamento');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PaymentConfigContext.Provider
      value={{
        isLoading,
        error,
        paymentConfigs,
        fetchConfigurations,
        updateConfiguration,
        updateConfigurations
      }}
    >
      {children}
    </PaymentConfigContext.Provider>
  );
};
