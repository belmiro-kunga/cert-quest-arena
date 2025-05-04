import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../components/ui/icons';

export const PaymentResultPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar o status do pagamento baseado na URL
    const isSuccess = location.pathname.includes('success');
    const isPending = location.pathname.includes('pending');

    useEffect(() => {
        // Se o pagamento foi bem-sucedido, atualizar o status do pedido
        if (isSuccess) {
            // Implementar lógica de atualização do status do pedido
        }
    }, [isSuccess]);

    const handleContinue = () => {
        navigate('/dashboard'); // Ou outra rota apropriada
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-lg mx-auto p-6">
                <div className="text-center space-y-4">
                    {isSuccess ? (
                        <>
                            <Icons.success className="w-16 h-16 text-green-500 mx-auto" />
                            <h1 className="text-2xl font-bold text-green-600">
                                Pagamento realizado com sucesso!
                            </h1>
                            <p className="text-gray-600">
                                Seu pedido foi confirmado e você receberá um e-mail com os detalhes.
                            </p>
                        </>
                    ) : isPending ? (
                        <>
                            <Icons.warning className="w-16 h-16 text-yellow-500 mx-auto" />
                            <h1 className="text-2xl font-bold text-yellow-600">
                                Pagamento em processamento
                            </h1>
                            <p className="text-gray-600">
                                Seu pagamento está sendo processado. Você receberá uma notificação
                                assim que for confirmado.
                            </p>
                        </>
                    ) : (
                        <>
                            <Icons.error className="w-16 h-16 text-red-500 mx-auto" />
                            <h1 className="text-2xl font-bold text-red-600">
                                Erro no pagamento
                            </h1>
                            <p className="text-gray-600">
                                Houve um problema ao processar seu pagamento. Por favor, tente novamente.
                            </p>
                        </>
                    )}

                    <div className="pt-6">
                        <Button
                            onClick={handleContinue}
                            className="w-full"
                            variant={isSuccess ? "default" : "outline"}
                        >
                            {isSuccess ? 'Ir para o Dashboard' : 'Tentar novamente'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}; 