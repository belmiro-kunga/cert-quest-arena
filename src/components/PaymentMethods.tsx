import React from 'react';
import { Icons } from '@/components/ui/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <RadioGroup
      defaultValue={selectedMethod}
      onValueChange={onMethodChange}
      className="grid grid-cols-3 gap-4"
    >
      <div>
        <RadioGroupItem
          value="stripe"
          id="stripe"
          className="peer sr-only"
        />
        <Label
          htmlFor="stripe"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-cert-blue peer-data-[state=checked]:border-cert-blue"
        >
          <Icons.stripe className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">Cartão de Crédito</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="paypal"
          id="paypal"
          className="peer sr-only"
        />
        <Label
          htmlFor="paypal"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-cert-blue peer-data-[state=checked]:border-cert-blue"
        >
          <Icons.paypal className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">PayPal</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="googlePay"
          id="googlePay"
          className="peer sr-only"
        />
        <Label
          htmlFor="googlePay"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-cert-blue peer-data-[state=checked]:border-cert-blue"
        >
          <Icons.googlePay className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">Google Pay</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethods; 