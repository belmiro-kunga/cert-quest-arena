
import type { Flashcard, FlashcardReview } from '@/types/admin';

// Mock flashcard service - replace with actual implementation
export const getFlashcards = async (): Promise<Flashcard[]> => {
  return [
    {
      id: '1',
      front: 'What is AWS Lambda?',
      back: 'AWS Lambda is a serverless computing service that runs code in response to events.',
      category: 'AWS',
      tags: ['serverless', 'compute'],
      status: 'new',
      lastReviewedAt: null,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date()
    }
  ];
};

export const getDueFlashcards = async (): Promise<Flashcard[]> => {
  const flashcards = await getFlashcards();
  const now = new Date();
  return flashcards.filter(card => new Date(card.nextReview) <= now);
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id'>): Promise<Flashcard> => {
  return {
    ...flashcard,
    id: Date.now().toString()
  };
};

export const reviewFlashcard = async (
  flashcardId: string, 
  quality: number
): Promise<FlashcardReview> => {
  return {
    id: Date.now().toString(),
    flashcard_id: flashcardId,
    user_id: 'current-user',
    quality: quality,
    reviewed_at: new Date().toISOString()
  };
};

export const updateFlashcard = async (
  id: string, 
  updates: Partial<Flashcard>
): Promise<Flashcard> => {
  const flashcards = await getFlashcards();
  const flashcard = flashcards.find(f => f.id === id);
  if (!flashcard) {
    throw new Error('Flashcard not found');
  }
  return { ...flashcard, ...updates };
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  console.log('Deleting flashcard:', id);
};
