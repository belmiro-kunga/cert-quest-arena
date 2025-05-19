import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimuladoResult } from '@/hooks/useSimuladoResult';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimuladoReviewCard from '@/components/SimuladoReviewCard';
import { getSimuladoById, Exam } from '@/services/simuladoService';
// TODO: Replace with Supabase implementation
// import { getQuestoesBySimuladoId } from '@/services/questaoService';
import type { Questao } from '@/types/simulado';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, XCircle, ArrowLeft, RefreshCw, BookOpen, Bookmark, BookmarkCheck, CopyCheck, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createFlashcard, createDeck } from '@/lib/flashcards';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { SimuladoResult } from '@/types/simulado';

const SimuladoResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { simulado, questoes, result, isLoading } = useSimuladoResult(id);
  
  // Estados para seleção e criação de flashcards
  const [incorrectQuestions, setIncorrectQuestions] = useState<Questao[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<number, boolean>>({});
  const [isFlashcardDialogOpen, setIsFlashcardDialogOpen] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [isCreatingFlashcards, setIsCreatingFlashcards] = useState(false);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);

  // Identificar questões incorretas quando os dados carregarem
  useEffect(() => {
    if (!questoes || !result) return;
    
    const incorrectQuestoes = questoes.filter(questao => {
      const userAnswer = result.answers[questao.id];
      return !isAnswerCorrect(questao, userAnswer);
    });
    
    setIncorrectQuestions(incorrectQuestoes);
    
    // Inicializar estado de seleção (todas selecionadas por padrão)
    const initialSelection = incorrectQuestoes.reduce((acc, questao) => {
      acc[questao.id] = true;
      return acc;
    }, {} as Record<number, boolean>);
    
    setSelectedQuestions(initialSelection);
  }, [questoes, result]);

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
  const isAnswerCorrect = (questao: Questao, selectedAnswerId: string | string[]) => {
    if (!result || !selectedAnswerId) return false;

    // Para questões de múltipla escolha
    if (questao.tipo === 'multiple_choice') {
      // Converter resposta correta para array se não for
      const correctOptions = Array.isArray(questao.resposta_correta) 
        ? questao.resposta_correta 
        : questao.resposta_correta.split(',');
      
      // Converter resposta do usuário para array se não for
      const userAnswers = Array.isArray(selectedAnswerId) 
        ? selectedAnswerId 
        : [selectedAnswerId];
      
      // Verificar se todas as respostas estão corretas
      const isCorrect = 
        // Tem a mesma quantidade de respostas
        userAnswers.length === correctOptions.length &&
        // Todas as respostas corretas estão nas respostas do usuário
        correctOptions.every(opt => userAnswers.includes(opt));
        
      return isCorrect;
    }
    
    // Para questões de escolha única
    return String(questao.resposta_correta) === String(selectedAnswerId);
  };

  // Alternar seleção de questão
  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Selecionar/Desselecionar todas as questões incorretas
  const toggleAllQuestions = (select: boolean) => {
    const newSelection = incorrectQuestions.reduce((acc, questao) => {
      acc[questao.id] = select;
      return acc;
    }, {} as Record<number, boolean>);
    
    setSelectedQuestions(newSelection);
  };
  
  // Salvar questões selecionadas para revisão
  const saveQuestionsForReview = () => {
    setIsSavingQuestions(true);
    
    // Filtrar questões selecionadas
    const questionsToSave = incorrectQuestions.filter(q => selectedQuestions[q.id]);
    
    if (questionsToSave.length === 0) {
      toast({
        title: "Nenhuma questão selecionada",
        description: "Selecione pelo menos uma questão para salvar.",
        variant: "destructive",
      });
      setIsSavingQuestions(false);
      return;
    }
    
    // Salvar questões no localStorage para revisão
    const savedQuestions = JSON.parse(localStorage.getItem('saved_questions_for_review') || '[]');
    
    // Verificar e evitar duplicatas
    const existingIds = new Set(savedQuestions.map((q: Questao) => q.id));
    const newQuestionsToSave = questionsToSave.filter(q => !existingIds.has(q.id));
    
    // Salvar questões
    localStorage.setItem(
      'saved_questions_for_review', 
      JSON.stringify([...savedQuestions, ...newQuestionsToSave])
    );
    
    setIsSavingQuestions(false);
    
    toast({
      title: "Questões salvas para revisão",
      description: `${newQuestionsToSave.length} questões foram salvas para revisão posterior.`,
      variant: "default",
    });
  };
  
  // Abrir diálogo para criar flashcards
  const openFlashcardDialog = () => {
    if (incorrectQuestions.filter(q => selectedQuestions[q.id]).length === 0) {
      toast({
        title: "Nenhuma questão selecionada",
        description: "Selecione pelo menos uma questão para criar flashcards.",
        variant: "destructive",
      });
      return;
    }
    
    // Preencher valores padrão
    setDeckName(simulado?.title ? `Revisão - ${simulado.title}` : 'Revisão do Simulado');
    setDeckDescription(`Flashcards criados a partir de questões incorretas do simulado.`);
    setIsFlashcardDialogOpen(true);
  };
  
  // Criar flashcards a partir das questões selecionadas
  const createFlashcardsFromQuestions = async () => {
    if (!deckName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe um nome para o deck de flashcards.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingFlashcards(true);
    
    try {
      // Filtrar questões selecionadas
      const questionsToConvert = incorrectQuestions.filter(q => selectedQuestions[q.id]);
      
      if (questionsToConvert.length === 0) {
        throw new Error("Nenhuma questão selecionada");
      }
      
      // Criar flashcards a partir das questões
      const flashcards = questionsToConvert.map(question => {
        // Para questões de múltipla escolha, incluir todas as alternativas corretas na resposta
        let answer = '';
        
        if (question.tipo === 'multiple_choice') {
          const correctOptions = Array.isArray(question.resposta_correta) 
            ? question.resposta_correta 
            : question.resposta_correta.split(',');
          
          const correctAlternativas = question.alternativas
            .filter(alt => correctOptions.includes(alt.id))
            .map(alt => alt.texto)
            .join('\n- ');
          
          answer = `Respostas corretas:\n- ${correctAlternativas}\n\nExplicação: ${question.explicacao || 'Não disponível'}`;
        } else {
          // Para questões de escolha única
          const correctAlternativa = question.alternativas
            .find(alt => String(alt.id) === String(question.resposta_correta))?.texto || '';
          
          answer = `Resposta: ${correctAlternativa}\n\nExplicação: ${question.explicacao || 'Não disponível'}`;
        }
        
        return {
          question: question.enunciado,
          answer: answer,
          category: simulado?.category || 'Não categorizado',
          difficulty: 'medium',
          tags: ['simulado', `questao_${question.id}`],
        };
      });
      
      // Criar deck com os flashcards
      const deck = {
        name: deckName,
        description: deckDescription || `Flashcards criados a partir do simulado ${simulado?.title}.`,
        category: simulado?.category || 'Não categorizado',
        difficulty: 'medium',
        tags: [`simulado_${id}`],
        flashcards: flashcards,
      };
      
      // Aqui faria a chamada para a API, mas vamos simular localmente
      // const newDeck = await createDeck(deck);
      
      // Salvar no localStorage para simulação
      const savedDecks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
      const newDeck = {
        ...deck,
        id: `deck_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('flashcard_decks', JSON.stringify([...savedDecks, newDeck]));
      
      setIsFlashcardDialogOpen(false);
      setIsCreatingFlashcards(false);
      
      toast({
        title: "Deck de flashcards criado",
        description: `${flashcards.length} flashcards foram criados a partir das questões selecionadas.`,
        variant: "default",
      });
      
      // Redirecionar para o modo de estudo
      setTimeout(() => {
        navigate('/study/flashcards');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar flashcards:', error);
      setIsCreatingFlashcards(false);
      
      toast({
        title: "Erro ao criar flashcards",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar os flashcards.",
        variant: "destructive",
      });
    }
  };

  // Ir para o modo de estudo
  const goToStudyMode = () => {
    navigate('/study/flashcards');
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

  // Contar questões incorretas
  const incorrectCount = incorrectQuestions.length;
  const selectedCount = Object.values(selectedQuestions).filter(Boolean).length;

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

              {/* Modo de estudo - Nova seção */}
              {incorrectCount > 0 && (
                <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 flex items-center mb-3">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Modo de Estudo
                  </h3>
                  
                  <p className="text-blue-700 mb-4">
                    Você errou <strong>{incorrectCount}</strong> questões. Salve-as para revisão posterior ou crie flashcards para estudar.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {selectedCount} de {incorrectCount} questões selecionadas
                      </span>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAllQuestions(true)}
                          className="text-xs"
                        >
                          Selecionar todas
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAllQuestions(false)}
                          className="text-xs"
                        >
                          Limpar seleção
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 my-2">
                      {incorrectQuestions.map((questao) => (
                        <div 
                          key={`select-${questao.id}`}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 border cursor-pointer ${
                            selectedQuestions[questao.id] 
                              ? 'bg-blue-100 border-blue-300' 
                              : 'bg-white border-gray-200'
                          }`}
                          onClick={() => toggleQuestionSelection(questao.id)}
                        >
                          <Checkbox 
                            checked={selectedQuestions[questao.id] || false} 
                            onCheckedChange={() => toggleQuestionSelection(questao.id)}
                            id={`question-${questao.id}`}
                          />
                          <Label htmlFor={`question-${questao.id}`} className="cursor-pointer">
                            Questão {questao.id}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              onClick={saveQuestionsForReview}
                              disabled={selectedCount === 0 || isSavingQuestions}
                            >
                              {isSavingQuestions ? (
                                <div className="flex items-center">
                                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-opacity-50 border-t-transparent mr-2"></div>
                                  Salvando...
                                </div>
                              ) : (
                                <>
                                  <BookmarkCheck className="mr-2 h-4 w-4" />
                                  Salvar para revisão
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Salva as questões selecionadas para revisar depois</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="text-white bg-blue-600 hover:bg-blue-700"
                              onClick={openFlashcardDialog}
                              disabled={selectedCount === 0 || isCreatingFlashcards}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Criar flashcards
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cria flashcards baseados nas questões para estudo espaçado</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="mt-2 flex justify-center">
                      <Button
                        variant="link"
                        className="text-blue-600"
                        onClick={goToStudyMode}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ir para o modo de estudo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revisão das Questões */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-bold">Revisão das Questões</h3>

            {questoes.map((questao, idx) => {
              const userAnswer = result.answers[questao.id];
              const isCorrect = isAnswerCorrect(questao, userAnswer);
              return (
                <div key={questao.id} className="relative">
                  {!isCorrect && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Checkbox
                        checked={selectedQuestions[questao.id] || false}
                        onCheckedChange={() => toggleQuestionSelection(questao.id)}
                        id={`review-question-${questao.id}`}
                        className="h-5 w-5 border-2 border-blue-500 rounded-md bg-white"
                      />
                    </div>
                  )}
                  <SimuladoReviewCard
                    questao={questao}
                    userAnswerId={userAnswer}
                    isCorrect={isCorrect}
                    index={idx}
                  />
                </div>
              );
            })}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between gap-4 mt-8">
            <Button variant="outline" onClick={handleBackToSimulado}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Simulado
            </Button>
            
            {incorrectCount > 0 && (
              <Button 
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                onClick={openFlashcardDialog}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar flashcards das incorretas
              </Button>
            )}
            
            <Button onClick={handleTryAgain}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </main>
      
      {/* Diálogo para criar flashcards */}
      <Dialog open={isFlashcardDialogOpen} onOpenChange={setIsFlashcardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar deck de flashcards</DialogTitle>
            <DialogDescription>
              Crie um novo deck de flashcards com as questões selecionadas para estudar melhor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="col-span-3"
                placeholder="Nome do deck"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                className="col-span-3"
                placeholder="Descrição do deck de flashcards"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right col-span-1">
                <Label>Questões</Label>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-gray-500">
                  {selectedCount} questões selecionadas serão convertidas em flashcards
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={createFlashcardsFromQuestions}
              disabled={isCreatingFlashcards}
            >
              {isCreatingFlashcards ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-opacity-50 border-t-transparent mr-2"></div>
                  Criando...
                </div>
              ) : "Criar flashcards"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default SimuladoResultPage;
