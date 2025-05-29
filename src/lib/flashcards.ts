export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
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
    question: flashcard.question || '',
    answer: flashcard.answer || '',
    difficulty: flashcard.difficulty || 'easy',
    category: flashcard.category || '',
    tags: flashcard.tags || [],
    created_at: flashcard.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting flashcard:', id);
};
