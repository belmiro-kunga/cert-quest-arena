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

const cancellationSettingsSchema = z.object({
  // Prazos
  cancellationPeriod: z.number().min(0, 'O período deve ser maior ou igual a 0'),
  gracePeriod: z.number().min(0, 'O período deve ser maior ou igual a 0'),
  processingTime: z.number().min(1, 'O tempo de processamento deve ser maior que 0'),
  
  // Políticas de reembolso
  refundPolicy: z.enum(['full', 'partial', 'none']),
  refundPercentage: z.number().min(0).max(100).optional(),
  refundProcessingFee: z.boolean(),
  
  // Condições
  allowPartialCancellation: z.boolean(),
  requireReason: z.boolean(),
  allowRescheduling: z.boolean(),
  reschedulingFee: z.number().min(0),
  
  // Notificações
  notifyAdmin: z.boolean(),
  notifyUser: z.boolean(),
  adminEmail: z.string().email().optional(),
  
  // Configurações gerais
  cancellationReasons: z.array(z.string()),
  customTerms: z.string().optional(),
  blackoutDates: z.array(z.string()),
  minimumNotice: z.number().min(0),
});

type CancellationSettingsFormValues = z.infer<typeof cancellationSettingsSchema>;

const defaultValues: Partial<CancellationSettingsFormValues> = {
  cancellationPeriod: 24,
  gracePeriod: 1,
  processingTime: 3,
  refundPolicy: 'full',
  refundPercentage: 100,
  refundProcessingFee: false,
  allowPartialCancellation: true,
  requireReason: true,
  allowRescheduling: true,
  reschedulingFee: 0,
  notifyAdmin: true,
  notifyUser: true,
  cancellationReasons: [
    'Mudança de planos',
    'Emergência',
    'Indisponibilidade',
    'Outro'
  ],
  minimumNotice: 12,
};

const REFUND_POLICIES = [
  { value: 'full', label: 'Reembolso Total' },
  { value: 'partial', label: 'Reembolso Parcial' },
  { value: 'none', label: 'Sem Reembolso' },
];

export function CancellationSettings() {
  const form = useForm<CancellationSettingsFormValues>({
    resolver: zodResolver(cancellationSettingsSchema),
    defaultValues,
  });

  const watchRefundPolicy = form.watch('refundPolicy');

  function onSubmit(data: CancellationSettingsFormValues) {
    toast({
      title: 'Configurações atualizadas',
      description: 'As políticas de cancelamento foram atualizadas com sucesso.',
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prazos e Períodos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cancellationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Cancelamento (horas)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Prazo máximo para cancelamento antes do início
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gracePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Carência (horas)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tempo após a compra com cancelamento sem penalidades
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de Processamento (dias)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tempo para processar o cancelamento
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Política de Reembolso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="refundPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Reembolso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a política de reembolso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REFUND_POLICIES.map((policy) => (
                        <SelectItem key={policy.value} value={policy.value}>
                          {policy.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {watchRefundPolicy === 'partial' && (
              <FormField
                control={form.control}
                name="refundPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentual de Reembolso</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual do valor a ser reembolsado
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="refundProcessingFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Reembolsar Taxa de Processamento</FormLabel>
                    <FormDescription>
                      Incluir a taxa de processamento no reembolso
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
            <CardTitle>Condições e Opções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="allowPartialCancellation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Permitir Cancelamento Parcial</FormLabel>
                      <FormDescription>
                        Permitir cancelamento de parte dos serviços
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
                name="requireReason"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Exigir Motivo</FormLabel>
                      <FormDescription>
                        Exigir que o usuário forneça um motivo para o cancelamento
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
                name="allowRescheduling"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Permitir Reagendamento</FormLabel>
                      <FormDescription>
                        Permitir reagendamento em vez de cancelamento
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

              {form.watch('allowRescheduling') && (
                <FormField
                  control={form.control}
                  name="reschedulingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Reagendamento ($)</FormLabel>
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
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notifyAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Notificar Administrador</FormLabel>
                    <FormDescription>
                      Enviar email ao administrador quando houver cancelamentos
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

            {form.watch('notifyAdmin') && (
              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Administrador</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notifyUser"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Notificar Usuário</FormLabel>
                    <FormDescription>
                      Enviar email de confirmação ao usuário
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
            <CardTitle>Configurações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="customTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termos e Condições Personalizados</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Digite os termos e condições específicos para cancelamentos..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumNotice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aviso Mínimo (horas)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Tempo mínimo de antecedência para solicitar cancelamento
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Salvar Configurações
        </Button>
      </form>
    </Form>
  );
}
