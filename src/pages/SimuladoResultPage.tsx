import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimuladoResult } from '@/hooks/useSimuladoResult';
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
  const { simulado, questoes, result, isLoading } = useSimuladoResult(id);

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
    // Log de depuração para investigar o bug
    console.log('[DEBUG isAnswerCorrect]', {
      resposta_correta: questao.resposta_correta,
      selectedAnswerId,
      tipo_resposta_correta: typeof questao.resposta_correta,
      tipo_selectedAnswerId: typeof selectedAnswerId,
      comparacao: String(questao.resposta_correta) === String(selectedAnswerId)
    });
    // Comparação segura como string
    return String(questao.resposta_correta) === String(selectedAnswerId);
  };

  if (isLoading || !simulado || !result) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
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

            {questoes.map((questao, idx) => {
  console.log(`QUESTAO #${questao.id} referencia_ativa:`, questao.referencia_ativa, 'url_referencia:', questao.url_referencia);

              const userAnswer = result.answers[questao.id];
              const isCorrect = isAnswerCorrect(questao, userAnswer);
              
              return (
                <Card key={questao.id} className={`shadow border ${isCorrect ? 'border-green-200 bg-green-50/60' : 'border-red-200 bg-red-50/60'} transition-all duration-200`}>
                  <React.Fragment>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                          Questão {idx + 1}
                        </CardTitle>
                        
                        <CardDescription className="text-lg text-gray-700">
                          {questao.enunciado}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={isCorrect ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
                          {isCorrect ? 'Correta' : 'Incorreta'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-500">Sua resposta:</span>
                        {questao.alternativas.map(alternativa => (
                          <span
                            key={alternativa.id}
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${alternativa.id === userAnswer ? (isCorrect ? 'bg-green-100 text-green-700 font-bold' : 'bg-red-100 text-red-700 font-bold') : 'bg-gray-100 text-gray-700'}`}
                          >
                            {alternativa.id === userAnswer && (isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />)}
                            {alternativa.texto}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-gray-500">Resposta correta:</span>
                        {questao.alternativas.map(alternativa => (
                          alternativa.id === questao.resposta_correta ? (
                            <span
                              key={alternativa.id}
                              className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {alternativa.texto}
                            </span>
                          ) : null
                        ))}
                        <h4 className="font-medium">Explicação:</h4>
                      </div>
                      <p id={`explanation-${questao.id}`} className="text-gray-700">
                        {questao.explicacao || "Nenhuma explicação disponível para esta questão."}
                      </p>
                      {questao.referencia_ativa && questao.url_referencia && (
                        <div className="mt-4">
                          <a
                            href={questao.url_referencia.startsWith('http') ? questao.url_referencia : `https://${questao.url_referencia}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                            title="Ver referência da questão"
                            tabIndex={0}
                            role="link"
                            aria-label="Abrir referência da questão em nova aba"
                            style={{ pointerEvents: 'auto' }}
                          >
                            <AlertCircle className="w-5 h-5 text-white" />
                            Referência
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </React.Fragment>
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
