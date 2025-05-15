import React from 'react';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign, Euro, CircleDollarSign } from 'lucide-react';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const currencyIcons = {
    USD: <DollarSign className="h-4 w-4" />,
    EUR: <Euro className="h-4 w-4" />,
    BRL: <CircleDollarSign className="h-4 w-4" />,
  };

  const currencyLabels = {
    USD: 'USD',
    EUR: 'EUR',
    BRL: 'BRL',
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {currencyIcons[currency]}
          {currencyLabels[currency]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleCurrencyChange('USD')} className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>USD (Dólar Americano)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange('EUR')} className="flex items-center gap-2">
          <Euro className="h-4 w-4" />
          <span>EUR (Euro)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange('BRL')} className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" />
          <span>BRL (Real Brasileiro)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector; 