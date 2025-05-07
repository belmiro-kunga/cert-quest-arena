
import { supabase } from '@/integrations/supabase/client';

const convertDatesToStrings = (examData: any) => {
  return {
    ...examData,
    discount_expires_at: examData.discount_expires_at instanceof Date 
      ? examData.discount_expires_at.toISOString() 
      : examData.discount_expires_at
  };
};

export const fetchExams = async () => {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }

  return data || [];
};

export const createExam = async (examData: any) => {
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

  return data;
};

export const updateExam = async (id: string, examData: any) => {
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

  return data;
};

export const deleteExam = async (id: string) => {
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
