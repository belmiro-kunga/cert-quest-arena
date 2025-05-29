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
import { toast } from '@/components/ui/use-toast';

const billingSettingsSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  nif: z.string().min(1, 'NIF é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'País é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  invoicePrefix: z.string().min(1, 'Prefixo da fatura é obrigatório'),
  invoiceStartNumber: z.number().min(1, 'Número inicial deve ser maior que 0'),
  invoiceNotes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  autoGenerateInvoices: z.boolean(),
  sendInvoiceAutomatically: z.boolean(),
  defaultPaymentTerms: z.number().min(0, 'Prazo de pagamento deve ser maior ou igual a 0'),
  defaultDueDate: z.number().min(0, 'Prazo de vencimento deve ser maior ou igual a 0'),
  taxRate: z.number().min(0, 'Taxa de imposto deve ser maior ou igual a 0'),
  defaultCurrency: z.string().min(1, 'Moeda padrão é obrigatória'),
  displayCurrency: z.string().min(1, 'Moeda de exibição é obrigatória'),
  roundingMethod: z.enum(['up', 'down', 'nearest']),
  decimalPlaces: z.number().min(0).max(4),
});

type BillingSettingsFormValues = z.infer<typeof billingSettingsSchema>;

const defaultValues: Partial<BillingSettingsFormValues> = {
  companyName: '',
  nif: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Angola',
  invoicePrefix: 'INV',
  invoiceStartNumber: 1,
  autoGenerateInvoices: true,
  sendInvoiceAutomatically: true,
  defaultPaymentTerms: 30,
  defaultDueDate: 15,
  taxRate: 0,
  defaultCurrency: 'USD',
  displayCurrency: 'USD',
  roundingMethod: 'nearest',
  decimalPlaces: 2,
};

const PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 'Cuanza Sul',
  'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
  'Namibe', 'Uíge', 'Zaire'
];

const CURRENCIES = [
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

const ROUNDING_METHODS = [
  { value: 'up', label: 'Arredondar para Cima' },
  { value: 'down', label: 'Arredondar para Baixo' },
  { value: 'nearest', label: 'Arredondar para o Mais Próximo' },
];

export function BillingSettings() {
  const form = useForm<BillingSettingsFormValues>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues,
  });

  function onSubmit(data: BillingSettingsFormValues) {
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações de faturamento foram atualizadas com sucesso.',
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Província</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Fatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoicePrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefixo da Fatura</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Ex: INV, FAT, NF
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceStartNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Inicial</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="invoiceNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Padrão</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Estas observações aparecerão em todas as faturas
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termos e Condições</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="autoGenerateInvoices"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Gerar Faturas Automaticamente</FormLabel>
                      <FormDescription>
                        Gerar faturas automaticamente após pagamentos confirmados
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
                name="sendInvoiceAutomatically"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Enviar Faturas Automaticamente</FormLabel>
                      <FormDescription>
                        Enviar faturas por email automaticamente após geração
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="defaultPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo de Pagamento (dias)</FormLabel>
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

              <FormField
                control={form.control}
                name="defaultDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento Padrão</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Imposto (%)</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
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
                name="displayCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda de Exibição</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roundingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Arredondamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROUNDING_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decimalPlaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Casas Decimais</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Salvar Configurações
        </Button>
      </form>
    </Form>
  );
}
