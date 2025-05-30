import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PacotesList from '@/components/pacote/PacotesList';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';
import CertificationSimuladosModal from '@/components/simulado/CertificationSimuladosModal';
// import { Exam } from '@/types/admin'; // Substituído por definição local temporária
// TODO: Substitua por fetch real dos exames ou dados mockados válidos
// Definição temporária de Exam com discountPrice
export type ExamLanguage = 'pt' | 'en' | 'fr' | 'es';
// Interface para os exames
export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  preco_usd?: number;
  preco_eur?: number;
  language: string;
  difficulty: string;
  duration: number;
  questions_count: number;
  category: string;
  image_url: string;
  is_gratis: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  total_questions: number;
  passing_score: number;
  tags: string[];
}
const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Simulado AWS (Português)',
    description: 'Simulado completo em português.',
    price: 49.9,
    discountPrice: 29.9,
    language: 'pt',
    difficulty: 'easy',
    duration: 60,
    questions_count: 60,
    category: 'Cloud',
    image_url: '',
    is_gratis: false,
    created_at: '',
    updated_at: '',
    is_active: true,
    total_questions: 60,
    passing_score: 80,
    tags: []
  },
  {
    id: '2',
    title: 'AWS Practice Exam (English)',
    description: 'Full practice exam in English.',
    price: 49.9,
    discountPrice: 39.9,
    language: 'en',
    difficulty: 'intermediate',
    duration: 60,
    questions_count: 60,
    category: 'Cloud',
    image_url: '',
    is_gratis: false,
    created_at: '',
    updated_at: '',
    is_active: true,
    total_questions: 60,
    passing_score: 80,
    tags: []
  },
  {
    id: '3',
    title: 'Examen AWS (Español)',
    description: 'Simulador completo en español.',
    price: 49.9,
    discountPrice: 34.9,
    language: 'es',
    difficulty: 'easy',
    duration: 60,
    questions_count: 60,
    category: 'Cloud',
    image_url: '',
    is_gratis: false,
    created_at: '',
    updated_at: '',
    is_active: true,
    total_questions: 60,
    passing_score: 80,
    tags: []
  },
  {
    id: '4',
    title: 'Examen AWS (Français)',
    description: 'Examen complet en français.',
    price: 49.9,
    discountPrice: 37.9,
    language: 'fr',
    difficulty: 'advanced',
    duration: 60,
    questions_count: 60,
    category: 'Cloud',
    image_url: '',
    is_gratis: false,
    created_at: '',
    updated_at: '',
    is_active: true,
    total_questions: 60,
    passing_score: 80,
    tags: []
  }
];
import { useCurrency } from '@/contexts/CurrencyContext';


