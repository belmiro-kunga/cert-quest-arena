'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, RefreshCw, Settings } from 'lucide-react';

// Local Components
import PaymentDashboard from '../PaymentDashboard';
import PaymentTransactionsTable from '../PaymentTransactionsTable';

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

// Serviços
import paymentService, { PaymentMethod, RefundPolicy as RefundPolicyType, Transaction } from '@/services/paymentService';

const refundPolicySchema = z.object({
  refundPeriod: z.number().min(0).max(365),
  refundPolicy: z.string().min(10),
  automaticRefunds: z.boolean(),
  refundNotifications: z.boolean(),
  partialRefunds: z.boolean(),
  refundReasons: z.array(z.string()),
  processingTime: z.number().min(1).max(30),
  refundMethod: z.enum(['original', 'transfer']),
  minAmount: z.number().min(0),
  maxAmount: z.number().min(0),
  refundFees: z.boolean(),
  additionalNotes: z.string(),
  adminApprovalRequired: z.boolean(),
  partialRefundsAllowed: z.boolean(),
  refundProcessingTime: z.number().min(1).max(30),
  refundFeeDeduction: z.number().min(0),
  blacklistOnRefund: z.boolean()
});

const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  processingFee: z.number().min(0).max(100),
  config: z.object({
    apiKey: z.string().optional(),
    merchantId: z.string().optional(),
    stripeApiKey: z.string().optional(),
    paypalEmail: z.string().optional(),
    googlePayMerchantId: z.string().optional(),
  })
});

const paymentMethodsSchema = z.object({
  enabled: z.boolean(),
  methods: z.array(paymentMethodSchema)
});

const generalConfigSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'BRL']),
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

const sidebarMenu = [
  { key: 'dashboard', label: 'Dashboard', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { key: 'transactions', label: 'Transações', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { key: 'refund', label: 'Política de Reembolso', icon: <RefreshCw className="h-4 w-4 mr-2" /> },
  { key: 'payment', label: 'Métodos de Pagamento', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { key: 'config', label: 'Configurações Gerais', icon: <Settings className="h-4 w-4 mr-2" /> },
];

const PaymentSettings: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [refundPolicy, setRefundPolicy] = useState<RefundPolicyType | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

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
        additionalNotes: '',
        adminApprovalRequired: false,
        partialRefundsAllowed: false,
        refundProcessingTime: 3,
        refundFeeDeduction: 0,
        blacklistOnRefund: false
      },
      paymentMethods: {
        enabled: true,
        methods: []
      },
      generalConfig: {
        currency: 'BRL' as const,
        taxRate: 0,
        invoicePrefix: 'INV',
        invoiceStartNumber: 1,
        autoGenerateInvoices: true,
        sendInvoicesByEmail: true
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar métodos de pagamento
        const methods = await paymentService.getPaymentMethods();
        const completeMethodsPromise = methods.map(method => ({
          ...method,
          config: method.config || {
            apiKey: '',
            merchantId: '',
            stripeApiKey: '',
            paypalEmail: '',
            googlePayMerchantId: ''
          }
        }));
        setPaymentMethods(completeMethodsPromise);
        form.setValue('paymentMethods.methods', completeMethodsPromise);

        // Carregar política de reembolso
        const policy = await paymentService.getRefundPolicy();
        const completePolicy: RefundPolicyType = {
          ...policy,
          adminApprovalRequired: policy.adminApprovalRequired ?? false,
          partialRefundsAllowed: policy.partialRefundsAllowed ?? false,
          refundProcessingTime: policy.refundProcessingTime ?? 3,
          refundFeeDeduction: policy.refundFeeDeduction ?? 0,
          blacklistOnRefund: policy.blacklistOnRefund ?? false
        };
        setRefundPolicy(completePolicy);
        form.setValue('refundPolicy', completePolicy);
      } catch (error) {
        console.error("Erro ao carregar configurações de pagamento:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações de pagamento.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Salvar métodos de pagamento
      await paymentService.savePaymentMethods(data.paymentMethods.methods);
      
      // Salvar política de reembolso
      await paymentService.saveRefundPolicy(data.refundPolicy);
      
      toast({
        title: 'Sucesso',
        description: 'Configurações de pagamento atualizadas com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as configurações de pagamento.',
        variant: 'destructive'
      });
    }
  };

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    console.log("Detalhes da transação:", transaction);
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 min-w-[200px] border-r pr-4">
        <nav className="flex flex-col gap-2 mt-2">
          {sidebarMenu.map(item => (
            <button
              key={item.key}
              className={`flex items-center px-4 py-2 rounded-lg text-left transition-colors ${activeMenu === item.key ? 'bg-cert-blue text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        {activeMenu === 'dashboard' && (
          <PaymentDashboard />
        )}

        {activeMenu === 'transactions' && (
          <PaymentTransactionsTable onViewDetails={handleViewTransactionDetails} />
        )}

        {activeMenu === 'refund' && (
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

                  <FormField
                    control={form.control}
                    name="refundPolicy.adminApprovalRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aprovação do Administrador Necessária</FormLabel>
                          <FormDescription>
                            Requer aprovação do administrador para processar reembolsos
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
                    name="refundPolicy.partialRefundsAllowed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Reembolsos Parciais Permitidos</FormLabel>
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
                    name="refundPolicy.refundProcessingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de Processamento do Reembolso (dias)</FormLabel>
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
                    name="refundPolicy.refundFeeDeduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dedução da Taxa de Reembolso</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Valor da taxa de reembolso a ser deduzida
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="refundPolicy.blacklistOnRefund"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Lista Negra no Reembolso</FormLabel>
                          <FormDescription>
                            Adicionar usuário à lista negra após reembolso
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

                  <Button type="submit" className="mt-4">Salvar Configurações</Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}

        {activeMenu === 'payment' && (
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

                  {paymentMethods.map((method, index) => (
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
                        {method.id === 'visa' && (
                          <FormField
                            control={form.control}
                            name={`paymentMethods.methods.${index}.config.apiKey`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API Key Visa</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Chave de API Visa" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        {method.id === 'mastercard' && (
                          <FormField
                            control={form.control}
                            name={`paymentMethods.methods.${index}.config.merchantId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Merchant ID Mastercard</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ID do comerciante Mastercard" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        {method.id === 'stripe' && (
                          <FormField
                            control={form.control}
                            name={`paymentMethods.methods.${index}.config.stripeApiKey`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe API Key</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="sk_live_..." />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        {method.id === 'paypal' && (
                          <FormField
                            control={form.control}
                            name={`paymentMethods.methods.${index}.config.paypalEmail`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email do PayPal</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="conta@paypal.com" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        {method.id === 'googlepay' && (
                          <FormField
                            control={form.control}
                            name={`paymentMethods.methods.${index}.config.googlePayMerchantId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Pay Merchant ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="merchant_id..." />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  <Button type="submit" className="mt-4">Salvar Configurações</Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}

        {activeMenu === 'config' && (
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
                            <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
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
                  
                  <Button type="submit" className="mt-4">Salvar Configurações</Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
