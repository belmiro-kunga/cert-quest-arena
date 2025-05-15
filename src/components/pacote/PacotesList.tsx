import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, BookOpen, Check, Tag, Clock, Award, Star } from 'lucide-react';
import { Pacote, getAllPacotes, calcularPrecoTotalSemDesconto, calcularPrecoTotalComDesconto, calcularEconomia } from '@/services/pacoteService';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PacotesListProps {
  categoria?: string;
  maxItems?: number;
  showTitle?: boolean;
}

const PacotesList: React.FC<PacotesListProps> = ({ 
  categoria, 
  maxItems = 0,
  showTitle = true
}) => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const loadPacotes = async () => {
      try {
        setIsLoading(true);
        let data = await getAllPacotes();
        
        // Filtrar por categoria se especificada
        if (categoria) {
          data = data.filter(pacote => pacote.categoria?.toLowerCase() === categoria.toLowerCase());
        }
        
        // Limitar o número de pacotes se maxItems > 0
        if (maxItems > 0) {
          data = data.slice(0, maxItems);
        }
        
        setPacotes(data);
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os pacotes disponíveis.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPacotes();
  }, [categoria, maxItems, toast]);

  const handleAddToCart = (pacote: Pacote) => {
    // Adicionar o pacote como um item único ao carrinho
    const precoComDesconto = calcularPrecoTotalComDesconto(pacote);
    
    addItem({
      id: `pacote-${pacote.id}`,
      title: pacote.titulo,
      description: `Pacote com ${pacote.simulados.length} simulados - ${pacote.porcentagem_desconto}% de desconto`,
      price: precoComDesconto,
      isPackage: true,
      packageItems: pacote.simulados.map(simulado => simulado.id)
    });
    
    toast({
      title: 'Pacote adicionado',
      description: `O pacote "${pacote.titulo}" foi adicionado ao carrinho.`,
    });
  };

  // Função para renderizar o badge de categoria
  const renderCategoryBadge = (category: string) => {
    if (!category) return null;
    
    const categoryMap: Record<string, { color: string, bgColor: string, icon: React.ReactNode, label: string }> = {
      'aws': { 
        color: 'text-orange-700', 
        bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200', 
        icon: <Star className="h-3 w-3" />, 
        label: 'AWS' 
      },
      'azure': { 
        color: 'text-blue-700', 
        bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200', 
        icon: <Star className="h-3 w-3" />, 
        label: 'Microsoft Azure' 
      },
      'gcp': { 
        color: 'text-red-700', 
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200', 
        icon: <Star className="h-3 w-3" />, 
        label: 'Google Cloud' 
      },
      'comptia': { 
        color: 'text-green-700', 
        bgColor: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200', 
        icon: <Award className="h-3 w-3" />, 
        label: 'CompTIA' 
      },
      'cisco': { 
        color: 'text-indigo-700', 
        bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200', 
        icon: <Award className="h-3 w-3" />, 
        label: 'Cisco' 
      }
    };
    
    const { color, bgColor, icon, label } = categoryMap[category.toLowerCase()] || 
      { color: 'text-gray-700', bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200', icon: <Tag className="h-3 w-3" />, label: category };
    
    return (
      <Badge className={`${color} ${bgColor} border rounded-full px-3 py-1 text-xs font-medium shadow-sm select-none flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    );
  };

  // Função para gerar um gradiente baseado na categoria
  const getCategoryGradient = (category: string) => {
    const gradientMap: Record<string, string> = {
      'aws': 'from-orange-500 to-amber-600',
      'azure': 'from-blue-500 to-cyan-600',
      'gcp': 'from-red-500 to-pink-600',
      'comptia': 'from-green-500 to-emerald-600',
      'cisco': 'from-indigo-500 to-violet-600'
    };
    
    return gradientMap[category?.toLowerCase()] || 'from-purple-500 to-violet-600';
  };

  return (
    <div className="w-full">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cert-blue to-blue-700">
            {categoria ? `Pacotes de ${categoria.toUpperCase()}` : "Pacotes de Simulados"}
          </h2>
          <p className="text-lg text-muted-foreground">
            Economize até <span className="font-bold text-green-600">30%</span> ao comprar simulados em pacotes
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cert-blue"></div>
        </div>
      ) : (
        <>
          {pacotes.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
              <Package className="h-20 w-20 mx-auto text-gray-300 mb-6" />
              <p className="text-2xl font-medium text-muted-foreground">
                {categoria 
                  ? `Nenhum pacote disponível para a categoria ${categoria}.`
                  : "Nenhum pacote disponível no momento."}
              </p>
              <p className="mt-2 text-muted-foreground">
                Volte em breve para conferir novidades!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pacotes.map((pacote) => {
                const categoryGradient = getCategoryGradient(pacote.categoria);
                
                // Garantir que porcentagem_desconto tenha um valor válido
                const porcentagemDesconto = typeof pacote.porcentagem_desconto === 'number' && !isNaN(pacote.porcentagem_desconto) 
                  ? pacote.porcentagem_desconto 
                  : 25;
                
                // Calcular preços
                const precoOriginal = calcularPrecoTotalSemDesconto(pacote);
                const precoComDesconto = precoOriginal * (1 - porcentagemDesconto / 100);
                const economiaValor = precoOriginal - precoComDesconto;
                
                console.log('Pacote:', pacote.titulo, 'Preço original:', precoOriginal, 'Desconto:', porcentagemDesconto, 'Preço com desconto:', precoComDesconto);
                
                return (
                  <Card key={pacote.id} className="flex flex-col h-full overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`h-3 w-full bg-gradient-to-r ${categoryGradient}`}></div>
                    <CardHeader className="pb-3 relative">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-2xl font-bold">{pacote.titulo}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-none rounded-full px-3 py-1 text-xs font-bold shadow-md select-none">
                              <Package className="h-3 w-3 mr-1" />
                              Pacote
                            </Badge>
                            {renderCategoryBadge(pacote.categoria)}
                          </div>
                        </div>
                        <div className="absolute -right-8 -top-8 bg-gradient-to-br from-green-500 to-green-600 text-white transform rotate-45 shadow-lg px-10 py-1">
                          <span className="text-xs font-extrabold">{porcentagemDesconto}% OFF</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="mb-6 text-sm leading-relaxed">{pacote.descricao}</CardDescription>
                      
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <div className="bg-cert-blue/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-cert-blue" />
                          </div>
                          <div>
                            <span className="font-medium">{pacote.simulados.length} simulados</span>
                            <p className="text-xs text-muted-foreground">Acesso completo</p>
                          </div>
                        </div>
                        
                        {pacote.simulados.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 text-cert-blue mr-2" />
                              Simulados incluídos:
                            </p>
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {pacote.simulados.map((simulado) => (
                                <li key={simulado.id} className="text-sm flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                                  <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                                  <span className="truncate">{simulado.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {pacote.is_subscription && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2 flex items-center">
                              <Clock className="h-4 w-4 text-blue-600 mr-2" />
                              Assinatura:
                            </p>
                            <p className="text-sm text-blue-700">
                              Acesso por {pacote.subscription_duration} dias
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Preço original:</span>
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(precoOriginal)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Preço com desconto:</span>
                            <span className="text-xl font-bold text-green-600">
                              {formatPrice(precoComDesconto)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium">Economia:</span>
                            <span className="text-sm font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                              {formatPrice(economiaValor)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 pb-6 bg-gray-50">
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all"
                          onClick={() => navigate(`/pacotes/${pacote.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-cert-blue to-blue-700 hover:from-cert-blue/90 hover:to-blue-700/90 text-white shadow-md hover:shadow-lg transition-all"
                          onClick={() => handleAddToCart(pacote)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao Carrinho
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
};

export default PacotesList;
