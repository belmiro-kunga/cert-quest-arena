import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import axios from 'axios';

export type Currency = 'USD' | 'EUR' | 'BRL';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  isLoading: boolean;
}

const DEFAULT_CURRENCY: Currency = 'USD';

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  BRL: 'R$'
};

// Taxas de conversão fixas para exemplo
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR
  BRL: 4.95  // 1 USD = 4.95 BRL
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  formatPrice: () => '',
  isLoading: true
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch default currency from system settings
  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      try {
        setIsLoading(true);
        console.log('Iniciando busca da moeda padrão...');
        
        // Use a timeout to prevent hanging if the API is not responding
        const response = await Promise.race([
          api.get('/system-settings/default_currency'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 5000)
          )
        ]) as { data: { value: string } };
        
        if (!response?.data) {
          console.warn('Resposta da API sem dados, usando moeda padrão:', DEFAULT_CURRENCY);
          return;
        }

        const { value } = response.data;
        console.log('Moeda recebida da API:', value);
        
        if (!value) {
          console.warn('Valor da moeda não encontrado na resposta, usando moeda padrão:', DEFAULT_CURRENCY);
          return;
        }

        const defaultCurrency = value.toUpperCase() as Currency;
        
        if (Object.keys(currencySymbols).includes(defaultCurrency)) {
          console.log('Definindo moeda válida:', defaultCurrency);
          setCurrency(defaultCurrency);
        } else {
          console.warn(`Moeda inválida recebida: ${defaultCurrency}, usando moeda padrão: ${DEFAULT_CURRENCY}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Erro na requisição Axios:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
        } else {
          console.error('Erro ao buscar moeda padrão:', error);
        }
        console.warn(`Usando moeda padrão devido ao erro: ${DEFAULT_CURRENCY}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultCurrency();
  }, []);

  const formatPrice = (priceInUSD: number) => {
    if (typeof priceInUSD !== 'number') {
      console.warn('Preço inválido recebido:', priceInUSD);
      return currencySymbols[currency] + '0.00';
    }

    const convertedPrice = priceInUSD * exchangeRates[currency];
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);
    } catch (error) {
      console.error('Erro ao formatar preço:', error);
      return currencySymbols[currency] + convertedPrice.toFixed(2);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
