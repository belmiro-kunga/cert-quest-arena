import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePaymentConfig } from '@/contexts/PaymentConfigContext';
import { Loader2, CreditCard, Wallet } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  enabled?: boolean;
  merchantId?: string;
  apiKey?: string;
  secretKey?: string;
  icon: React.ElementType;
}

export default function PaymentConfig() {

  const { isLoading, error, paymentConfigs, fetchConfigurations, updateConfigurations } = usePaymentConfig();

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const paymentMethodsMap: Record<string, PaymentMethod> = {
    'VISA': {
      id: 'VISA',
      name: 'Visa',
      icon: CreditCard
    },
    'MASTERCARD': {
      id: 'MASTERCARD',
      name: 'Mastercard',
      icon: CreditCard
    },
    'PAYPAL': {
      id: 'PAYPAL',
      name: 'PayPal',
      icon: Wallet
    },
    'GOOGLEPAY': {
      id: 'GOOGLEPAY',
      name: 'Google Pay',
      icon: Wallet
    },
    'SKRILL': {
      id: 'SKRILL',
      name: 'Skrill',
      icon: Wallet
    },
    'STRIPE': {
      id: 'STRIPE',
      name: 'Stripe',
      icon: CreditCard
    }
  };

  const [configs, setConfigs] = React.useState(paymentConfigs);

  const handleToggle = (id: string) => {
    const updatedConfigs = configs.map(config => {
      if (config.id === id) {
        return { ...config, enabled: !config.enabled };
      }
      return config;
    });
    setConfigs(updatedConfigs);
    updateConfigurations(updatedConfigs);
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    const updatedConfigs = configs.map(config => {
      if (config.id === id) {
        return { ...config, [field]: value };
      }
      return config;
    });
    setConfigs(updatedConfigs);
    updateConfigurations(updatedConfigs);
  };

  const handleSave = async () => {
    try {
      await updateConfigurations(configs);
      toast.success('Configurações de pagamento atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error("Não foi possível salvar as configurações. Tente novamente.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações de Pagamento</CardTitle>
        <CardDescription>
          Configure os métodos de pagamento disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cert-blue" />
            </div>
          ) : (
            configs.map((method) => {
              const methodConfig = paymentMethodsMap[method.id];
              if (!methodConfig) return null;
              return (
                <div key={method.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <methodConfig.icon className="h-6 w-6" />
                      <h3 className="font-semibold">{methodConfig.name}</h3>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={() => handleToggle(method.id)}
                    />
                  </div>
                  <div className="space-y-2">
                    {method.merchantId !== undefined && (
                      <div className="space-y-1">
                        <Label htmlFor={`${method.id}-merchant`}>ID do Comerciante</Label>
                        <Input
                          id={`${method.id}-merchant`}
                          value={method.merchantId}
                          onChange={(e) => handleInputChange(method.id, 'merchantId', e.target.value)}
                        />
                      </div>
                    )}
                    {method.apiKey !== undefined && (
                      <div className="space-y-1">
                        <Label htmlFor={`${method.id}-apikey`}>Chave da API</Label>
                        <Input
                          id={`${method.id}-apikey`}
                          value={method.apiKey}
                          onChange={(e) => handleInputChange(method.id, 'apiKey', e.target.value)}
                        />
                      </div>
                    )}
                    {method.secretKey !== undefined && (
                      <div className="space-y-1">
                        <Label htmlFor={`${method.id}-secret`}>Chave Secreta</Label>
                        <Input
                          id={`${method.id}-secret`}
                          type="password"
                          value={method.secretKey}
                          onChange={(e) => handleInputChange(method.id, 'secretKey', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
