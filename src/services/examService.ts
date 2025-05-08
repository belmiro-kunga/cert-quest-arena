import { supabase } from '@/integrations/supabase/client';
import { Exam } from '@/types/admin';

const convertDatesToStrings = (examData: any) => {
  return {
    ...examData,
    discount_expires_at: examData.discount_expires_at instanceof Date 
      ? examData.discount_expires_at.toISOString() 
      : examData.discount_expires_at
  };
};

// Transform database exam to match Exam type
const transformExamData = (exam: any): Exam => {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description || '',
    questions: [], // Default empty array since questions are loaded separately
    duration: exam.duration,
    passingScore: exam.passing_score,
    price: exam.price,
    discountPrice: exam.discount_price,
    discountPercentage: exam.discount_percentage,
    discountExpiresAt: exam.discount_expires_at || null,
    questionsCount: exam.questions_count,
    difficulty: exam.difficulty as 'Fácil' | 'Médio' | 'Difícil',
    purchases: exam.purchases,
    rating: exam.rating,
    createdAt: exam.created_at || new Date().toISOString(),
    updatedAt: exam.updated_at || new Date().toISOString()
  };
};

export const fetchExams = async (): Promise<Exam[]> => {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }

  return (data || []).map(transformExamData);
};

export const createExam = async (examData: any): Promise<Exam> => {
  const formattedData = convertDatesToStrings(examData);
  
  const { data, error } = await supabase
    .from('exams')
    .insert(formattedData)
    .select()
    .single();

  if (error) {
    console.error('Error creating exam:', error);
    throw error;
  }

  return transformExamData(data);
};

export const updateExam = async (id: string, examData: any): Promise<Exam> => {
  const formattedData = convertDatesToStrings(examData);
  
  const { data, error } = await supabase
    .from('exams')
    .update(formattedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating exam:', error);
    throw error;
  }

  return transformExamData(data);
};

export const deleteExam = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }

  return true;
};
