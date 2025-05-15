'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, RefreshCw, Settings } from 'lucide-react';

// Local Components
import { RefundPolicy } from './RefundPolicy';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    enabled: true,
    processingFee: 2.5
  },
  {
    id: 'bank-transfer',
    name: 'Transferência Bancária',
    enabled: true,
    processingFee: 0
  }
];

const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  processingFee: z.number().min(0).max(100)
});

const refundPolicySchema = z.object({
  refundPeriod: z.number().min(0).max(365),
  refundPolicy: z.string().min(10),
  automaticRefunds: z.boolean(),
  refundNotifications: z.boolean(),
  partialRefunds: z.boolean(),
  refundReasons: z.array(z.string()),
  processingTime: z.number().min(1).max(30),
  refundMethod: z.enum(['original', 'credit', 'transfer']),
  minAmount: z.number().min(0),
  maxAmount: z.number().min(0),
  refundFees: z.boolean(),
  additionalNotes: z.string()
});

const paymentMethodsSchema = z.object({
  enabled: z.boolean(),
  methods: z.array(paymentMethodSchema)
});

const generalConfigSchema = z.object({
  currency: z.enum(['USD', 'EUR']),
  taxRate: z.number().min(0).max(100),
  invoicePrefix: z.string(),
  invoiceStartNumber: z.number().min(1),
  autoGenerateInvoices: z.boolean(),
  sendInvoicesByEmail: z.boolean()
});

const paymentSettingsSchema = z.object({
  refundPolicy: refundPolicySchema,
  paymentMethods: paymentMethodsSchema,
  generalConfig: generalConfigSchema
});

type FormValues = z.infer<typeof paymentSettingsSchema>;

const PaymentSettings: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      refundPolicy: {
        refundPeriod: 14,
        refundPolicy: '',
        automaticRefunds: false,
        refundNotifications: true,
        partialRefunds: false,
        refundReasons: [],
        processingTime: 3,
        refundMethod: 'original',
        minAmount: 0,
        maxAmount: 0,
        refundFees: false,
        additionalNotes: ''
      },
      paymentMethods: {
        enabled: true,
        methods: defaultPaymentMethods
      },
      generalConfig: {
        currency: 'USD' as const,
        taxRate: 0,
        invoicePrefix: 'INV',
        invoiceStartNumber: 1,
        autoGenerateInvoices: true,
        sendInvoicesByEmail: true
      }
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // TODO: Implement API call to save settings
      console.log('Saving payment settings:', data);
      toast({
        title: 'Sucesso',
        description: 'Configurações de pagamento atualizadas com sucesso.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as configurações de pagamento.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Tabs defaultValue="refund" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="refund" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Política de Reembolso
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Métodos de Pagamento
        </TabsTrigger>
        <TabsTrigger value="config" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações Gerais
        </TabsTrigger>
      </TabsList>

      <TabsContent value="refund" className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Reembolso</CardTitle>
                <CardDescription>Configure as políticas de reembolso e processamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="refundPolicy.refundPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Reembolso (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Período em dias durante o qual os clientes podem solicitar reembolso
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.refundPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política de Reembolso</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Descreva sua política de reembolso detalhadamente
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.automaticRefunds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reembolsos Automáticos</FormLabel>
                        <FormDescription>
                          Processar reembolsos automaticamente quando aprovados
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
                  name="refundPolicy.refundNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notificações de Reembolso</FormLabel>
                        <FormDescription>
                          Enviar notificações por email sobre o status do reembolso
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
                  name="refundPolicy.partialRefunds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reembolsos Parciais</FormLabel>
                        <FormDescription>
                          Permitir reembolsos parciais de pedidos
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
                  name="refundPolicy.processingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Processamento (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Tempo médio para processar um reembolso
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.refundMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Reembolso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o método de reembolso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="original">Método Original de Pagamento</SelectItem>
                          <SelectItem value="credit">Crédito na Plataforma</SelectItem>
                          <SelectItem value="transfer">Transferência Bancária</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Método padrão para processar reembolsos
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.minAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mínimo de Reembolso</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Valor mínimo para processar um reembolso
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.maxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Máximo de Reembolso</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Valor máximo para processar um reembolso
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundPolicy.refundFees"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Taxas de Reembolso</FormLabel>
                        <FormDescription>
                          Aplicar taxas de processamento em reembolsos
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
                  name="refundPolicy.additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionais</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Informações adicionais sobre a política de reembolso
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="payment" className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Configure os métodos de pagamento disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethods.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Habilitar Pagamentos</FormLabel>
                        <FormDescription>
                          Ativar ou desativar o processamento de pagamentos
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

                {form.watch('paymentMethods.methods').map((method, index) => (
                  <Card key={method.id} className="p-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`paymentMethods.methods.${index}.enabled`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{method.name}</FormLabel>
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
                        name={`paymentMethods.methods.${index}.processingFee`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Taxa de Processamento (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormDescription>
                              Taxa de processamento para este método de pagamento
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="config" className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configure as opções gerais de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="generalConfig.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Moeda padrão para transações
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generalConfig.taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Imposto (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Taxa de imposto aplicada às transações
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generalConfig.invoicePrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefixo da Fatura</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Prefixo usado para identificar faturas
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generalConfig.invoiceStartNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Inicial da Fatura</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Número inicial para sequência de faturas
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generalConfig.autoGenerateInvoices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Gerar Faturas Automaticamente</FormLabel>
                        <FormDescription>
                          Gerar faturas automaticamente após pagamentos
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
                  name="generalConfig.sendInvoicesByEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enviar Faturas por Email</FormLabel>
                        <FormDescription>
                          Enviar faturas automaticamente por email
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
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentSettings;
