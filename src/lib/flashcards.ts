
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
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
}

export const getFlashcards = async (): Promise<Flashcard[]> => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> => {
  // Mock implementation - replace with actual API call
  const now = new Date().toISOString();
  return {
    ...flashcard,
    id: Date.now().toString(),
    created_at: now,
    updated_at: now
  };
};

export const updateFlashcard = async (id: string, flashcard: Partial<Flashcard>): Promise<Flashcard> => {
  // Mock implementation - replace with actual API call
  return {
    id,
    front: flashcard.front || '',
    back: flashcard.back || '',
    question: flashcard.question || flashcard.front || '',
    answer: flashcard.answer || flashcard.back || '',
    difficulty: flashcard.difficulty || 'easy',
    category: flashcard.category || '',
    tags: flashcard.tags || [],
    status: flashcard.status || 'new',
    lastReviewedAt: flashcard.lastReviewedAt || null,
    interval: flashcard.interval || 0,
    repetitions: flashcard.repetitions || 0,
    easeFactor: flashcard.easeFactor || 2.5,
    nextReview: flashcard.nextReview || new Date().toISOString(),
    created_at: flashcard.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting flashcard:', id);
};
