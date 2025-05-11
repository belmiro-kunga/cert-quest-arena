import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentNotifications } from '@/components/notifications/PaymentNotification';
import { processPayment, TransactionDetails } from '@/services/paymentService';

export function PaymentProcessor() {
  const [processing, setProcessing] = useState(false);
  const { notifyPayment } = usePaymentNotifications();

  const handlePayment = async () => {
    setProcessing(true);

    // Exemplo de dados do pagamento
    const paymentDetails: TransactionDetails = {
      amount: 199.99,
      currency: 'BRL',
      customerName: 'João Silva',
      customerEmail: 'joao.silva@example.com',
      paymentMethod: 'credit_card',
      metadata: {
        courseId: 'cert-123',
        courseName: 'Certificação AWS Cloud Practitioner'
      }
    };

    try {
      // Processar o pagamento usando o gateway padrão
      const result = await processPayment('default-gateway', paymentDetails);

      // Notificar o usuário do resultado
      notifyPayment({
        id: result.transactionId || 'unknown',
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        status: result.status,
        timestamp: result.timestamp,
        paymentMethod: paymentDetails.paymentMethod
      });

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      notifyPayment({
        id: 'error',
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        status: 'failed',
        timestamp: new Date(),
        paymentMethod: paymentDetails.paymentMethod
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
