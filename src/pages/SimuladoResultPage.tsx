import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSimuladoById, Exam } from '@/services/simuladoService';
import { getQuestoesBySimuladoId, Questao } from '@/services/questaoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SimuladoResult {
  simuladoId: string;
  answers: Record<number, string>;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passedExam: boolean;
  completedAt: string;
}

const SimuladoResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Exam | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResultAndData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Carregar resultado do simulado do localStorage
        const storedResult = localStorage.getItem(`simulado_result_${id}`);
        if (!storedResult) {
          toast({
            title: 'Erro',
            description: 'Resultado do simulado não encontrado.',
            variant: 'destructive',
          });
          navigate(`/simulados/${id}`);
          return;
        }
        
        const resultData = JSON.parse(storedResult) as SimuladoResult;
        setResult(resultData);
        
        // Carregar dados do simulado
        const simuladoData = await getSimuladoById(parseInt(id));
        setSimulado(simuladoData);
        
        // Carregar questões do simulado
        const questoesData = await getQuestoesBySimuladoId(parseInt(id));
        setQuestoes(questoesData);
      } catch (error) {
        console.error(`Erro ao carregar resultado do simulado ${id}:`, error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do resultado.',
          variant: 'destructive',
        });
        navigate('/simulados');
      } finally {
        setIsLoading(false);
      }
    };

    loadResultAndData();
  }, [id, navigate, toast]);

  // Formatar tempo gasto
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Tentar novamente
  const handleTryAgain = () => {
    navigate(`/simulados/${id}/start`);
  };

  // Voltar para a página de detalhes do simulado
  const handleBackToSimulado = () => {
    navigate(`/simulados/${id}`);
  };

  // Verificar se uma resposta está correta
  const isAnswerCorrect = (questao: Questao, selectedAnswerId: string) => {
    if (!result || !selectedAnswerId) return false;
    
    // Verificar se a resposta selecionada é a resposta correta da questão
    return questao.resposta_correta === selectedAnswerId;
  };

  if (isLoading || !simulado || !result) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Resultado do Simulado</h1>
                <p className="text-gray-600">
                  {simulado.title}
                </p>
              </div>
              
              {/* Gráfico circular de pontuação */}
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-bold">{result.score.toFixed(1)}%</span>
                      <p className="text-sm text-gray-500">Pontuação</p>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={result.passedExam ? "#10b981" : "#f59e0b"} 
                      strokeWidth="8" 
                      strokeDasharray="282.7"
                      strokeDashoffset={282.7 - (282.7 * result.score / 100)}
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                </div>
              </div>
              
              {/* Estatísticas resumidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-bold text-2xl text-blue-600">{result.totalQuestions}</div>
                  <div className="text-gray-500">Total de Questões</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-bold text-2xl text-green-500">{result.correctAnswers}</div>
                  <div className="text-gray-500">Corretas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-bold text-2xl text-red-500">{result.totalQuestions - result.correctAnswers}</div>
                  <div className="text-gray-500">Incorretas</div>
                </div>
              </div>
              
              {/* Mensagem personalizada */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  {result.passedExam ? "Parabéns!" : "Continue praticando!"}
                </h2>
                <p className="text-gray-600">
                  {result.passedExam 
                    ? "Você está no caminho certo para a certificação! Continue estudando para aperfeiçoar ainda mais seus conhecimentos." 
                    : "Você precisa de mais prática neste tema. Não desista, revise o material e tente novamente!"}
                </p>
                <p className="text-gray-500 mt-2">
                  Tempo total: {Math.floor(result.timeSpent / 60)}min {result.timeSpent % 60}s
                </p>
                <Badge 
                  className={`mt-4 text-lg py-1.5 px-3 ${result.passedExam ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                  {result.passedExam ? 'APROVADO' : 'REPROVADO'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Revisão das Questões */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-bold">Revisão das Questões</h3>

            {questoes.map((questao, index) => {
              const userAnswer = result.answers[questao.id];
              const isCorrect = isAnswerCorrect(questao, userAnswer);
              
              return (
                <Card 
                  key={questao.id} 
                  className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">
                            Questão {index + 1}
                          </span>
                        </div>
                        <p className="mt-2">{questao.enunciado}</p>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Sua Resposta:</h4>
                      <div className="pl-4">
                        {questao.alternativas.map(alternativa => (
                          <div 
                            key={alternativa.id}
                            className={`flex items-center gap-2 py-1 ${
                              alternativa.id === userAnswer 
                                ? isCorrect 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-red-600 font-medium'
                                : ''
                            }`}
                          >
                            {alternativa.id === userAnswer && (
                              isCorrect 
                                ? <CheckCircle className="w-4 h-4 text-green-500" /> 
                                : <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>{alternativa.texto}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isCorrect && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Resposta Correta:</h4>
                        <div className="pl-4">
                          {questao.alternativas.map(alternativa => (
                            alternativa.id === userAnswer ? null : (
                              <div 
                                key={alternativa.id}
                                className={`flex items-center gap-2 py-1 ${
                                  isAnswerCorrect(questao, alternativa.id) 
                                    ? 'text-green-600 font-medium' 
                                    : ''
                                }`}
                              >
                                {isAnswerCorrect(questao, alternativa.id) && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <span>{alternativa.texto}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                        <h4 className="font-medium">Explicação:</h4>
                      </div>
                      <p className="text-gray-700">
                        {/* Aqui você precisaria adicionar a explicação da questão */}
                        Explicação detalhada sobre a resposta correta e por que as outras alternativas estão incorretas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={handleBackToSimulado}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Simulado
            </Button>
            <Button onClick={handleTryAgain}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimuladoResultPage;
