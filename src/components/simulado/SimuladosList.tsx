import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Award, ArrowRight, Gift, Filter } from 'lucide-react';
import { getActiveExams, Exam } from '@/services/simuladoService';
import { useToast } from '@/components/ui/use-toast';

const idiomasDisponiveis = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const SimuladosList: React.FC = () => {
  const [simulados, setSimulados] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extrair parâmetros da URL
  const queryParams = new URLSearchParams(location.search);
  const isFreeFilter = queryParams.get('free') === 'true';
  const categoryFilter = queryParams.get('category') || '';

  // Idioma preferido
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'pt');
  useEffect(() => {
    localStorage.setItem('preferredLanguage', preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    const loadSimulados = async () => {
      try {
        console.log('Carregando simulados ativos...');
        console.log('Filtros atuais:', { isFreeFilter, categoryFilter, preferredLanguage });
        setIsLoading(true);
        const data = await getActiveExams();
        
        // Processar os simulados para garantir que tenham campos de categoria consistentes
        const processedData = data.map(simulado => ({
          ...simulado,
          // Garantir que o campo categoria esteja definido
          categoria: (simulado as any).categoria || simulado.category || ''
        }));
        
        console.log('Simulados ativos recebidos:', processedData);
        
        // Verificar quais simulados correspondem aos filtros atuais
        const filteredSimulados = processedData.filter(s => {
          // Filtrar por idioma
          const languageMatch = s.language === preferredLanguage;
          
          // Filtrar por gratuito
          const freeMatch = !isFreeFilter || s.is_gratis;
          
          // Filtrar por categoria
          const categoryMatch = !categoryFilter || matchesCategory(s, categoryFilter);
          
          console.log(`Simulado ${s.title}: idioma=${languageMatch}, gratuito=${freeMatch}, categoria=${categoryMatch}`);
          
          return languageMatch && freeMatch && categoryMatch;
        });
        
        console.log(`Encontrados ${filteredSimulados.length} simulados que correspondem aos filtros`);
        
        setSimulados(processedData);
      } catch (error) {
        console.error('Erro ao carregar simulados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os simulados disponíveis.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSimulados();
  }, [toast, isFreeFilter, categoryFilter, preferredLanguage]);

  // Função para renderizar o badge de dificuldade
  const renderDifficultyBadge = (difficulty: string) => {
    const colorMap: Record<string, string> = {
      'Fácil': 'bg-green-500',
      'Médio': 'bg-yellow-500',
      'Difícil': 'bg-orange-500',
      'Avançado': 'bg-red-500'
    };
    
    const bgColor = colorMap[difficulty] || 'bg-blue-500';
    
    return (
      <Badge variant="secondary" className={bgColor}>
        {difficulty}
      </Badge>
    );
  };

  // Função para atualizar os filtros na URL
  const updateFilters = (free: boolean | null, category: string | null) => {
    const params = new URLSearchParams(location.search);
    
    if (free !== null) {
      if (free) {
        params.set('free', 'true');
      } else {
        params.delete('free');
      }
    }
    
    if (category !== null) {
      if (category) {
        params.set('category', category);
      } else {
        params.delete('category');
      }
    }
    
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Função para obter a categoria do simulado (suporta tanto 'category' quanto 'categoria')
  const getSimuladoCategory = (simulado: Exam): string => {
    // Verificar se o simulado tem o campo 'categoria' (do backend)
    if ((simulado as any).categoria) {
      return (simulado as any).categoria;
    }
    // Caso contrário, usar o campo 'category'
    return simulado.category || '';
  };

  // Função para verificar se um simulado corresponde a uma categoria
  const matchesCategory = (simulado: Exam, categoryFilter: string): boolean => {
    if (!categoryFilter) return true;
    
    // Obter a categoria do simulado (pode ser de 'category' ou 'categoria')
    const simuladoCategory = getSimuladoCategory(simulado).toLowerCase();
    const filter = categoryFilter.toLowerCase();
    
    // Mapeamento de termos relacionados para melhorar a correspondência
    const categoryMappings: Record<string, string[]> = {
      'aws': ['aws', 'amazon', 'amazon web services'],
      'azure': ['azure', 'microsoft azure', 'microsoft', 'az-'],
      'gcp': ['gcp', 'google cloud', 'google'],
      'comptia': ['comptia', 'comp tia', 'a+', 'network+', 'security+'],
      'cisco': ['cisco', 'ccna', 'ccnp']
    };
    
    // Verificar se o filtro tem mapeamentos especiais
    const filterTerms = categoryMappings[filter] || [filter];
    
    // Verificar se a categoria do simulado contém algum dos termos mapeados
    const categoryMatch = filterTerms.some(term => 
      simuladoCategory.includes(term) || 
      // Verificar também no título do simulado
      simulado.title.toLowerCase().includes(term)
    );
    
    console.log(`Verificando categoria para ${simulado.title}: categoria=${simuladoCategory}, filtro=${filter}, match=${categoryMatch}`);
    
    return categoryMatch;
  };

  // Função para renderizar o badge de categoria
  const renderCategoryBadge = (category: string) => {
    if (!category) return null;
    
    const categoryMap: Record<string, { color: string, label: string }> = {
      'aws': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'AWS' },
      'azure': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Microsoft Azure' },
      'gcp': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Google Cloud' },
      'comptia': { color: 'bg-green-100 text-green-800 border-green-200', label: 'CompTIA' },
      'cisco': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Cisco' }
    };
    
    const { color, label } = categoryMap[category.toLowerCase()] || 
      { color: 'bg-gray-100 text-gray-800 border-gray-200', label: category };
    
    return (
      <Badge className={`${color} border rounded-full px-2 py-1 text-xs font-medium shadow-sm select-none`}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          {isFreeFilter ? "Simulados Gratuitos" : "Simulados Disponíveis"}
        </h1>
        <p className="text-muted-foreground">
          {isFreeFilter 
            ? "Acesse nossos simulados gratuitos para testar seus conhecimentos" 
            : "Prepare-se para suas certificações com nossos simulados de alta qualidade"}
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Filtro Gratuito */}
          <div className="flex items-center gap-2">
            <Button 
              variant={isFreeFilter ? "default" : "outline"}
              className={`${isFreeFilter ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-700 hover:bg-green-50"} rounded-full px-4`}
              onClick={() => updateFilters(!isFreeFilter, null)}
            >
              <Gift className="mr-2 h-4 w-4" />
              {isFreeFilter ? "Todos os Simulados" : "Apenas Gratuitos"}
            </Button>
          </div>

          {/* Seletor de Idioma */}
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="font-medium">Idioma:</label>
            <select
              id="language-select"
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {idiomasDisponiveis.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de Categoria */}
        {isFreeFilter && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant={categoryFilter === '' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === '' ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-700 hover:bg-green-50"}`}
              onClick={() => updateFilters(null, '')}
            >
              Todos
            </Button>
            <Button 
              variant={categoryFilter === 'aws' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === 'aws' ? "bg-orange-600 hover:bg-orange-700" : "border-orange-500 text-orange-700 hover:bg-orange-50"}`}
              onClick={() => updateFilters(null, 'aws')}
            >
              AWS
            </Button>
            <Button 
              variant={categoryFilter === 'azure' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === 'azure' ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500 text-blue-700 hover:bg-blue-50"}`}
              onClick={() => updateFilters(null, 'azure')}
            >
              Microsoft Azure
            </Button>
            <Button 
              variant={categoryFilter === 'gcp' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === 'gcp' ? "bg-red-600 hover:bg-red-700" : "border-red-500 text-red-700 hover:bg-red-50"}`}
              onClick={() => updateFilters(null, 'gcp')}
            >
              Google Cloud
            </Button>
            <Button 
              variant={categoryFilter === 'comptia' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === 'comptia' ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-700 hover:bg-green-50"}`}
              onClick={() => updateFilters(null, 'comptia')}
            >
              CompTIA
            </Button>
            <Button 
              variant={categoryFilter === 'cisco' ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${categoryFilter === 'cisco' ? "bg-indigo-600 hover:bg-indigo-700" : "border-indigo-500 text-indigo-700 hover:bg-indigo-50"}`}
              onClick={() => updateFilters(null, 'cisco')}
            >
              Cisco
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {simulados
            .filter(s => {
              // Filtrar por idioma
              if (s.language !== preferredLanguage) return false;
              
              // Filtrar por gratuito se o filtro estiver ativo
              if (isFreeFilter && !s.is_gratis) return false;
              
              // Filtrar por categoria se uma categoria estiver selecionada
              if (categoryFilter && !matchesCategory(s, categoryFilter)) return false;
              
              return true;
            })
            .length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {isFreeFilter 
                    ? `Nenhum simulado gratuito disponível ${categoryFilter ? `na categoria ${categoryFilter}` : ''}.`
                    : "Nenhum simulado disponível com os filtros selecionados."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulados
                  .filter(s => {
                    // Filtrar por idioma
                    if (s.language !== preferredLanguage) return false;
                    
                    // Filtrar por gratuito se o filtro estiver ativo
                    if (isFreeFilter && !s.is_gratis) return false;
                    
                    // Filtrar por categoria se uma categoria estiver selecionada
                    if (categoryFilter && !matchesCategory(s, categoryFilter)) return false;
                    
                    return true;
                  })
                  .map((simulado) => (
            <Card key={simulado.id} className={`flex flex-col h-full hover:shadow-lg transition-shadow ${simulado.is_gratis ? 'border-green-200' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-xl">{simulado.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {simulado.is_gratis && (
                        <Badge className="bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-1 text-xs font-bold shadow-sm select-none">
                          Grátis
                        </Badge>
                      )}
                      {renderCategoryBadge(getSimuladoCategory(simulado))}
                    </div>
                  </div>
                  {renderDifficultyBadge(simulado.difficulty)}
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {simulado.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{simulado.duration} minutos</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{simulado.questions_count} questões</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {simulado.is_gratis ? (
                      <span className="font-bold text-green-700">Acesso Gratuito</span>
                    ) : (
                      <>
                        {typeof simulado.price === 'number' && simulado.price > 0 && (
                          <span className="font-semibold text-cert-blue">Preço BRL: R$ {simulado.price.toFixed(2).replace('.', ',')}</span>
                        )}
                        {typeof simulado.preco_usd === 'number' && simulado.preco_usd > 0 && (
                          <span className="font-semibold text-blue-600">Preço USD: $ {simulado.preco_usd.toFixed(2)}</span>
                        )}
                        {(!simulado.price || simulado.price === 0) && (!simulado.preco_usd || simulado.preco_usd === 0) && (
                          <span className="text-gray-400">Preço não informado</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/simulados/${simulado.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className={`flex-1 ${simulado.is_gratis ? 'bg-green-600 hover:bg-green-700' : 'bg-cert-blue hover:bg-cert-darkblue'}`}
                  >
                    <Link to={`/simulados/${simulado.id}`}>
                      {simulado.is_gratis ? 'Acessar Grátis' : 'Comprar Agora'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default SimuladosList;
