
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { PaymentMethod, RefundPolicy } from '@/types/admin';

const paymentSettingsSchema = z.object({
  stripeEnabled: z.boolean(),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalEnabled: z.boolean(),
  paypalEmail: z.string().email().optional(),
  paypalSandbox: z.boolean(),
  bankTransferEnabled: z.boolean(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankIban: z.string().optional(),
  defaultCurrency: z.string(),
  acceptedCurrencies: z.array(z.string()),
  refundEnabled: z.boolean(),
  refundPeriod: z.number().min(0),
  automaticRefunds: z.boolean(),
});

type PaymentSettingsFormValues = z.infer<typeof paymentSettingsSchema>;

const defaultValues: Partial<PaymentSettingsFormValues> = {
  stripeEnabled: true,
  paypalEnabled: false,
  paypalSandbox: true,
  bankTransferEnabled: false,
  defaultCurrency: 'USD',
  acceptedCurrencies: ['USD', 'EUR'],
  refundEnabled: true,
  refundPeriod: 30,
  automaticRefunds: false,
};

const CURRENCIES = [
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

export function PaymentSettings() {
  const form = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues,
  });

  function onSubmit(data: PaymentSettingsFormValues) {
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações de pagamento foram atualizadas com sucesso.',
    });
    console.log(data);
  }

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    // Mock implementation
    console.log('Saving payment methods:', methods);
    toast({
      title: 'Métodos de pagamento atualizados',
      description: 'Os métodos de pagamento foram salvos com sucesso.',
    });
  };

  const saveRefundPolicy = (policy: RefundPolicy) => {
    // Mock implementation
    console.log('Saving refund policy:', policy);
    toast({
      title: 'Política de reembolso atualizada',
      description: 'A política de reembolso foi salva com sucesso.',
    });
  };

  const handleSavePaymentMethods = () => {
    const defaultPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        name: 'Stripe',
        enabled: true,
        processingFee: 2.9,
        config: {
          stripeApiKey: '',
          merchantId: ''
        }
      },
      {
        id: '2',
        name: 'PayPal',
        enabled: false,
        processingFee: 3.5,
        config: {
          paypalEmail: '',
          merchantId: ''
        }
      }
    ];
    savePaymentMethods(defaultPaymentMethods);
  };

  const handleSaveRefundPolicy = () => {
    const defaultRefundPolicy: RefundPolicy = {
      refundPeriod: 30,
      refundPolicy: 'Reembolso total dentro de 30 dias',
      automaticRefunds: false,
      refundNotifications: true,
      additionalNotes: '',
      partialRefunds: true,
      refundReasons: ['Defeito do produto', 'Não satisfeito', 'Produto errado'],
      processingTime: 5,
      refundMethod: 'original',
      minAmount: 0,
      maxAmount: 10000,
      refundFees: false,
      adminApprovalRequired: true,
      partialRefundsAllowed: true,
      refundProcessingTime: 5,
      refundFeeDeduction: 0,
      blacklistOnRefund: false
    };
    saveRefundPolicy(defaultRefundPolicy);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="stripeEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar Stripe</FormLabel>
                      <FormDescription>
                        Permitir pagamentos através do Stripe
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stripePublicKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave Pública do Stripe</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stripeSecretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave Secreta do Stripe</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PayPal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="paypalEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar PayPal</FormLabel>
                      <FormDescription>
                        Permitir pagamentos através do PayPal
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paypalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do PayPal</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paypalSandbox"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Modo Sandbox</FormLabel>
                      <FormDescription>
                        Usar ambiente de teste do PayPal
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda Padrão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Permitir Reembolsos</FormLabel>
                      <FormDescription>
                        Ativar sistema de reembolsos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Reembolso (dias)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">Salvar Configurações</Button>
            <Button type="button" variant="outline" onClick={handleSavePaymentMethods}>
              Configurar Métodos de Pagamento
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveRefundPolicy}>
              Configurar Política de Reembolso
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
