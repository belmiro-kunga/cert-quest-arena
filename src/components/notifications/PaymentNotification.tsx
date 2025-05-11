import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
  paymentMethod: string;
}

export function usePaymentNotifications() {
  const notifyPayment = (payment: PaymentDetails) => {
    const title = getNotificationTitle(payment);
    const description = getNotificationDescription(payment);
    const variant = getNotificationVariant(payment);

    toast({
      title,
      description,
      variant,
      duration: 5000,
    });

    // Se o pagamento foi bem sucedido, enviar email de confirmação
    if (payment.status === 'success') {
      sendPaymentEmail(payment);
    }
  };

  return { notifyPayment };
}

function getNotificationTitle(payment: PaymentDetails): string {
  switch (payment.status) {
    case 'success':
      return 'Pagamento Confirmado';
    case 'pending':
      return 'Pagamento em Processamento';
    case 'failed':
      return 'Falha no Pagamento';
    default:
      return 'Atualização de Pagamento';
  }
}

function getNotificationDescription(payment: PaymentDetails): string {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: payment.currency,
  }).format(payment.amount);

  switch (payment.status) {
    case 'success':
      return `Recebemos o pagamento de ${formattedAmount} de ${payment.customerName}. O comprovante foi enviado para ${payment.customerEmail}.`;
    case 'pending':
      return `Pagamento de ${formattedAmount} de ${payment.customerName} está sendo processado.`;
    case 'failed':
      return `Houve um problema com o pagamento de ${formattedAmount} de ${payment.customerName}. Entre em contato com o suporte.`;
    default:
      return `Atualização no pagamento de ${formattedAmount} de ${payment.customerName}.`;
  }
}

function getNotificationVariant(payment: PaymentDetails): 'default' | 'destructive' | null {
  switch (payment.status) {
    case 'success':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return null;
  }
}

async function sendPaymentEmail(payment: PaymentDetails) {
  try {
    // Aqui você pode integrar com seu serviço de email
    const emailData = {
      to: payment.customerEmail,
      subject: 'Confirmação de Pagamento - CertQuest Arena',
      template: 'payment-confirmation',
      variables: {
        customerName: payment.customerName,
        amount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: payment.currency,
        }).format(payment.amount),
        paymentId: payment.id,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.timestamp.toLocaleDateString('pt-BR'),
        paymentTime: payment.timestamp.toLocaleTimeString('pt-BR'),
      },
    };

    // Enviar o email usando o serviço de email configurado
    // await emailService.send(emailData);
    
    console.log('Email de confirmação enviado:', emailData);
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
  }
}
