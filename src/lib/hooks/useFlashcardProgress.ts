
import { useState, useEffect } from 'react';
import { getFlashcards } from '@/lib/flashcards';

export const useFlashcardProgress = () => {
  const [progress, setProgress] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const flashcards = await getFlashcards();
        setTotalCards(flashcards.length);
        // Mock completed cards calculation
        setCompletedCards(Math.floor(flashcards.length * 0.3));
        setProgress(flashcards.length > 0 ? (completedCards / flashcards.length) * 100 : 0);
      } catch (error) {
        console.error('Error loading flashcard progress:', error);
      }
    };

    loadProgress();
  }, [completedCards]);

  return {
    progress,
    totalCards,
    completedCards,
  };
};
