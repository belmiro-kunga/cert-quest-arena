
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
import { fetchExams } from '@/services/examService';
import { Exam } from '@/types/admin';

const Index = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Buscar simulados do servidor
  useEffect(() => {
    const getExams = async () => {
      try {
        const examData = await fetchExams();
        setExams(examData);
      } catch (error) {
        console.error('Erro ao buscar simulados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getExams();
  }, []);
  
  // Redirecionar para o dashboard se estiver logado
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAddToCart = (exam: Exam) => {
    addItem({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      price: exam.price,
      discountPrice: exam.discountPrice || undefined
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

  // Exames a serem exibidos (do servidor ou fallback)
  const examToDisplay = exams.length > 0 ? exams : availableExams;
  
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
        <Certifications />
        
        {/* Seção de Exames Disponíveis */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simulados Disponíveis</h2>
              <p className="text-xl text-gray-600">Escolha entre nossos simulados para certificações</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p>Carregando simulados...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examToDisplay.map((exam) => {
                  // Para exames do servidor
                  const isServerExam = 'questionsCount' in exam;
                  const topics = isServerExam 
                    ? extractTopics(exam.description)
                    : (exam as any).topics || ['Cloud', 'DevOps', 'Security'];
                  
                  return (
                    <Card key={exam.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            {exam.discountPrice ? (
                              <div className="space-y-1">
                                <div className="text-3xl font-bold text-cert-blue">
                                  R${exam.discountPrice.toFixed(2).replace('.', ',')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg text-gray-500 line-through">
                                    R${exam.price.toFixed(2).replace('.', ',')}
                                  </span>
                                  <span className="text-sm text-green-600">
                                    Economize R${(exam.price - (exam.discountPrice || 0)).toFixed(2).replace('.', ',')}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-3xl font-bold text-cert-blue">
                                R${exam.price.toFixed(2).replace('.', ',')}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Tópicos Abordados:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {topics.map((topic, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {isServerExam && (
                            <div className="pt-2">
                              <div className="flex justify-between text-sm">
                                <span>Questões: {(exam as Exam).questionsCount}</span>
                                <span>Duração: {(exam as Exam).duration} min</span>
                              </div>
                              <div className="mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (exam as Exam).difficulty === 'Fácil'
                                    ? 'bg-green-100 text-green-700'
                                    : (exam as Exam).difficulty === 'Médio'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {(exam as Exam).difficulty}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-6">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(`/exams/${exam.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            className="flex-1 bg-cert-blue hover:bg-cert-blue/90"
                            onClick={() => handleAddToCart(exam as Exam)}
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
