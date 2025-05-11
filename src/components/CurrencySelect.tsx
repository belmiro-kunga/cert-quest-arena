import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

export const CurrencySelect = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { value: Currency; label: string }[] = [
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'BRL', label: 'R$ BRL' },
  ];

  return (
    <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Moeda" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.value} value={curr.value}>
            {curr.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
