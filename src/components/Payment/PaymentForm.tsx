import React, { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Icons } from '../ui/icons';
import { useToast } from '../ui/use-toast';

interface PaymentFormProps {
    orderId: number;
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    orderId,
    amount,
    onSuccess,
    onCancel
}) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const { isProcessing, error, createPaymentSession, clearError } = usePayment();
    const { toast } = useToast();

    const paymentMethods = [
        { id: 'VISA', name: 'Visa', icon: Icons.visa },
        { id: 'MASTERCARD', name: 'Mastercard', icon: Icons.mastercard },
        { id: 'PAYPAL', name: 'PayPal', icon: Icons.paypal },
        { id: 'GOOGLEPAY', name: 'Google Pay', icon: Icons.googlePay },
        { id: 'SKRILL', name: 'Skrill', icon: Icons.skrill },
        { id: 'STRIPE', name: 'Stripe', icon: Icons.stripe },
        { id: 'MERCADOPAGO', name: 'Mercado Pago', icon: Icons.mercadoPago }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMethod) {
            toast({
                title: 'Erro',
                description: 'Por favor, selecione um método de pagamento',
                variant: 'destructive'
            });
            return;
        }

        try {
            const result = await createPaymentSession(selectedMethod, orderId, amount);
            
            // Redirecionar para a página de pagamento específica do método
            switch (selectedMethod) {
                case 'MERCADOPAGO':
                    window.location.href = result.paymentIntent.response.init_point;
                    break;
                case 'PAYPAL':
                    window.location.href = result.paymentIntent.response.links.find(
                        (link: any) => link.rel === 'approve'
                    ).href;
                    break;
                case 'STRIPE':
                    // Implementar redirecionamento do Stripe
                    break;
                default:
                    onSuccess();
            }
        } catch (err) {
            toast({
                title: 'Erro no pagamento',
                description: error || 'Ocorreu um erro ao processar o pagamento',
                variant: 'destructive'
            });
        }
    };

    return (
        <Card className="p-6 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Selecione o método de pagamento</h2>
                    <p className="text-gray-500">
                        Valor total: R$ {amount.toFixed(2)}
                    </p>
                </div>

                <RadioGroup
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex items-center space-x-2">
                                {method.icon && <method.icon className="h-6 w-6" />}
                                <span>{method.name}</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            'Pagar agora'
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}; 