import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  flashcards: Flashcard[];
  created_at: string;
  updated_at: string;
}

export interface FlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  last_reviewed: string;
  next_review: string;
  review_count: number;
  correct_count: number;
  incorrect_count: number;
}

export const getFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar flashcards:', error);
    return [];
  }
};

export const getFlashcardById = async (id: string): Promise<Flashcard> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Flashcard não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar flashcard:', error);
    throw error;
  }
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        ...flashcard,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Erro ao criar flashcard');
    
    return data;
  } catch (error) {
    console.error('Erro ao criar flashcard:', error);
    throw error;
  }
};

export const updateFlashcard = async (id: string, flashcard: Partial<Flashcard>): Promise<Flashcard> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        ...flashcard,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Flashcard não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar flashcard:', error);
    throw error;
  }
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar flashcard:', error);
    throw error;
  }
};

export const getDecks = async (): Promise<FlashcardDeck[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .select(`
        *,
        flashcards:flashcards(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar decks de flashcards:', error);
    return [];
  }
};

export const getDeckById = async (id: string): Promise<FlashcardDeck> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .select(`
        *,
        flashcards:flashcards(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Deck não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar deck de flashcards:', error);
    throw error;
  }
};

export const createDeck = async (deck: Omit<FlashcardDeck, 'id' | 'created_at' | 'updated_at'>): Promise<FlashcardDeck> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .insert({
        ...deck,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Erro ao criar deck');
    
    return data;
  } catch (error) {
    console.error('Erro ao criar deck de flashcards:', error);
    throw error;
  }
};

export const updateDeck = async (id: string, deck: Partial<FlashcardDeck>): Promise<FlashcardDeck> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .update({
        ...deck,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Deck não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar deck de flashcards:', error);
    throw error;
  }
};

export const deleteDeck = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('flashcard_decks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar deck de flashcards:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string): Promise<FlashcardProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', userId)
      .order('next_review', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar progresso do usuário:', error);
    return [];
  }
};

export const updateProgress = async (progress: Partial<FlashcardProgress> & { id: string }): Promise<FlashcardProgress> => {
  try {
    const { data, error } = await supabase
      .from('flashcard_progress')
      .update({
        ...progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', progress.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Progresso não encontrado');
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    throw error;
  }
};

export const getDueCards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const now = new Date().toISOString();
    
    // Buscar IDs dos flashcards devidos
    const { data: progressData, error: progressError } = await supabase
      .from('flashcard_progress')
      .select('flashcard_id')
      .eq('user_id', userId)
      .lte('next_review', now);

    if (progressError) throw progressError;
    if (!progressData?.length) return [];

    // Buscar os flashcards correspondentes
    const { data: flashcardData, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*')
      .in('id', progressData.map(p => p.flashcard_id));

    if (flashcardError) throw flashcardError;
    return flashcardData || [];
  } catch (error) {
    console.error('Erro ao buscar flashcards devidos:', error);
    return [];
  }
};
