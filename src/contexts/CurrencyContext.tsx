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
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: () => '',
  isLoading: true
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch default currency from system settings
  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      try {
        console.log('Fetching default currency from system settings...');
        
        // Use a timeout to prevent hanging if the API is not responding
        const response = await Promise.race([
          api.get('/system-settings/default_currency'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 5000)
          )
        ]) as { data: { value: string } };
        
        console.log('Default currency response:', response.data);
        
        if (response.data && response.data.value) {
          const defaultCurrency = response.data.value as Currency;
          console.log('Setting default currency to:', defaultCurrency);
          
          if (defaultCurrency === 'USD' || defaultCurrency === 'EUR' || defaultCurrency === 'BRL') {
            setCurrency(defaultCurrency);
          } else {
            console.warn(`Invalid currency value: ${defaultCurrency}, using USD as fallback`);
            setCurrency('USD');
          }
        } else {
          console.warn('No default currency found in response, using USD as fallback');
          setCurrency('USD');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error fetching default currency:', error.message);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
        } else {
          console.error('Error fetching default currency:', error);
        }
        console.warn('Using USD as fallback due to error');
        setCurrency('USD');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultCurrency();
  }, []);

  const formatPrice = (priceInUSD: number) => {
    const convertedPrice = priceInUSD * exchangeRates[currency];
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
