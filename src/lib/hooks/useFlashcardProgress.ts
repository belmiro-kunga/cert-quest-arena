
import { useState, useEffect } from 'react';
import { getFlashcards } from '@/lib/flashcards';

interface FlashcardStats {
  statusCounts: {
    new: number;
    learning: number;
    review: number;
    graduated: number;
  };
  totalReviews: number;
  averageQuality: number;
}

export const useFlashcardProgress = () => {
  const [progress, setProgress] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const flashcards = await getFlashcards();
        setTotalCards(flashcards.length);
        
        const completed = Math.floor(flashcards.length * 0.3);
        setCompletedCards(completed);
        setProgress(flashcards.length > 0 ? (completed / flashcards.length) * 100 : 0);
        
        // Mock stats
        setStats({
          statusCounts: {
            new: Math.floor(flashcards.length * 0.4),
            learning: Math.floor(flashcards.length * 0.2),
            review: Math.floor(flashcards.length * 0.1),
            graduated: completed,
          },
          totalReviews: completed * 3,
          averageQuality: 4.2,
        });
      } catch (error) {
        console.error('Error loading flashcard progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  return {
    progress,
    totalCards,
    completedCards,
    stats,
    isLoading,
  };
};
