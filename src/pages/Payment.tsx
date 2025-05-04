import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentForm } from '../components/Payment/PaymentForm';
import { useToast } from '../components/ui/use-toast';

export const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Recuperar dados do pedido do estado da navegação
    const { orderId, amount } = location.state || {};

    if (!orderId || !amount) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Erro</h1>
                    <p className="mt-2">Informações do pedido não encontradas.</p>
                </div>
            </div>
        );
    }

    const handleSuccess = () => {
        toast({
            title: 'Pagamento iniciado',
            description: 'Você será redirecionado para a página de pagamento.',
        });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Pagamento</h1>
                
                <PaymentForm
                    orderId={orderId}
                    amount={amount}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}; 