const Index = () => {
  // Estados para os filtros
  const [filterName, setFilterName] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar se estamos filtrando apenas simulados grátis
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);

  // Processar parâmetros de URL para filtros
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const freeParam = searchParams.get('free');
    
    console.log('Parâmetros de URL:', { category: categoryParam, free: freeParam });
    
    // Aplicar filtro de categoria da URL
    if (categoryParam) {
      setFilterCategory(categoryParam.toLowerCase());
    } else {
      // Limpar filtro de categoria se não estiver na URL
      setFilterCategory('');
    }
    
    // Aplicar filtro de simulados grátis
    if (freeParam === 'true') {
      console.log('Filtro de simulados grátis ativado via URL');
      setFilterFreeOnly(true);
    } else {
      setFilterFreeOnly(false);
    }
  }, [location.search]);
  
  // Monitorar mudanças nos filtros e atualizar a URL
  useEffect(() => {
    console.log('Filtros alterados:', { categoria: filterCategory, apenasGratis: filterFreeOnly });
    
    // Atualizar URL quando os filtros mudarem
    const searchParams = new URLSearchParams(location.search);
    
    // Atualizar parâmetro de categoria
    if (filterCategory) {
      searchParams.set('category', filterCategory);
    } else {
      searchParams.delete('category');
    }
    
    // Atualizar parâmetro de simulados grátis
    if (filterFreeOnly) {
      searchParams.set('free', 'true');
    } else {
      searchParams.delete('free');
    }
    
    // Navegar para a nova URL com os parâmetros atualizados
    const newSearch = searchParams.toString();
    const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    
    // Usar replace para não adicionar entradas no histórico
    navigate(newPath, { replace: true });
  }, [filterCategory, filterFreeOnly, location.pathname, location.search, navigate]);
  

  
  // Buscar simulados do servidor
  useEffect(() => {
    // Carrega os simulados ativos do backend
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        // Importar o serviço de simulados e buscar os dados
        const { simuladoService } = await import('@/services/simuladoService');
        const activeExams = await simuladoService.getActiveSimulados();
        
        // Mapear os simulados para o formato Exam
        const processedExams = activeExams.map(simulado => {
          // Extrair idioma do título ou descrição
          const language = simulado.title.toLowerCase().includes('english') ? 'en' :
                          simulado.title.toLowerCase().includes('español') ? 'es' :
                          simulado.title.toLowerCase().includes('français') ? 'fr' : 'pt';
          
          // Extrair dificuldade da categoria ou tags
          const difficulty = simulado.tags?.includes('hard') ? 'hard' :
                            simulado.tags?.includes('medium') ? 'medium' :
                            simulado.tags?.includes('easy') ? 'easy' : 'medium';
          
          return {
            id: simulado.id,
            title: simulado.title,
            description: simulado.description,
            price: simulado.price,
            language,
            difficulty,
            duration: simulado.duration,
            questions_count: simulado.total_questions,
            category: simulado.category,
            image_url: simulado.image_url || '',
            is_gratis: simulado.price === 0,
            created_at: simulado.created_at,
            updated_at: simulado.updated_at,
            is_active: simulado.is_active,
            total_questions: simulado.total_questions,
            passing_score: simulado.passing_score,
            tags: simulado.tags || []
          };
        });
        
        console.log('Simulados carregados:', processedExams);
        setExams(processedExams);
      } catch (error) {
        console.error('Erro ao buscar simulados do banco de dados:', error);
        // Mesmo em caso de erro no processamento, não deixamos a lista vazia
        const { simuladoService } = await import('@/services/simuladoService');
        const fallbackExams = await simuladoService.getAllSimulados();
        if (fallbackExams.length > 0) {
          const processedFallbackExams = fallbackExams.map(simulado => {
            // Extrair idioma do título ou descrição
            const language = simulado.title.toLowerCase().includes('english') ? 'en' :
                            simulado.title.toLowerCase().includes('español') ? 'es' :
                            simulado.title.toLowerCase().includes('français') ? 'fr' : 'pt';
            
            // Extrair dificuldade da categoria ou tags
            const difficulty = simulado.tags?.includes('hard') ? 'hard' :
                              simulado.tags?.includes('medium') ? 'medium' :
                              simulado.tags?.includes('easy') ? 'easy' : 'medium';
            
            return {
              id: simulado.id,
              title: simulado.title,
              description: simulado.description,
              price: simulado.price,
              language,
              difficulty,
              duration: simulado.duration,
              questions_count: simulado.total_questions,
              category: simulado.category,
              image_url: simulado.image_url || '',
              is_gratis: simulado.price === 0,
              created_at: simulado.created_at,
              updated_at: simulado.updated_at,
              is_active: simulado.is_active,
              total_questions: simulado.total_questions,
              passing_score: simulado.passing_score,
              tags: simulado.tags || []
            };
          });
          console.log('Usando dados de fallback para simulados na página inicial');
          setExams(processedFallbackExams);
        } else {
          setExams([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Removing the redirect to dashboard, as this might be causing the blank page
  // This allows the index page to render properly for all users

  const handleAddToCart = (exam: Exam) => {
    addItem({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      price: exam.preco_usd || 0,
      discountPrice: undefined // Se houver desconto em dólar, ajuste aqui
    });
  };

  // Fallback de exames para demonstração quando não há exames do servidor
  const availableExams = [
    {
      id: 'aws-saa',
      title: 'AWS Solutions Architect Associate',
      description: 'Complete practice exam with detailed explanations',
      price: 29.99,
      discountPrice: 19.99,
      topics: ['EC2', 'S3', 'VPC', 'IAM', 'High Availability'],
    },
    {
      id: 'aws-developer',
      title: 'AWS Developer Associate',
      description: 'Practice exam focused on development concepts',
      price: 24.99,
      discountPrice: 17.99,
      topics: ['Lambda', 'DynamoDB', 'API Gateway', 'CloudFormation'],
    },
    {
      id: 'azure-admin',
      title: 'Azure Administrator Associate',
      description: 'Comprehensive Azure practice exam',
      price: 29.99,
      topics: ['Virtual Machines', 'Storage', 'Networking', 'Security'],
    }
  ];

  // Função para extrair tópicos da descrição do exame
  const extractTopics = (description: string): string[] => {
    // Lógica simplificada para extrair tópicos da descrição
    const topics = description.split(',').map(topic => topic.trim());
    return topics.length > 1 ? topics : ['Cloud', 'DevOps', 'Security', 'Networking'];
  };

  // Função para verificar se um exame corresponde a uma categoria
  const matchesCategory = (exam: Exam, filterCategory: string): boolean => {
    if (!filterCategory) return true;
    
    const filterTerms = filterCategory.toLowerCase().split(',').map(term => term.trim());
    
    // Verificar se algum dos termos do filtro está presente na categoria ou título
    return filterTerms.some(term => {
      const examCategory = exam.category.toLowerCase();
      const examTitle = exam.title.toLowerCase();
      
      // Mapeamento de termos relacionados para melhorar a correspondência
      const categoryMappings: Record<string, string[]> = {
        'aws': ['aws', 'amazon', 'cloud'],
        'azure': ['azure', 'microsoft', 'cloud'],
        'gcp': ['gcp', 'google', 'cloud'],
        'security': ['security', 'security+', 'security plus', 'cybersecurity'],
        'networking': ['networking', 'network+', 'network plus', 'ccna'],
        'linux': ['linux', 'lpic', 'linux+', 'linux plus'],
        'devops': ['devops', 'dev ops', 'development operations'],
        'database': ['database', 'sql', 'mysql', 'postgresql', 'oracle'],
        'cloud': ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'amazon web services'],
        'certification': ['certification', 'cert', 'certified', 'exam'],
        'practice': ['practice', 'practice exam', 'simulado', 'simulation'],
        'free': ['free', 'gratis', 'trial', 'demo'],
        'paid': ['paid', 'premium', 'pro', 'professional']
      };
      
      // Verificar correspondência direta
      if (examCategory.includes(term) || examTitle.includes(term)) {
        return true;
      }
      
      // Verificar correspondência através do mapeamento
      const relatedTerms = categoryMappings[term] || [];
      return relatedTerms.some(relatedTerm => 
        examCategory.includes(relatedTerm) || 
        examTitle.includes(relatedTerm)
      );
    });
  };

  console.log("Index component ready to render UI");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto py-10 text-center">
          <Button 
            className="bg-cert-blue hover:bg-cert-darkblue text-lg px-8 py-6 mr-4"
            onClick={() => navigate('/login')}
          >
            Comece Agora
          </Button>
          <Button 
            variant="outline"
            className="text-lg px-8 py-6 mr-4"
            onClick={() => navigate('/profile')}
          >
            Ver Perfil
          </Button>
          <Button 
            variant="outline"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/admin')}
          >
            Painel Admin
          </Button>
        </div>
        <Features />
        {/* Seção de Simulados Gratuitos */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-green-700">Simulados Gratuitos</h2>
              <p className="text-xl text-gray-600 mb-6">Acesse nossos simulados gratuitos para testar seus conhecimentos</p>
              
              {/* Menu de Categorias para Simulados Gratuitos */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true')}
                >
                  Todos Gratuitos
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true&category=aws')}
                >
                  AWS
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true&category=azure')}
                >
                  Microsoft Azure
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true&category=gcp')}
                >
                  Google Cloud
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true&category=comptia')}
                >
                  CompTIA
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-green-500 hover:bg-green-100 text-green-700 font-medium`}
                  onClick={() => navigate('/simulados?free=true&category=cisco')}
                >
                  Cisco
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p>Carregando simulados gratuitos...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams
                  .filter(exam => exam.is_gratis === true)
                  .slice(0, 12)
                  .map((exam) => {
                    const topics = Array.isArray((exam as any).topicos) && (exam as any).topicos.length > 0
                      ? (exam as any).topicos
                      : [];
                    
                    return (
                      <Card key={exam.id} className="flex flex-col border-green-200 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex justify-between mb-1">
                          <span className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm border border-indigo-200 select-none">
                            {exam.language === 'pt' && 'Português'}
                            {exam.language === 'en' && 'English'}
                            {exam.language === 'fr' && 'Français'}
                            {exam.language === 'es' && 'Español'}
                          </span>
                          <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold shadow-sm border border-green-200 ml-2 select-none">
                            Grátis
                          </span>
                        </div>
                        <CardHeader>
                          <CardTitle>{exam.title}</CardTitle>
                          <CardDescription>{exam.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="space-y-4">
                            <div className="flex flex-col gap-1 mt-2">
                              <span className="font-bold text-green-700">Acesso Gratuito</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-600 mb-2">Tópicos Abordados:</h3>
                              {topics.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {topics.map((topic, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400">Nenhum tópico informado</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6">
                          <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => navigate(`/simulados/${exam.id}`)}
                            >
                              Ver Detalhes
                            </Button>
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => navigate(`/simulados/${exam.id}`)}
                            >
                              <span className="font-bold">Acessar Grátis</span>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* Seção de Simulados Pagos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Simulados Premium</h2>
              <p className="text-xl text-gray-600 mb-6">Escolha entre nossos simulados premium para certificações</p>
              
              {/* Filtros de busca */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-stretch md:items-end justify-center mb-6">
                <div className="flex flex-col items-start w-full md:w-1/3">
                  <label htmlFor="filter-name" className="text-sm font-medium mb-1">Nome do Simulado</label>
                  <input
                    id="filter-name"
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Buscar por nome..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-start w-full md:w-1/4">
                  <label htmlFor="filter-difficulty" className="text-sm font-medium mb-1">Nível de Dificuldade</label>
                  <select
                    id="filter-difficulty"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={filterDifficulty}
                    onChange={e => setFilterDifficulty(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="easy">Fácil</option>
                    <option value="intermediate">Médio</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
                <div className="flex flex-col items-start w-full md:w-1/4">
                  <label htmlFor="filter-language" className="text-sm font-medium mb-1">Idioma</label>
                  <select
                    id="filter-language"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={filterLanguage}
                    onChange={e => setFilterLanguage(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
              
              {/* Filtros de Categoria para Simulados Premium */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === '' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-100'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em Todas Categorias');
                    setFilterCategory('');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('category');
                    const newSearch = searchParams.toString();
                    const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
                    navigate(newPath, { replace: true });
                  }}
                >
                  Todas Categorias
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === 'aws' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-300 hover:bg-orange-50'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em AWS');
                    setFilterCategory('aws');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('category', 'aws');
                    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                  }}
                >
                  AWS
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === 'azure' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-blue-50'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em Microsoft Azure');
                    setFilterCategory('azure');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('category', 'azure');
                    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                  }}
                >
                  Microsoft Azure
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === 'gcp' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-300 hover:bg-red-50'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em Google Cloud');
                    setFilterCategory('gcp');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('category', 'gcp');
                    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                  }}
                >
                  Google Cloud
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === 'comptia' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300 hover:bg-green-50'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em CompTIA');
                    setFilterCategory('comptia');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('category', 'comptia');
                    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                  }}
                >
                  CompTIA
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 ${filterCategory === 'cisco' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-indigo-50'} font-medium`}
                  onClick={() => {
                    console.log('Clicou em Cisco');
                    setFilterCategory('cisco');
                    // Forçar a atualização dos filtros
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('category', 'cisco');
                    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                  }}
                >
                  Cisco
                </Button>
              </div>
            </div> 

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p>Carregando simulados premium...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams
                  // Filtra os simulados com base nos filtros aplicados
                  .filter(exam => {
                    // Verificar se deve mostrar apenas simulados grátis ou apenas pagos
                    if (filterFreeOnly && !exam.is_gratis) return false;
                    if (!filterFreeOnly && exam.is_gratis) return false;
                    
                    // Filtro por nome
                    if (filterName !== '' && !exam.title.toLowerCase().includes(filterName.toLowerCase())) return false;
                    
                    // Filtro por dificuldade
                    if (filterDifficulty !== '' && exam.difficulty !== filterDifficulty) return false;
                    
                    // Filtro por idioma
                    if (filterLanguage !== '' && exam.language !== filterLanguage) return false;
                    
                    // Filtro por categoria
                    if (filterCategory !== '' && !matchesCategory(exam, filterCategory)) return false;
                    
                    return true;
                  })
                  .slice(0, 12)
                  .map((exam) => {
                  // Para exames do servidor
                  // Priorizar exam.topicos do backend, senão fallback
                   const topics = Array.isArray((exam as any).topicos) && (exam as any).topicos.length > 0
                     ? (exam as any).topicos
                     : [];
                  
                  return (
                    <Card key={exam.id} className="flex flex-col">
  {/* Badges de idioma, categoria e grátis */}
  <div className="flex flex-wrap justify-between mb-1">
    <div className="flex flex-wrap gap-1">
      <span className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm border border-indigo-200 select-none">
        {exam.language === 'pt' && 'Português'}
        {exam.language === 'en' && 'English'}
        {exam.language === 'fr' && 'Français'}
        {exam.language === 'es' && 'Español'}
      </span>
      
      {/* Badge de categoria */}
      {exam.category && (
        <span className={`bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm border border-blue-200 select-none
          ${exam.category?.toLowerCase() === 'aws' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
          ${exam.category?.toLowerCase() === 'azure' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
          ${exam.category?.toLowerCase() === 'gcp' ? 'bg-red-100 text-red-700 border-red-200' : ''}
          ${exam.category?.toLowerCase() === 'comptia' ? 'bg-green-100 text-green-700 border-green-200' : ''}
          ${exam.category?.toLowerCase() === 'cisco' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
          ${!['aws', 'azure', 'gcp', 'comptia', 'cisco'].includes(exam.category?.toLowerCase() || '') ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
        `}>
          {exam.category?.toLowerCase() === 'aws' ? 'AWS' : ''}
          {exam.category?.toLowerCase() === 'azure' ? 'Microsoft Azure' : ''}
          {exam.category?.toLowerCase() === 'gcp' ? 'Google Cloud' : ''}
          {exam.category?.toLowerCase() === 'comptia' ? 'CompTIA' : ''}
          {exam.category?.toLowerCase() === 'cisco' ? 'Cisco' : ''}
          {!['aws', 'azure', 'gcp', 'comptia', 'cisco'].includes(exam.category?.toLowerCase() || '') ? exam.category || 'Geral' : ''}
        </span>
      )}
    </div>
    
    {exam.is_gratis && (
      <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold shadow-sm border border-green-200 select-none">
        Grátis
      </span>
    )}
  </div>
                      <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
  <div className="space-y-4">
    <div className="flex flex-col gap-1 mt-2">
      {exam.is_gratis ? (
        <span className="font-bold text-green-700">Acesso Gratuito</span>
      ) : (
        ((typeof exam.price === 'number' && exam.price > 0) || (typeof exam.discountPrice === 'number' && exam.discountPrice > 0) || (typeof exam.preco_usd === 'number' && exam.preco_usd > 0) || (typeof exam.preco_eur === 'number' && exam.preco_eur > 0)) ? (
          <>
            {typeof exam.price === 'number' && exam.price > 0 && (
              <span className="font-semibold text-cert-blue">Preço BRL: R$ {exam.price.toFixed(2).replace('.', ',')}</span>
            )}
            {typeof exam.discountPrice === 'number' && exam.discountPrice > 0 && (
              <span className="font-semibold text-green-700">Preço Promocional: R$ {exam.discountPrice.toFixed(2).replace('.', ',')}</span>
            )}
            {typeof exam.preco_usd === 'number' && exam.preco_usd > 0 && (
              <span className="font-semibold text-blue-600">Preço USD: $ {exam.preco_usd.toFixed(2)}</span>
            )}
            {typeof exam.preco_eur === 'number' && exam.preco_eur > 0 && (
              <span className="font-semibold text-green-700">Preço EUR: € {exam.preco_eur.toFixed(2)}</span>
            )}
          </>
        ) : (
          <span className="text-gray-400">Preço não informado</span>
        )
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Tópicos Abordados:</h3>
      {topics.length > 0 ? (
        <ul className="text-sm text-gray-600 space-y-1">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              {topic}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-gray-400">Nenhum tópico informado</span>
      )}
    </div>
  </div>
</CardContent>
                      <CardFooter className="border-t pt-6">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(`/simulados/${exam.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                          {exam.is_gratis ? (
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => navigate(`/simulados/${exam.id}`)}
                            >
                              <span className="font-bold">Acessar Grátis</span>
                            </Button>
                          ) : (
                            <Button
                              className="flex-1 bg-cert-blue hover:bg-cert-blue/90"
                              onClick={() => handleAddToCart(exam as Exam)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Adicionar ao Carrinho
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Seção de Pacotes de Simulados */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-purple-700">Pacotes de Simulados</h2>
              <p className="text-xl text-gray-600 mb-6">Economize 25% comprando simulados em pacotes</p>
              
              {/* Menu de Categorias para Pacotes */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes')}
                >
                  Todos os Pacotes
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes?category=aws')}
                >
                  AWS
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes?category=azure')}
                >
                  Microsoft Azure
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes?category=gcp')}
                >
                  Google Cloud
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes?category=comptia')}
                >
                  CompTIA
                </Button>
                <Button 
                  variant="outline" 
                  className={`rounded-full px-6 py-2 border-purple-500 hover:bg-purple-100 text-purple-700 font-medium`}
                  onClick={() => navigate('/pacotes?category=cisco')}
                >
                  Cisco
                </Button>
              </div>
            </div>
            
            {/* Exibir pacotes em destaque (limitado a 3) */}
            <div className="mt-8">
              <PacotesList maxItems={3} showTitle={false} />
              
              <div className="text-center mt-8">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
                  onClick={() => navigate('/pacotes')}
                >
                  Ver Todos os Pacotes
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
