import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Flashcard } from '@/types/admin';
import { getDueFlashcards, reviewFlashcard } from '@/lib/flashcards';
import { useUser } from '@/lib/hooks/useUser';
import { useAchievements } from '@/lib/hooks/useAchievements';

export const FlashcardReview: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { handleFlashcardReview, updateStudyStreak } = useAchievements();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchFlashcards();
      updateStudyStreak();
    }
  }, [user?.id, updateStudyStreak]);

  const fetchFlashcards = async () => {
    try {
      if (!user?.id) return;
      const data = await getDueFlashcards(user.id);
      setFlashcards(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar flashcards:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os flashcards',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleQualityResponse = async (quality: number) => {
    try {
      if (!user?.id || !flashcards[currentIndex]) return;

      await reviewFlashcard(user.id, flashcards[currentIndex].id, quality);

      // Atualiza conquistas
      const isPerfect = quality === 5;
      if (isPerfect) {
        setConsecutiveCorrect(prev => prev + 1);
      } else {
        setConsecutiveCorrect(0);
      }
      await handleFlashcardReview(isPerfect);

      // Move para o próximo cartão
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Busca mais cartões se necessário
        await fetchFlashcards();
        setCurrentIndex(0);
      }

      setShowAnswer(false);
    } catch (error: any) {
      console.error('Erro ao revisar flashcard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a revisão',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Carregando flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p>Não há flashcards para revisar no momento!</p>
        <p className="text-sm text-muted-foreground">
          Volte mais tarde para novas revisões.
        </p>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Badge variant="outline">
            {currentIndex + 1} de {flashcards.length}
          </Badge>
          <Badge variant="secondary">
            {currentFlashcard.category}
          </Badge>
        </div>
        <div className="flex gap-1">
          {currentFlashcard.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="min-h-[300px]">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="min-h-[120px]">
              <h3 className="text-lg font-medium mb-2">Pergunta:</h3>
              <p className="whitespace-pre-wrap">{currentFlashcard.front}</p>
            </div>

            {showAnswer ? (
              <div className="space-y-6">
                <div className="min-h-[120px]">
                  <h3 className="text-lg font-medium mb-2">Resposta:</h3>
                  <p className="whitespace-pre-wrap">{currentFlashcard.back}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Quão bem você lembrou deste cartão?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="bg-red-100 hover:bg-red-200 border-red-200"
                      onClick={() => handleQualityResponse(1)}
                    >
                      Difícil
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-200"
                      onClick={() => handleQualityResponse(3)}
                    >
                      Bom
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-green-100 hover:bg-green-200 border-green-200"
                      onClick={() => handleQualityResponse(5)}
                    >
                      Fácil
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleShowAnswer}
                  className="min-w-[200px]"
                >
                  Mostrar Resposta
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>
          Status: {currentFlashcard.status === 'new' ? 'Novo' :
                   currentFlashcard.status === 'learning' ? 'Aprendendo' :
                   currentFlashcard.status === 'review' ? 'Revisão' : 'Graduado'}
        </p>
        <p>
          Próxima revisão:{' '}
          {currentFlashcard.nextReview
            ? new Date(currentFlashcard.nextReview).toLocaleDateString()
            : 'Não agendado'}
        </p>
      </div>
    </div>
  );
};
