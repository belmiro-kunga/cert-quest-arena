
import { Exam } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

export const fetchExams = async (): Promise<Exam[]> => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('active', true);
      
    if (error) throw error;
    
    // Convert data to match our Exam type
    return data.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description || '',
      questions: [], // Actual questions would be fetched separately
      duration: exam.duration,
      passingScore: exam.passing_score,
      price: exam.price,
      discountPrice: exam.discount_price || null,
      discountPercentage: exam.discount_percentage || null,
      discountExpiresAt: exam.discount_expires_at ? new Date(exam.discount_expires_at) : null,
      questionsCount: exam.questions_count,
      difficulty: exam.difficulty as 'Fácil' | 'Médio' | 'Difícil',
      purchases: exam.purchases,
      rating: exam.rating
    }));
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    return [];
  }
};

export const createExam = async (examData: Partial<Exam>): Promise<Exam | null> => {
  try {
    // Convert from frontend model to database model
    const dbExam = {
      title: examData.title,
      description: examData.description,
      duration: examData.duration,
      passing_score: examData.passingScore || 70,
      price: examData.price || 0,
      discount_price: examData.discountPrice,
      discount_percentage: examData.discountPercentage,
      // Convert Date to ISO string for Supabase
      discount_expires_at: examData.discountExpiresAt ? examData.discountExpiresAt.toISOString() : null,
      questions_count: examData.questionsCount || 0,
      difficulty: examData.difficulty || 'Médio',
      active: true
    };
    
    const { data, error } = await supabase
      .from('exams')
      .insert(dbExam)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert back to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      questions: [],
      duration: data.duration,
      passingScore: data.passing_score,
      price: data.price,
      discountPrice: data.discount_price || null,
      discountPercentage: data.discount_percentage || null,
      discountExpiresAt: data.discount_expires_at ? new Date(data.discount_expires_at) : null,
      questionsCount: data.questions_count,
      difficulty: data.difficulty as 'Fácil' | 'Médio' | 'Difícil',
      purchases: data.purchases,
      rating: data.rating
    };
  } catch (error) {
    console.error('Erro ao criar simulado:', error);
    return null;
  }
};

export const updateExam = async (id: string, examData: Partial<Exam>): Promise<Exam | null> => {
  try {
    // Convert from frontend model to database model
    const dbExam = {
      title: examData.title,
      description: examData.description,
      duration: examData.duration,
      passing_score: examData.passingScore,
      price: examData.price,
      discount_price: examData.discountPrice,
      discount_percentage: examData.discountPercentage,
      // Convert Date to ISO string for Supabase
      discount_expires_at: examData.discountExpiresAt ? examData.discountExpiresAt.toISOString() : null,
      questions_count: examData.questionsCount,
      difficulty: examData.difficulty
    };
    
    const { data, error } = await supabase
      .from('exams')
      .update(dbExam)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert back to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      questions: [],
      duration: data.duration,
      passingScore: data.passing_score,
      price: data.price,
      discountPrice: data.discount_price || null,
      discountPercentage: data.discount_percentage || null,
      discountExpiresAt: data.discount_expires_at ? new Date(data.discount_expires_at) : null,
      questionsCount: data.questions_count,
      difficulty: data.difficulty as 'Fácil' | 'Médio' | 'Difícil',
      purchases: data.purchases,
      rating: data.rating
    };
  } catch (error) {
    console.error('Erro ao atualizar simulado:', error);
    return null;
  }
};

export const deleteExam = async (id: string): Promise<boolean> => {
  try {
    // We soft delete by setting active = false
    const { error } = await supabase
      .from('exams')
      .update({ active: false })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir simulado:', error);
    return false;
  }
};

export const fetchExamQuestions = async (examId: string) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        id,
        text,
        explanation,
        options (
          id, 
          text,
          is_correct
        )
      `)
      .eq('exam_id', examId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar questões do simulado ${examId}:`, error);
    return [];
  }
};
