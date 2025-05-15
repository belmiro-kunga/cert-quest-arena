import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Certifications from '@/components/Certifications';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';
// import { Exam } from '@/types/admin'; // Substituído por definição local temporária
// TODO: Substitua por fetch real dos exames ou dados mockados válidos
// Definição temporária de Exam com discountPrice
export type ExamLanguage = 'pt' | 'en' | 'fr' | 'es';
export type Exam = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  preco_usd?: number;
  preco_eur?: number;
  language: string; // Corrigido para aceitar string
  difficulty: string;
  duration: number;
  questions_count: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};
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
    created_at: '',
    updated_at: ''
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
    created_at: '',
    updated_at: ''
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
    created_at: '',
    updated_at: ''
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
    created_at: '',
    updated_at: ''
  }
];
import { useCurrency } from '@/contexts/CurrencyContext';


const Index = () => {
  // Filtros de busca
  const [filterName, setFilterName] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  
  // Buscar simulados do servidor
  useEffect(() => {
    // Carrega os simulados ativos do backend
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const activeExams = await import('@/services/simuladoService').then(mod => mod.getActiveExams());
        setExams(activeExams);
      } catch (error) {
        console.error('Erro ao buscar simulados do banco de dados:', error);
        setExams([]);
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
            <div className="text-center mb-12">
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
            </div> 

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p>Carregando simulados premium...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams
                  // Exibe apenas simulados pagos (não gratuitos)
                  .filter(exam =>
                    exam.is_gratis !== true &&
                    (filterName === '' || exam.title.toLowerCase().includes(filterName.toLowerCase())) &&
                    (filterDifficulty === '' || exam.difficulty === filterDifficulty) &&
                    (filterLanguage === '' || exam.language === filterLanguage || filterLanguage === '')
                  )
                  .map((exam) => {
                  // Para exames do servidor
                  // Priorizar exam.topicos do backend, senão fallback
                   const topics = Array.isArray((exam as any).topicos) && (exam as any).topicos.length > 0
                     ? (exam as any).topicos
                     : [];
                  
                  return (
                    <Card key={exam.id} className="flex flex-col">
  {/* Badge de idioma e badge grátis */}
  <div className="flex justify-between mb-1">
    <span className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm border border-indigo-200 select-none">
      {exam.language === 'pt' && 'Português'}
      {exam.language === 'en' && 'English'}
      {exam.language === 'fr' && 'Français'}
      {exam.language === 'es' && 'Español'}
    </span>
    {exam.is_gratis && (
      <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold shadow-sm border border-green-200 ml-2 select-none">
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
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
