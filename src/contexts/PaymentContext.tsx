import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Configuração do axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface PaymentContextType {
    isProcessing: boolean;
    error: string | null;
    createPaymentSession: (method: string, orderId: number, amount: number) => Promise<any>;
    confirmPayment: (paymentId: string, method: string) => Promise<any>;
    clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPaymentSession = useCallback(async (method: string, orderId: number, amount: number) => {
        setIsProcessing(true);
        setError(null);
        try {
            const response = await api.post('/api/payment/create-session', {
                method,
                orderId,
                amount
            });
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.message);
            } else {
                setError('Erro ao criar sessão de pagamento');
            }
            throw err;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const confirmPayment = useCallback(async (paymentId: string, method: string) => {
        setIsProcessing(true);
        setError(null);
        try {
            const response = await api.post('/api/payment/confirm', {
                paymentId,
                method
            });
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.message);
            } else {
                setError('Erro ao confirmar pagamento');
            }
            throw err;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return (
        <PaymentContext.Provider
            value={{
                isProcessing,
                error,
                createPaymentSession,
                confirmPayment,
                clearError
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
}; 