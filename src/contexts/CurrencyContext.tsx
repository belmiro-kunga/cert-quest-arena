import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
        
        // Buscar configuração de moeda do Supabase
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'default_currency')
          .single();

        if (error) {
          throw error;
        }

        if (!data?.value) {
          console.warn('Configuração de moeda não encontrada, usando moeda padrão:', DEFAULT_CURRENCY);
          return;
        }

        const defaultCurrency = data.value.toUpperCase() as Currency;
        console.log('Moeda recebida do Supabase:', defaultCurrency);
        
        if (Object.keys(currencySymbols).includes(defaultCurrency)) {
          console.log('Definindo moeda válida:', defaultCurrency);
          setCurrency(defaultCurrency);
        } else {
          console.warn(`Moeda inválida recebida: ${defaultCurrency}, usando moeda padrão: ${DEFAULT_CURRENCY}`);
        }
      } catch (error) {
        console.error('Erro ao buscar moeda padrão:', error);
        console.warn(`Usando moeda padrão devido ao erro: ${DEFAULT_CURRENCY}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultCurrency();
  }, []);

  // Função para atualizar a moeda padrão no Supabase
  const updateDefaultCurrency = async (newCurrency: Currency) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'default_currency',
          value: newCurrency,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Erro ao atualizar moeda padrão:', error);
      throw error;
    }
  };

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
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: updateDefaultCurrency, 
      formatPrice, 
      isLoading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
