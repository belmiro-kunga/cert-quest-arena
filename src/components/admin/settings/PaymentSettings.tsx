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

export function PaymentSettings() {
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
                    <FormLabel>Reembolsos Automáticos</FormLabel>
                    <FormDescription>
                      Aprovar automaticamente reembolsos dentro do período permitido
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
                    <FormLabel>Notificações de Reembolso</FormLabel>
                    <FormDescription>
                      Enviar notificações sobre status do reembolso
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
                    <FormLabel>Reembolsos Parciais</FormLabel>
                    <FormDescription>
                      Permitir reembolsos parciais do valor da compra
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
                    Como os reembolsos serão processados
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refundPolicy.processingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Processamento (dias úteis)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>
                    Tempo estimado para processar os reembolsos
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="refundPolicy.minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        value={typeof field.value === 'number' ? field.value : ''}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo para reembolso
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundPolicy.maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        value={typeof field.value === 'number' ? field.value : ''}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor máximo para reembolso
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">Salvar Configurações</Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="payment" className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Configure os métodos de pagamento aceitos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethods.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Ativar Pagamentos</FormLabel>
                        <FormDescription>
                          Habilitar processamento de pagamentos
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

                {form.watch('paymentMethods.enabled') && (
                  <div className="space-y-4">
                    {form.watch('paymentMethods.methods')?.map((method: PaymentMethod, index: number) => (
                      <Card key={method.id}>
                        <CardContent className="pt-6">
                          <div className="grid gap-4">
                            <FormField
                              control={form.control}
                              name={`paymentMethods.methods.${index}.enabled` as const}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                  <div className="space-y-0.5">
                                    <FormLabel>{method.name}</FormLabel>
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
                              name={`paymentMethods.methods.${index}.processingFee` as const}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Taxa de Processamento (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={field.value}
                                      onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">Salvar Configurações</Button>
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
                          <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Moeda principal para pagamentos
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
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Taxa de imposto padrão aplicada aos pagamentos
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
                        <Input 
                          value={typeof field.value === 'string' ? field.value : ''} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormDescription>
                        Prefixo usado na numeração das faturas
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
                        <Input
                          type="number"
                          min="1"
                          value={typeof field.value === 'number' ? field.value : ''}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormDescription>
                        Número inicial para a sequência de faturas
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
                        <FormLabel>Geração Automática de Faturas</FormLabel>
                        <FormDescription>
                          Gerar faturas automaticamente após o pagamento
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
              <CardContent>
                <FormField
                  control={form.control}
                  name="generalConfig.sendInvoicesByEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Envio Automático de Faturas</FormLabel>
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

            <Button type="submit" className="w-full">Salvar Configurações</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
