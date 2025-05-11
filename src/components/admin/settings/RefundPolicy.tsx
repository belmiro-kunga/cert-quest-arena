import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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
  additionalNotes: z.string(),
});

type RefundPolicyFormData = z.infer<typeof refundPolicySchema>;

const defaultValues: RefundPolicyFormData = {
  refundPeriod: 14,
  refundPolicy: 'Nossa política de reembolso garante a satisfação do cliente. Reembolsos podem ser solicitados em até 14 dias após a compra, desde que o curso não tenha sido concluído em mais de 30%.',
  automaticRefunds: false,
  refundNotifications: true,
  partialRefunds: true,
  refundReasons: [
    'Insatisfação com o conteúdo',
    'Problemas técnicos',
    'Expectativas não atendidas',
    'Indisponibilidade de tempo',
    'Outros'
  ],
  processingTime: 5,
  refundMethod: 'original',
  minAmount: 0,
  maxAmount: 10000,
  refundFees: false,
  additionalNotes: '',
};

export function RefundPolicy() {
  const form = useForm<RefundPolicyFormData>({
    resolver: zodResolver(refundPolicySchema),
    defaultValues,
  });

  const onSubmit = async (data: RefundPolicyFormData) => {
    try {
      // TODO: Implement save to database
      console.log('Saving refund policy:', data);
      toast({
        title: 'Sucesso',
        description: 'Política de reembolso atualizada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar a política de reembolso.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Política de Reembolso</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refundPeriod">Período de Reembolso (dias)</Label>
              <Input
                id="refundPeriod"
                type="number"
                {...form.register('refundPeriod', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processingTime">Tempo de Processamento (dias úteis)</Label>
              <Input
                id="processingTime"
                type="number"
                {...form.register('processingTime', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refundPolicy">Política de Reembolso</Label>
            <Textarea
              id="refundPolicy"
              {...form.register('refundPolicy')}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="automaticRefunds"
                {...form.register('automaticRefunds')}
              />
              <Label htmlFor="automaticRefunds">Reembolsos Automáticos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="refundNotifications"
                {...form.register('refundNotifications')}
              />
              <Label htmlFor="refundNotifications">Notificações de Reembolso</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="partialRefunds"
                {...form.register('partialRefunds')}
              />
              <Label htmlFor="partialRefunds">Reembolsos Parciais</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="refundFees"
                {...form.register('refundFees')}
              />
              <Label htmlFor="refundFees">Reembolsar Taxas</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refundMethod">Método de Reembolso</Label>
            <Select
              onValueChange={(value) => form.setValue('refundMethod', value as 'original' | 'credit' | 'transfer')}
              defaultValue={form.getValues('refundMethod')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método de reembolso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Método Original de Pagamento</SelectItem>
                <SelectItem value="credit">Crédito na Plataforma</SelectItem>
                <SelectItem value="transfer">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Valor Mínimo (USD)</Label>
              <Input
                id="minAmount"
                type="number"
                {...form.register('minAmount', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Valor Máximo (USD)</Label>
              <Input
                id="maxAmount"
                type="number"
                {...form.register('maxAmount', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Observações Adicionais</Label>
            <Textarea
              id="additionalNotes"
              {...form.register('additionalNotes')}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Política de Reembolso
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
