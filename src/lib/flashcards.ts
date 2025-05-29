
import { supabase } from '@/lib/supabase';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  tags?: string[];
  status: 'new' | 'learning' | 'review' | 'graduated' | 'mastered';
  lastReviewedAt: string | null;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date | string;
  difficulty?: 'easy' | 'medium' | 'hard';
  question?: string;
  answer?: string;
  created_at?: string;
  updated_at?: string;
}

export const getFlashcards = async (): Promise<Flashcard[]> => {
  // Mock implementation
  return [];
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> => {
  // Mock implementation
  const newFlashcard: Flashcard = {
    id: Math.random().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...flashcard
  };
  return newFlashcard;
};

export const updateFlashcard = async (id: string, updates: Partial<Flashcard>): Promise<Flashcard> => {
  // Mock implementation
  const updatedFlashcard: Flashcard = {
    id,
    front: 'Updated front',
    back: 'Updated back',
    status: 'new',
    lastReviewedAt: null,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...updates
  };
  return updatedFlashcard;
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  // Mock implementation
  console.log('Deleting flashcard:', id);
};
