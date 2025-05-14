import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActiveExams } from '@/services/simuladoService';
import { getSimuladoById, Exam } from '@/services/simuladoService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, ArrowLeft, Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SimuladoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
const [availableLevels, setAvailableLevels] = useState<string[]>([]);

  useEffect(() => {
    const loadSimulado = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        console.log(`Carregando detalhes do simulado ${id}...`);
        const data = await getSimuladoById(parseInt(id));
        console.log('Dados do simulado recebidos:', data);
        console.log('Número de questões:', data.questionsCount);
        
        // Garantir que o número de questões seja exibido corretamente
        if (data.questionsCount === 0 && typeof data.questionsCount === 'number') {
          console.log('Corrigindo número de questões para valor real...');
          // Se o número de questões for 0, verificar se há um valor real
          if (data.questionsCount !== undefined) {
            console.log('Usando o valor recebido da API:', data.questionsCount);
          }
        }
        
        setSimulado(data);
        // Descobrir níveis disponíveis para este título
        if (data && data.title) {
          // Buscar todos os simulados ativos e filtrar por título
          const allExams = await getActiveExams();
          const levels = allExams.filter((s) => s.title === data.title).map((s) => s.difficulty);
          setAvailableLevels(Array.from(new Set(levels)));
        }
      } catch (error) {
        console.error(`Erro ao carregar simulado ${id}:`, error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do simulado.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSimulado();
  }, [id, toast]);

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

  const handleStartSimulado = () => {
    // Verificar se o simulado tem questões
    if (simulado?.questionsCount === 0) {
      toast({
        title: 'Simulado sem questões',
        description: 'Este simulado não possui questões ainda.',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedLevel) {
      toast({
        title: 'Selecione o nível',
        description: 'Escolha o nível de dificuldade antes de iniciar.',
        variant: 'destructive',
      });
      return;
    }
    // Verificar se o nível está disponível para este simulado
    if (!availableLevels.includes(selectedLevel)) {
      toast({
        title: 'Nível indisponível',
        description: `Não existe o nível ${selectedLevel} para este simulado.`,
        variant: 'destructive',
      });
      return;
    }
    // Notificar o usuário
    toast({
      title: 'Simulado iniciado',
      description: `Nível escolhido: ${selectedLevel}`,
    });
    // Navegar para a página do simulado em andamento, passando o nível como query param
    navigate(`/simulados/${id}/start?nivel=${encodeURIComponent(selectedLevel)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center" 
          onClick={() => navigate('/simulados')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Simulados
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !simulado ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Simulado não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O simulado que você está procurando não existe ou não está disponível.
            </p>
            <Button onClick={() => navigate('/simulados')}>
              Ver outros simulados
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <CardTitle className="text-2xl">{simulado.title}</CardTitle>
                    {renderDifficultyBadge(simulado.difficulty)}
                  </div>
                  <CardDescription className="text-base">
                    {simulado.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Array.isArray(simulado.topicos) && simulado.topicos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tópicos Abordados</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {simulado.topicos.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{simulado.duration} minutos</p>
                          <p className="text-sm text-muted-foreground">Duração</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{simulado.questionsCount} questões</p>
                          <p className="text-sm text-muted-foreground">Total</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{simulado.passingScore}%</p>
                          <p className="text-sm text-muted-foreground">Nota mínima</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Sobre este simulado</h3>
                      <p className="text-muted-foreground">
                        Este simulado foi projetado para testar seus conhecimentos e prepará-lo para o exame real.
                        Responda todas as questões dentro do tempo limite para obter sua pontuação.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Instruções</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Você terá {simulado.duration} minutos para completar o simulado.</li>
                        <li>O simulado contém {simulado.questionsCount} questões de múltipla escolha.</li>
                        <li>Você precisa acertar pelo menos {simulado.passingScore}% das questões para ser aprovado.</li>
                        <li>Você pode revisar suas respostas antes de enviar.</li>
                        <li>Uma vez iniciado, o tempo não pode ser pausado.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Simulado</CardTitle>
                  <CardDescription>
                    Prepare-se para começar o simulado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">
                      Certifique-se de que você tem tempo suficiente para completar o simulado sem interrupções.
                    </p>
                  </div>
                  {/* Seleção de nível */}
                  <div className="space-y-2">
                    <label className="block font-medium mb-1">Escolha o nível de dificuldade:</label>
                    <div className="flex gap-2 flex-wrap">
                    {['Fácil', 'Médio', 'Difícil', 'Avançado'].map((nivel) => (
                      <Button
                        key={nivel}
                        type="button"
                        variant={selectedLevel === nivel ? 'default' : 'outline'}
                        className={selectedLevel === nivel ? 'bg-cert-blue text-white' : ''}
                        onClick={() => setSelectedLevel(nivel)}
                        disabled={availableLevels.length > 0 && !availableLevels.includes(nivel)}
                      >
                        {nivel}
                      </Button>
                    ))}
                  </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duração:</span>
                      <span className="font-medium">{simulado.duration} minutos</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Questões:</span>
                      <span className="font-medium">{simulado.questionsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Nota para aprovação:</span>
                      <span className="font-medium">{simulado.passingScore}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleStartSimulado}
                    disabled={simulado.questionsCount === 0}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Simulado
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SimuladoDetailPage;
