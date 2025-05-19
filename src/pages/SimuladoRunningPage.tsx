import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { simuladoService } from '@/services/simuladoService';
import type { Simulado, SimuladoWithQuestions, SimuladoBase } from '@/types/simuladoService';
import type { Questao } from '@/types/simulado';
// TODO: Replace with Supabase implementation
// import { getQuestoesBySimuladoId } from '@/services/questaoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, ArrowRight, Check, CircleAlert, Keyboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SimuladoRunningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Carregar simulado e questões
  useEffect(() => {
    const loadSimuladoAndQuestoes = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Carregar simulado
        const simuladoData = await simuladoService.getSimuladoById(id);
        if (!simuladoData) {
          throw new Error('Simulado não encontrado');
        }

        // Convert SimuladoWithQuestions to Simulado
        const baseData: SimuladoBase = {
          id: simuladoData.id,
          title: simuladoData.title,
          description: simuladoData.description,
          duration: simuladoData.duration,
          total_questions: simuladoData.total_questions,
          passing_score: simuladoData.passing_score,
          is_active: simuladoData.is_active,
          created_at: simuladoData.created_at,
          updated_at: simuladoData.updated_at,
          price: simuladoData.price,
          category: simuladoData.category,
          tags: simuladoData.tags || [],
          image_url: simuladoData.image_url
        };

        const simuladoConverted: Simulado = {
          ...baseData,
          questions_count: simuladoData.questions?.length || 0,
          language: 'pt', // Default language
          difficulty: 'medium' // Default difficulty
        };
        setSimulado(simuladoConverted);
        
        // Inicializar o tempo restante
        setTimeLeft(simuladoData.duration * 60); // Converter minutos para segundos
        
        // Convert questions to Questao type
        const questoesData: Questao[] = (simuladoData.questions || []).map(q => ({
          id: parseInt(q.id),
          simulado_id: parseInt(q.simulado_id),
          enunciado: q.question_text,
          alternativas: q.options.map((opt, idx) => ({
            id: `opt_${idx}`,
            texto: opt,
            correta: opt === q.correct_answer
          })),
          resposta_correta: q.correct_answer,
          explicacao: q.explanation,
          tipo: 'single_choice' // Default type
        }));
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

  // Lidar com atalhos de teclado
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isLoading || isFinished) return;

    const currentQuestion = questoes[currentQuestionIndex];
    if (!currentQuestion) return;

    // Atalhos para navegação
    if (event.key === 'ArrowLeft' || event.key === 'p' || event.key === 'P') {
      // Navegar para a questão anterior
      if (currentQuestionIndex > 0) {
        handlePreviousQuestion();
      }
    } else if (event.key === 'ArrowRight' || event.key === 'n' || event.key === 'N') {
      // Navegar para a próxima questão
      if (currentQuestionIndex < questoes.length - 1) {
        handleNextQuestion();
      }
    } else if (event.key === 'Enter' && event.ctrlKey) {
      // Finalizar simulado com Ctrl+Enter
      handleFinishSimulado();
    } else if (event.key === 'h' || event.key === 'H') {
      // Mostrar/esconder atalhos de teclado
      setShowKeyboardShortcuts(prev => !prev);
    } else if (event.key >= '1' && event.key <= '9') {
      // Selecionar alternativa pelo número
      const numKey = parseInt(event.key);
      const alternativas = currentQuestion.alternativas;
      
      if (numKey <= alternativas.length) {
        const alternativaId = alternativas[numKey - 1].id;
        
        if (currentQuestion.tipo === 'multiple_choice') {
          handleMultipleAnswerSelect(currentQuestion.id, alternativaId);
        } else {
          handleSingleAnswerSelect(currentQuestion.id, alternativaId);
        }
      }
    }
  }, [currentQuestionIndex, questoes, isLoading, isFinished]);

  // Configurar listener de teclado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Manipular seleção de resposta para escolha única
  const handleSingleAnswerSelect = (questionId: number, alternativaId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: alternativaId
    }));
  };

  // Manipular seleção de resposta para múltipla escolha
  const handleMultipleAnswerSelect = (questionId: number, alternativaId: string) => {
    setSelectedAnswers(prev => {
      // Se ainda não existe resposta para essa questão, iniciar com um array contendo essa alternativa
      if (!prev[questionId]) {
        return {
          ...prev,
          [questionId]: [alternativaId]
        };
      }
      
      // Se já existe resposta e é um array
      if (Array.isArray(prev[questionId])) {
        const currentAnswers = prev[questionId] as string[];
        
        // Se alternativa já está marcada, desmarcar
        if (currentAnswers.includes(alternativaId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(id => id !== alternativaId)
          };
        }
        
        // Adicionar nova alternativa
        return {
          ...prev,
          [questionId]: [...currentAnswers, alternativaId]
        };
      }
      
      // Caso anômalo (deveria ser array mas não é)
      return {
        ...prev,
        [questionId]: [alternativaId]
      };
    });
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
        // Para questões de múltipla escolha
        if (questao.tipo === 'multiple_choice') {
          const userAnswers = Array.isArray(selectedAnswers[questao.id]) 
            ? selectedAnswers[questao.id] as string[]
            : [selectedAnswers[questao.id] as string];
            
          const correctOptions = Array.isArray(questao.resposta_correta) 
            ? questao.resposta_correta 
            : questao.resposta_correta.split(',');
            
          // Verificar se todas as respostas estão corretas
          const isCorrect = 
            // Tem a mesma quantidade de respostas
            userAnswers.length === correctOptions.length &&
            // Todas as respostas corretas estão nas respostas do usuário
            correctOptions.every(opt => userAnswers.includes(opt));
            
          if (isCorrect) {
            correctAnswers++;
            correctAnswersMap[questao.id] = true;
          } else {
            correctAnswersMap[questao.id] = false;
          }
        } 
        // Para questões de escolha única
        else {
          if (questao.resposta_correta && selectedAnswers[questao.id] === questao.resposta_correta) {
            correctAnswers++;
            correctAnswersMap[questao.id] = true;
          } else {
            correctAnswersMap[questao.id] = false;
          }
        }
      }
    });
    
    // Calcular pontuação
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Verificar se passou no simulado
    const passedExam = score >= (simulado?.passing_score || 70);
    
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
    const isMultipleChoice = currentQuestion.tipo === 'multiple_choice';
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2" id={`questao-${currentQuestion.id}-titulo`}>
              Questão {currentQuestionIndex + 1} de {questoes.length}
              {currentQuestion.url_referencia ? (
                <a
                  href={currentQuestion.url_referencia.startsWith('http') ? currentQuestion.url_referencia : `https://${currentQuestion.url_referencia}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver referência da questão"
                  className="ml-1 hover:text-blue-600 transition-colors cursor-pointer"
                  tabIndex={0}
                  role="link"
                  aria-label="Abrir referência da questão em nova aba"
                  style={{ pointerEvents: 'auto' }}
                >
                  <CircleAlert className="w-5 h-5 text-blue-500 hover:text-blue-700" aria-hidden="true" />
                </a>
              ) : (
                <span title="Nenhuma referência disponível">
                  <CircleAlert className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="sr-only">Nenhuma referência disponível</span>
                </span>
              )}
            </CardTitle>
            <Badge variant="outline" className="px-2 py-1">
              <Clock className="mr-1 h-4 w-4" aria-hidden="true" /> {formatTimeLeft()}
            </Badge>
          </div>
          <CardDescription className="text-base mt-2" id={`questao-${currentQuestion.id}-enunciado`}>
            {currentQuestion.enunciado}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMultipleChoice ? (
            // Renderização de múltipla escolha com checkboxes
            <div 
              className="space-y-2"
              role="group"
              aria-labelledby={`questao-${currentQuestion.id}-titulo questao-${currentQuestion.id}-enunciado`}
              aria-describedby={`questao-${currentQuestion.id}-instrucao`}
            >
              <p id={`questao-${currentQuestion.id}-instrucao`} className="sr-only">
                Esta é uma questão de múltipla escolha. Você pode selecionar mais de uma alternativa.
              </p>
              
              {currentQuestion.alternativas && currentQuestion.alternativas.map((alternativa, index) => {
                const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(alternativa.id);
                const checkboxId = `checkbox-${alternativa.id}`;
                
                return (
                  <div 
                    key={alternativa.id} 
                    className="flex items-start space-x-2 py-2 border border-gray-200 rounded-md p-2 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={isSelected}
                      onCheckedChange={() => handleMultipleAnswerSelect(currentQuestion.id, alternativa.id)}
                      aria-labelledby={`label-${alternativa.id}`}
                      aria-checked={isSelected}
                    />
                    <Label 
                      htmlFor={checkboxId}
                      className="cursor-pointer flex-1"
                      id={`label-${alternativa.id}`}
                    >
                      <span className="sr-only">Alternativa {index + 1}:</span>
                      {alternativa.texto}
                    </Label>
                    <span className="sr-only">
                      {isSelected ? 'Selecionada' : 'Não selecionada'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            // Renderização de escolha única com radio buttons
            <RadioGroup 
              value={typeof selectedAnswer === 'string' ? selectedAnswer : ''} 
              onValueChange={(value) => handleSingleAnswerSelect(currentQuestion.id, value)}
              aria-labelledby={`questao-${currentQuestion.id}-titulo questao-${currentQuestion.id}-enunciado`}
            >
              {currentQuestion.alternativas && currentQuestion.alternativas.map((alternativa, index) => {
                const radioId = `alternativa-${alternativa.id}`;
                const isSelected = typeof selectedAnswer === 'string' && selectedAnswer === alternativa.id;
                
                return (
                  <div 
                    key={alternativa.id} 
                    className="flex items-start space-x-2 py-2 border border-gray-200 rounded-md p-2 hover:bg-gray-50"
                  >
                    <RadioGroupItem 
                      value={alternativa.id} 
                      id={radioId} 
                      aria-labelledby={`label-${alternativa.id}`}
                    />
                    <Label 
                      htmlFor={radioId}
                      className="cursor-pointer flex-1"
                      id={`label-${alternativa.id}`}
                    >
                      <span className="sr-only">Alternativa {index + 1}:</span>
                      {alternativa.texto}
                    </Label>
                    <span className="sr-only">
                      {isSelected ? 'Selecionada' : 'Não selecionada'}
                    </span>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            aria-label="Ir para questão anterior"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Anterior
          </Button>
          
          {currentQuestionIndex < questoes.length - 1 ? (
            <Button 
              onClick={handleNextQuestion}
              aria-label="Ir para próxima questão"
            >
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinishSimulado} 
              className="bg-green-600 hover:bg-green-700"
              aria-label="Finalizar simulado e ver resultados"
            >
              Finalizar
              <Check className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
  <Header />
  <main className="flex-grow flex items-center justify-center py-10 px-2">
    {isLoading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl rounded-3xl border-blue-100 bg-white/90">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-3xl font-extrabold text-cert-blue drop-shadow mb-2">
                {simulado?.title}
              </CardTitle>
              <Badge className={`px-3 py-2 text-base font-bold rounded-lg ${timeLeft < 300 && timeLeft > 0 ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' : 'bg-blue-100 text-blue-800 border-blue-300'}`}>
                <Clock className="inline mr-1 h-5 w-5 align-middle" /> {formatTimeLeft()}
              </Badge>
            </div>
            <CardDescription className="text-lg text-gray-700 mt-2">
              {simulado?.description}
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">{questoes.length} questões</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">Duração: {simulado?.duration} min</span>
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium border border-yellow-100">Nível: {new URLSearchParams(window.location.search).get('nivel') || 'N/A'}</span>
              
              {/* Botão de atalhos de teclado */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200"
                      onClick={() => setShowKeyboardShortcuts(prev => !prev)}
                    >
                      <Keyboard className="h-4 w-4 mr-1" />
                      Atalhos
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mostrar atalhos de teclado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={calculateProgress()} className="h-3 rounded-full bg-blue-100 [&>div]:bg-cert-blue transition-all duration-300" />
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>Respondidas: {Object.keys(selectedAnswers).length}</span>
                <span>Total: {questoes.length}</span>
              </div>
            </div>
            
            {/* Informações de atalhos de teclado */}
            {showKeyboardShortcuts && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Keyboard className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 flex items-center">Atalhos de teclado</AlertTitle>
                <AlertDescription className="text-blue-700 grid grid-cols-2 gap-2 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 font-mono text-xs">1-9</kbd>
                    <span>Selecionar opção</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 font-mono text-xs">→</kbd>
                    <span>Próxima questão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 font-mono text-xs">←</kbd>
                    <span>Questão anterior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 font-mono text-xs">Ctrl+Enter</kbd>
                    <span>Finalizar simulado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 font-mono text-xs">H</kbd>
                    <span>Ocultar este painel</span>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {timeLeft < 300 && timeLeft > 0 && (
              <Alert variant="destructive" className="mb-6">
                <Clock className="h-4 w-4" />
                <AlertTitle>Tempo acabando!</AlertTitle>
                <AlertDescription>
                  Você tem menos de 5 minutos para concluir o simulado.
                </AlertDescription>
              </Alert>
            )}
            {questoes.length > 0 && renderCurrentQuestion()}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50 transition-colors text-base px-6 py-2 rounded-lg"
              onClick={handleFinishSimulado}
            >
              Finalizar simulado
            </Button>
            <div className="flex-1"></div>
          </CardFooter>
        </Card>
      </div>
    )}
  </main>
  <Footer />
</div>
  );
};

export default SimuladoRunningPage;
