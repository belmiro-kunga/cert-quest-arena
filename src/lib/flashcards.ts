
import { supabase } from './supabase';
import type { Flashcard, FlashcardReview, FlashcardStatus } from '@/types/admin';

// Algoritmo SM-2 para repetição espaçada
export const calculateNextReview = (quality: number, card: Flashcard): { interval: number; easeFactor: number } => {
  let { interval = 0, easeFactor = 2.5, repetitions = 0 } = card;

  // Qualidade < 3 significa que o usuário não lembrou bem o cartão
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Ajusta o fator de facilidade
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  return { interval, easeFactor };
};

// Funções para gerenciar flashcards
export const createFlashcard = async (flashcard: Partial<Flashcard>) => {
  const { data, error } = await supabase
    .from('flashcards')
    .insert([{
      front: flashcard.front,
      back: flashcard.back,
      category: flashcard.category || '',
      tags: flashcard.tags || [],
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      status: flashcard.status || 'new',
      nextReview: new Date().toISOString(),
      lastReviewedAt: null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFlashcard = async (id: string, flashcard: Partial<Flashcard>) => {
  const { data, error } = await supabase
    .from('flashcards')
    .update({
      front: flashcard.front,
      back: flashcard.back,
      category: flashcard.category,
      tags: flashcard.tags,
      status: flashcard.status,
      lastReviewedAt: flashcard.lastReviewedAt,
      interval: flashcard.interval,
      repetitions: flashcard.repetitions,
      easeFactor: flashcard.easeFactor,
      nextReview: flashcard.nextReview
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFlashcard = async (id: string) => {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const listFlashcards = async () => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getFlashcardById = async (id: string) => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Funções para revisão de flashcards
export const getDueFlashcards = async (userId: string) => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .or(`nextReview.is.null,nextReview.lte.${now}`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const reviewFlashcard = async (userId: string, flashcardId: string, quality: number) => {
  // Busca o flashcard atual
  const flashcard = await getFlashcardById(flashcardId);
  
  // Calcula o próximo intervalo
  const { interval, easeFactor } = calculateNextReview(quality, flashcard);
  
  // Determina o próximo status
  let status: Flashcard['status'] = flashcard.status;
  if (quality >= 4) {
    if (status === 'new') status = 'learning';
    else if (status === 'learning') status = 'review';
    else if (status === 'review' && interval >= 21) status = 'graduated';
  } else if (quality < 3) {
    if (status !== 'new') status = 'learning';
  }

  // Calcula a próxima data de revisão
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  // Atualiza o flashcard
  const { data: updatedCard, error: updateError } = await supabase
    .from('flashcards')
    .update({
      interval,
      easeFactor,
      status,
      nextReview: nextReview.toISOString(),
      repetitions: flashcard.repetitions + 1
    })
    .eq('id', flashcardId)
    .select()
    .single();

  if (updateError) throw updateError;

  // Registra a revisão
  const { error: reviewError } = await supabase
    .from('flashcard_reviews')
    .insert([{
      flashcard_id: flashcardId,
      user_id: userId,
      quality,
      reviewed_at: new Date().toISOString()
    }]);

  if (reviewError) throw reviewError;

  return updatedCard;
};

// Funções para análise de progresso
export const getFlashcardStats = async (userId: string) => {
  const { data: reviews, error } = await supabase
    .from('flashcard_reviews')
    .select(`
      quality,
      flashcard:flashcard_id(status)
    `)
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    totalReviews: reviews.length,
    averageQuality: 0,
    statusCounts: {
      new: 0,
      learning: 0,
      review: 0,
      graduated: 0,
      mastered: 0
    }
  };

  if (reviews.length > 0) {
    stats.averageQuality = reviews.reduce((sum, r) => sum + r.quality, 0) / reviews.length;
    
    reviews.forEach(r => {
      if (r.flashcard && typeof r.flashcard === 'object' && 'status' in r.flashcard) {
        const status = (r.flashcard as any).status;
        if (status && typeof status === 'string') {
          stats.statusCounts[status as FlashcardStatus] = 
            (stats.statusCounts[status as FlashcardStatus] || 0) + 1;
        }
      }
    });
  }

  return stats;
};
