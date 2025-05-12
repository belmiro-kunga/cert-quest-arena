import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Award, ArrowRight } from 'lucide-react';
import { getActiveExams, Exam } from '@/services/simuladoService';
import { useToast } from '@/components/ui/use-toast';

const SimuladosList: React.FC = () => {
  const [simulados, setSimulados] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSimulados = async () => {
      try {
        console.log('Carregando simulados ativos...');
        setIsLoading(true);
        const data = await getActiveExams();
        console.log('Simulados ativos recebidos:', data);
        setSimulados(data);
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
  }, [toast]);

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Simulados Disponíveis</h1>
        <p className="text-muted-foreground">
          Prepare-se para suas certificações com nossos simulados de alta qualidade
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : simulados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            Nenhum simulado disponível no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulados.map((simulado) => (
            <Card key={simulado.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{simulado.title}</CardTitle>
                  {renderDifficultyBadge(simulado.difficulty)}
                </div>
                <CardDescription className="line-clamp-2">
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
                    <span>{simulado.questionsCount} questões</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Nota mínima: {simulado.passingScore}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild className="w-full">
                  <Link to={`/simulados/${simulado.id}`}>
                    Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimuladosList;
