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

const refundSettingsSchema = z.object({
  refundPeriod: z.number().min(0, 'O período deve ser maior ou igual a 0'),
  refundPolicy: z.string().min(1, 'A política de reembolso é obrigatória'),
  automaticRefunds: z.boolean(),
  refundNotifications: z.boolean(),
  partialRefunds: z.boolean(),
  refundReasons: z.array(z.string()),
  refundProcessingTime: z.number().min(1, 'O tempo de processamento deve ser maior que 0'),
  refundMethod: z.enum(['original', 'credit', 'bank_transfer']),
  minimumRefundAmount: z.number().min(0, 'O valor mínimo deve ser maior ou igual a 0'),
  maximumRefundAmount: z.number().min(0, 'O valor máximo deve ser maior ou igual a 0'),
  refundFees: z.boolean(),
  refundNotes: z.string().optional(),
});

type RefundSettingsFormValues = z.infer<typeof refundSettingsSchema>;

const defaultValues: Partial<RefundSettingsFormValues> = {
  refundPeriod: 14,
  refundPolicy: 'Reembolso total disponível em até 14 dias após a compra',
  automaticRefunds: false,
  refundNotifications: true,
  partialRefunds: true,
  refundReasons: ['Insatisfação', 'Erro na compra', 'Produto indisponível'],
  refundProcessingTime: 5,
  refundMethod: 'original',
  minimumRefundAmount: 0,
  maximumRefundAmount: 1000000,
  refundFees: false,
  refundNotes: '',
};

export function PaymentSettings() {
  const form = useForm<RefundSettingsFormValues>({
    resolver: zodResolver(refundSettingsSchema),
    defaultValues,
  });

  function onSubmit(data: RefundSettingsFormValues) {
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações de reembolso foram atualizadas com sucesso.',
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Reembolso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="refundPeriod"
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
              name="refundPolicy"
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
              name="automaticRefunds"
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
              name="refundNotifications"
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
              name="partialRefunds"
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
              name="refundMethod"
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
                      <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
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
              name="refundProcessingTime"
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
                name="minimumRefundAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo para reembolso
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maximumRefundAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormDescription>
                      Valor máximo para reembolso
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="refundFees"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Reembolsar Taxas</FormLabel>
                    <FormDescription>
                      Incluir taxas de processamento no reembolso
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
              name="refundNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Adicionais</FormLabel>
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

        <Button type="submit" className="w-full">Salvar Configurações</Button>
      </form>
    </Form>
  );
}
