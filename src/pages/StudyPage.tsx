import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimuladoReviewCard from '@/components/SimuladoReviewCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Bookmark, BookmarkCheck, Trash, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Questao } from '@/types/simulado';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedQuestions, setSavedQuestions] = useState<Questao[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar questões salvas do localStorage
    const loadSavedQuestions = () => {
      try {
        const questionsJSON = localStorage.getItem('saved_questions_for_review');
        const questionsData = questionsJSON ? JSON.parse(questionsJSON) : [];
        setSavedQuestions(questionsData);
      } catch (error) {
        console.error('Erro ao carregar questões salvas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as questões salvas para revisão.',
          variant: 'destructive',
        });
      }
    };

    // Carregar decks de flashcards do localStorage
    const loadFlashcardDecks = () => {
      try {
        const decksJSON = localStorage.getItem('flashcard_decks');
        const decksData = decksJSON ? JSON.parse(decksJSON) : [];
        setFlashcardDecks(decksData);
      } catch (error) {
        console.error('Erro ao carregar decks de flashcards:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os decks de flashcards.',
          variant: 'destructive',
        });
      }
    };

    loadSavedQuestions();
    loadFlashcardDecks();
    setLoading(false);
  }, [toast]);

  // Remover uma questão da lista de revisão
  const removeQuestion = (questionId: number) => {
    const updatedQuestions = savedQuestions.filter(q => q.id !== questionId);
    setSavedQuestions(updatedQuestions);
    localStorage.setItem('saved_questions_for_review', JSON.stringify(updatedQuestions));
    
    toast({
      title: 'Questão removida',
      description: 'A questão foi removida da sua lista de revisão.',
    });
  };

  // Limpar todas as questões salvas
  const clearAllQuestions = () => {
    setSavedQuestions([]);
    localStorage.setItem('saved_questions_for_review', JSON.stringify([]));
    
    toast({
      title: 'Lista limpa',
      description: 'Todas as questões foram removidas da sua lista de revisão.',
    });
  };

  // Navegar para o deck de flashcards
  const goToFlashcardDeck = (deckId: string) => {
    toast({
      title: 'Navegando para flashcards',
      description: 'Esta funcionalidade estará disponível em breve.',
    });
    // Aqui você implementaria a navegação para o deck específico
    // navigate(`/study/flashcards/${deckId}`);
  };

  // Voltar para a página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Modo de Estudo</h1>
              <p className="text-gray-600">Revise questões salvas e estude com flashcards</p>
            </div>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Questões Salvas
                {savedQuestions.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700">{savedQuestions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Flashcards
                {flashcardDecks.length > 0 && (
                  <Badge className="ml-2 bg-green-100 text-green-700">{flashcardDecks.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Aba de Questões Salvas */}
            <TabsContent value="questions" className="space-y-4">
              {savedQuestions.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Suas questões salvas</h2>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={clearAllQuestions}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Limpar lista
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {savedQuestions.map((questao, idx) => (
                      <div key={`saved-${questao.id}`} className="relative">
                        <button 
                          className="absolute -top-2 -right-2 z-10 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                          onClick={() => removeQuestion(questao.id)}
                          aria-label="Remover questão"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <SimuladoReviewCard
                          questao={questao}
                          userAnswerId=""
                          isCorrect={false}
                          index={idx}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                  <BookmarkCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma questão salva</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    Você ainda não salvou nenhuma questão para revisão. Quando completar um simulado,
                    você poderá salvar as questões incorretas para estudar depois.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/simulados')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                  >
                    Ver simulados disponíveis
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Aba de Flashcards */}
            <TabsContent value="flashcards" className="space-y-4">
              {flashcardDecks.length > 0 ? (
                <>
                  <h2 className="text-xl font-semibold">Seus decks de flashcards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flashcardDecks.map((deck) => (
                      <Card key={deck.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{deck.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {deck.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex gap-2">
                            <Badge className="bg-blue-100 text-blue-700">
                              {deck.flashcards?.length || 0} cartões
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 capitalize">
                              {deck.difficulty || 'médio'}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => goToFlashcardDeck(deck.id)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Estudar agora
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum deck de flashcards</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    Você ainda não criou nenhum deck de flashcards. Complete um simulado e
                    crie flashcards a partir das questões incorretas.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/simulados')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                  >
                    Ver simulados disponíveis
                  </Button>
                </div>
              )}
              
              <Alert className="bg-blue-50 border-blue-200">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Estudo espaçado</AlertTitle>
                <AlertDescription className="text-blue-700">
                  O estudo com flashcards utiliza repetição espaçada para ajudar a fixar o conhecimento de forma mais eficiente.
                  Crie flashcards a partir de questões incorretas para melhorar seu aprendizado.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudyPage; 