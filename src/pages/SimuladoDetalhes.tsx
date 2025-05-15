import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ShoppingCart, Loader2 } from 'lucide-react';
import { Exam } from '@/services/simuladoService';
import { useCurrency } from '@/contexts/CurrencyContext';

const SimuladoDetalhes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulado, setSimulado] = useState<Exam | null>(null);
  const { formatPrice } = useCurrency();

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Implemente a lógica para adicionar o simulado ao carrinho
      // Isso pode envolver uma chamada para um backend para processar a compra
      // ou simplesmente adicionar ao estado local
      setSimulado(prevSimulado => ({
        ...prevSimulado!,
        is_subscription: !prevSimulado?.is_subscription,
      }));
    } catch (e) {
      setError('Ocorreu um erro ao adicionar o simulado ao carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : simulado ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{simulado.title}</h1>
                  <div className="flex gap-2">
                    <Badge variant="outline">{simulado.category}</Badge>
                    <Badge variant="outline">{simulado.difficulty}</Badge>
                    <Badge variant="outline">{simulado.language.toUpperCase()}</Badge>
                  </div>
                </div>
                {simulado.is_subscription ? (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(simulado.subscription_price || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      por 90 dias
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(simulado.price)}
                    </div>
                    {simulado.discountPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(simulado.discountPrice)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <p>{simulado.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Duração</div>
                  <div className="font-semibold">{simulado.duration} minutos</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Questões</div>
                  <div className="font-semibold">{simulado.questions_count}</div>
                </div>
              </div>

              {simulado.is_subscription && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Benefícios da Subscrição</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-600" />
                      <span>Acesso ilimitado por 90 dias</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-600" />
                      <span>Atualizações automáticas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-600" />
                      <span>Suporte prioritário</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleAddToCart}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {simulado.is_subscription ? 'Assinar Agora' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SimuladoDetalhes; 