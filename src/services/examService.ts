import { supabase } from '@/integrations/supabase/client';

const convertDatesToStrings = (examData: any) => {
  return {
    ...examData,
    discount_expires_at: examData.discount_expires_at instanceof Date 
      ? examData.discount_expires_at.toISOString() 
      : examData.discount_expires_at
  };
};

export const createExamService = async (examData: any) => {
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

export const updateExamService = async (id: string, examData: any) => {
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
