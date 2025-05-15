import { api } from '@/services/api';
import { AxiosError } from 'axios';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
}

export const getFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const response = await api.get('/flashcards');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar flashcards:', error.response?.data);
    } else {
      console.error('Erro ao buscar flashcards:', error);
    }
    return [];
  }
};

export const getFlashcardById = async (id: string): Promise<Flashcard> => {
  try {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar flashcard:', error.response?.data);
    } else {
      console.error('Erro ao buscar flashcard:', error);
    }
    throw error;
  }
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flashcard> => {
  try {
    const response = await api.post('/flashcards', flashcard);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao criar flashcard:', error.response?.data);
    } else {
      console.error('Erro ao criar flashcard:', error);
    }
    throw error;
  }
};

export const updateFlashcard = async (id: string, flashcard: Partial<Flashcard>): Promise<Flashcard> => {
  try {
    const response = await api.put(`/flashcards/${id}`, flashcard);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao atualizar flashcard:', error.response?.data);
    } else {
      console.error('Erro ao atualizar flashcard:', error);
    }
    throw error;
  }
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  try {
    await api.delete(`/flashcards/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao deletar flashcard:', error.response?.data);
    } else {
      console.error('Erro ao deletar flashcard:', error);
    }
    throw error;
  }
};

export const getDecks = async (): Promise<FlashcardDeck[]> => {
  try {
    const response = await api.get('/flashcard-decks');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar decks de flashcards:', error.response?.data);
    } else {
      console.error('Erro ao buscar decks de flashcards:', error);
    }
    return [];
  }
};

export const getDeckById = async (id: string): Promise<FlashcardDeck> => {
  try {
    const response = await api.get(`/flashcard-decks/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar deck de flashcards:', error.response?.data);
    } else {
      console.error('Erro ao buscar deck de flashcards:', error);
    }
    throw error;
  }
};

export const createDeck = async (deck: Omit<FlashcardDeck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlashcardDeck> => {
  try {
    const response = await api.post('/flashcard-decks', deck);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao criar deck de flashcards:', error.response?.data);
    } else {
      console.error('Erro ao criar deck de flashcards:', error);
    }
    throw error;
  }
};

export const updateDeck = async (id: string, deck: Partial<FlashcardDeck>): Promise<FlashcardDeck> => {
  try {
    const response = await api.put(`/flashcard-decks/${id}`, deck);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao atualizar deck de flashcards:', error.response?.data);
    } else {
      console.error('Erro ao atualizar deck de flashcards:', error);
    }
    throw error;
  }
};

export const deleteDeck = async (id: string): Promise<void> => {
  try {
    await api.delete(`/flashcard-decks/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao deletar deck de flashcards:', error.response?.data);
    } else {
      console.error('Erro ao deletar deck de flashcards:', error);
    }
    throw error;
  }
};

export const getUserProgress = async (userId: string): Promise<FlashcardProgress[]> => {
  try {
    const response = await api.get(`/flashcard-progress/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar progresso do usuário:', error.response?.data);
    } else {
      console.error('Erro ao buscar progresso do usuário:', error);
    }
    return [];
  }
};

export const updateProgress = async (progress: Partial<FlashcardProgress> & { id: string }): Promise<FlashcardProgress> => {
  try {
    const response = await api.put(`/flashcard-progress/${progress.id}`, progress);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao atualizar progresso:', error.response?.data);
    } else {
      console.error('Erro ao atualizar progresso:', error);
    }
    throw error;
  }
};

export const getDueCards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const response = await api.get(`/flashcard-progress/user/${userId}/due`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar flashcards devidos:', error.response?.data);
    } else {
      console.error('Erro ao buscar flashcards devidos:', error);
    }
    return [];
  }
};
