
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/services/paymentService';

export function PaymentProcessor() {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setProcessing(true);

    // Exemplo de dados do pagamento
    const paymentData = {
      amount: 199.99,
      currency: 'BRL',
      paymentMethod: 'credit_card',
      userId: 'user-123',
      description: 'Certificação AWS Cloud Practitioner'
    };

    try {
      // Processar o pagamento
      const result = await processPayment(paymentData);

      // Notificar o usuário do resultado
      toast({
        title: 'Pagamento processado',
        description: `Pagamento de ${result.amount} ${result.currency} foi processado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: 'Erro no pagamento',
        description: 'Ocorreu um erro ao processar o pagamento.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processar Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            placeholder="199.99"
            defaultValue="199.99"
            disabled={processing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Nome do Cliente</Label>
          <Input
            id="customerName"
            placeholder="João Silva"
            defaultValue="João Silva"
            disabled={processing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email do Cliente</Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="joao.silva@example.com"
            defaultValue="joao.silva@example.com"
            disabled={processing}
          />
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={processing}
          className="w-full"
        >
          {processing ? 'Processando...' : 'Pagar Agora'}
        </Button>
      </CardContent>
    </Card>
  );
}
