import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSimuladoById, Exam } from '@/services/simuladoService';
import { getQuestoesBySimuladoId, Questao } from '@/services/questaoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SimuladoRunningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Exam | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  // Carregar simulado e questões
  useEffect(() => {
    const loadSimuladoAndQuestoes = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Carregar simulado
        const simuladoData = await getSimuladoById(parseInt(id));
        setSimulado(simuladoData);
        
        // Inicializar o tempo restante
        setTimeLeft(simuladoData.duration * 60); // Converter minutos para segundos
        
        // Carregar questões
        const questoesData = await getQuestoesBySimuladoId(parseInt(id));
        setQuestoes(questoesData);
        
        if (questoesData.length === 0) {
          toast({
            title: 'Aviso',
            description: 'Este simulado não possui questões.',
            variant: 'destructive',
          });
          navigate(`/simulados/${id}`);
        }
      } catch (error) {
        console.error(`Erro ao carregar simulado ${id}:`, error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o simulado.',
          variant: 'destructive',
        });
        navigate('/simulados');
      } finally {
        setIsLoading(false);
      }
    };

    loadSimuladoAndQuestoes();
  }, [id, navigate, toast]);

  // Timer para contagem regressiva
  useEffect(() => {
    if (!simulado || isLoading || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishSimulado();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [simulado, isLoading, isFinished]);

  // Formatar tempo restante
  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calcular progresso
  const calculateProgress = () => {
    if (!questoes.length) return 0;
    return (Object.keys(selectedAnswers).length / questoes.length) * 100;
  };

  // Manipular seleção de resposta
  const handleAnswerSelect = (questionId: number, alternativaId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: alternativaId
    }));
  };

  // Navegar para a próxima questão
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questoes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navegar para a questão anterior
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Finalizar simulado
  const handleFinishSimulado = () => {
    setIsFinished(true);
    
    // Calcular resultado
    const totalQuestions = questoes.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    
    // Calcular tempo gasto (em segundos)
    const timeSpent = simulado ? simulado.duration * 60 - timeLeft : 0;
    
    // Verificar respostas corretas
    let correctAnswers = 0;
    const correctAnswersMap: Record<number, boolean> = {};
    
    questoes.forEach(questao => {
      // Verificar se a questão foi respondida
      if (selectedAnswers[questao.id]) {
        // Verificar se a resposta do usuário corresponde à resposta correta
        if (questao.resposta_correta && selectedAnswers[questao.id] === questao.resposta_correta) {
          correctAnswers++;
          correctAnswersMap[questao.id] = true;
        } else {
          correctAnswersMap[questao.id] = false;
        }
      }
    });
    
    // Calcular pontuação
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Verificar se passou no simulado
    const passedExam = score >= (simulado?.passingScore || 70);
    
    // Criar objeto de resultado
    const result = {
      simuladoId: id,
      answers: selectedAnswers,
      correctAnswers,
      totalQuestions,
      score,
      timeSpent,
      passedExam,
      completedAt: new Date().toISOString()
    };
    
    // Armazenar resultado no localStorage
    localStorage.setItem(`simulado_result_${id}`, JSON.stringify(result));
    
    toast({
      title: 'Simulado finalizado',
      description: `Você respondeu ${answeredQuestions} de ${totalQuestions} questões.`,
    });
    
    // Redirecionar para a página de resultados
    navigate(`/simulados/${id}/resultado`);
  };

  // Renderizar questão atual
  const renderCurrentQuestion = () => {
    if (!questoes.length || currentQuestionIndex >= questoes.length) {
      return (
        <div className="text-center py-8">
          <p>Nenhuma questão disponível</p>
        </div>
      );
    }

    const currentQuestion = questoes[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Questão {currentQuestionIndex + 1} de {questoes.length}</CardTitle>
            <Badge variant="outline" className="px-2 py-1">
              <Clock className="mr-1 h-4 w-4" /> {formatTimeLeft()}
            </Badge>
          </div>
          <CardDescription className="text-base">
            {currentQuestion.enunciado}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.alternativas && currentQuestion.alternativas.map((alternativa) => (
              <div key={alternativa.id} className="flex items-start space-x-2 py-2">
                <RadioGroupItem value={alternativa.id} id={`alternativa-${alternativa.id}`} />
                <Label 
                  htmlFor={`alternativa-${alternativa.id}`}
                  className="cursor-pointer flex-1"
                >
                  {alternativa.texto}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          {currentQuestionIndex < questoes.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinishSimulado} className="bg-green-600 hover:bg-green-700">
              Finalizar
              <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{simulado?.title}</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Tempo restante: {formatTimeLeft()}</span>
                </div>
                <div>
                  <span>Questões respondidas: {Object.keys(selectedAnswers).length} de {questoes.length}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {timeLeft < 300 && timeLeft > 0 && (
              <Alert variant="destructive" className="mb-6">
                <Clock className="h-4 w-4" />
                <AlertTitle>Tempo acabando!</AlertTitle>
                <AlertDescription>
                  Você tem menos de 5 minutos para concluir o simulado.
                </AlertDescription>
              </Alert>
            )}

            {renderCurrentQuestion()}
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleFinishSimulado}
              >
                Finalizar simulado
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SimuladoRunningPage;
