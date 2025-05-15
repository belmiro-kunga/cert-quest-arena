import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pacote, getPacoteById, calcularPrecoTotalSemDesconto, calcularPrecoTotalComDesconto, calcularEconomia } from '@/services/pacoteService';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Package, ArrowLeft, BookOpen, Clock, Tag, Check, AlertTriangle, Star, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const PacoteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pacote, setPacote] = useState<Pacote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchPacote = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPacoteById(id);
        setPacote(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do pacote:', error);
        setError('Não foi possível carregar os detalhes do pacote. Por favor, tente novamente mais tarde.');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do pacote.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacote();
  }, [id, toast]);

  const handleAddToCart = () => {
    if (!pacote) return;
    
    // Verificar se o pacote já está no carrinho
    const isInCart = items.some(item => item.id === `pacote-${pacote.id}`);
    
    if (isInCart) {
      toast({
        title: 'Pacote já adicionado',
        description: 'Este pacote já está no seu carrinho.',
      });
      return;
    }
    
    // Adicionar o pacote ao carrinho
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Botão de voltar */}
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {isLoading ? (
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Erro ao carregar pacote</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Button 
                className="bg-gradient-to-r from-cert-blue to-blue-700 hover:from-cert-blue/90 hover:to-blue-700/90 text-white shadow-md hover:shadow-lg transition-all"
                onClick={() => navigate('/pacotes')}
              >
                Ver outros pacotes
              </Button>
            </div>
          </div>
        ) : pacote ? (
          <>
            {/* Faixa de gradiente baseada na categoria */}
            <div className={`h-16 bg-gradient-to-r ${getCategoryGradient(pacote.categoria)} w-full`}></div>
            
            <div className="container mx-auto max-w-6xl px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Detalhes do pacote */}
                <div className="md:col-span-2">
                  <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-none rounded-full px-3 py-1 text-xs font-bold shadow-md select-none flex items-center gap-1">
                        <Package className="h-3 w-3 mr-1" />
                        Pacote
                      </Badge>
                      {renderCategoryBadge(pacote.categoria)}
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md select-none">
                        {pacote.porcentagem_desconto}% OFF
                      </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">{pacote.titulo}</h1>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{pacote.descricao}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="bg-blue-100 p-1.5 rounded-full">
                          <Package className="h-4 w-4 text-blue-700" />
                        </div>
                        <span className="text-blue-700 font-medium">{pacote.simulados.length} Simulados</span>
                      </div>
                      
                      {pacote.is_subscription && (
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                          <div className="bg-purple-100 p-1.5 rounded-full">
                            <Clock className="h-4 w-4 text-purple-700" />
                          </div>
                          <span className="text-purple-700 font-medium">Acesso por {pacote.subscription_duration} dias</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                        <div className="bg-green-100 p-1.5 rounded-full">
                          <Tag className="h-4 w-4 text-green-700" />
                        </div>
                        <span className="text-green-700 font-medium">Economia de {formatPrice(calcularEconomia(pacote))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                      <BookOpen className="h-5 w-5 text-cert-blue" />
                      Simulados incluídos neste pacote
                    </h2>
                    
                    {pacote.simulados.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Nenhum simulado incluído neste pacote.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pacote.simulados.map((simulado) => (
                          <Card key={simulado.id} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{simulado.title}</h3>
                                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                    {simulado.category && (
                                      <div className="flex items-center gap-1">
                                        <Tag className="h-4 w-4 text-cert-blue" />
                                        <span>{simulado.category}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-cert-blue" />
                                      <span>{simulado.duration} minutos</span>
                                    </div>
                                    {simulado.questions_count && (
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4 text-cert-blue" />
                                        <span>{simulado.questions_count} questões</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {simulado.difficulty && (
                                  <Badge className={`${
                                    simulado.difficulty === 'Fácil' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700' :
                                    simulado.difficulty === 'Médio' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700' :
                                    'bg-gradient-to-r from-red-50 to-red-100 text-red-700'
                                  } border rounded-full px-2 py-1 text-xs font-medium shadow-sm select-none`}>
                                    {simulado.difficulty}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Benefícios do pacote</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Acesso completo</h3>
                            <p className="text-gray-600 mt-1">Acesse todos os simulados incluídos neste pacote sem restrições.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Atualizações incluídas</h3>
                            <p className="text-gray-600 mt-1">Receba atualizações gratuitas sempre que os simulados forem atualizados.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Economia garantida</h3>
                            <p className="text-gray-600 mt-1">Economize {pacote.porcentagem_desconto}% em comparação com a compra individual dos simulados.</p>
                          </div>
                        </div>
                      </div>
                      
                      {pacote.is_subscription && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-blue-900">Assinatura por tempo limitado</h3>
                              <p className="text-blue-700 mt-1">Acesso por {pacote.subscription_duration} dias a partir da data de compra.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card de compra */}
                <div>
                  <Card className="sticky top-4 overflow-hidden border-0 rounded-xl shadow-lg">
                    <div className="h-3 w-full bg-gradient-to-r from-cert-blue to-blue-700"></div>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Preço original:</span>
                          <span className="text-sm line-through text-muted-foreground">
                            {formatPrice(calcularPrecoTotalSemDesconto(pacote))}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium">Preço com desconto:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(calcularPrecoTotalComDesconto(pacote))}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                          <span className="text-sm font-medium">Economia:</span>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">
                            {formatPrice(calcularEconomia(pacote))}
                          </span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>{pacote.simulados.length} simulados incluídos</span>
                        </div>
                        
                        {pacote.is_subscription ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Acesso por {pacote.subscription_duration} dias</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Acesso permanente</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Atualizações incluídas</span>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-cert-blue to-blue-700 hover:from-cert-blue/90 hover:to-blue-700/90 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                      
                      <p className="text-xs text-center text-gray-500">
                        Pagamento seguro via cartão de crédito ou boleto bancário
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default PacoteDetalhes;
