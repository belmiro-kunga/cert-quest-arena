import { supabase } from '@/integrations/supabase/client';
import { Payment } from '@/types/payment';
import { Student } from '@/types/admin';

export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        status,
        method,
        created_at,
        updated_at,
        order_id,
        transaction_id,
        user_id,
        profiles!payments_user_id_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    // Transform data to match Payment type
    return data.map(payment => ({
      id: payment.id,
      userId: payment.user_id,
      userName: payment.profiles?.name || 'Unknown User',
      amount: payment.amount,
      status: payment.status as 'pending' | 'completed' | 'failed',
      method: payment.method,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
      orderId: payment.order_id || undefined,
      transactionId: payment.transaction_id || undefined
    }));
  } catch (error) {
    console.error('Error in fetchPayments:', error);
    return [];
  }
};

export const fetchStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      user_id,
      name,
      photo_url,
      created_at,
      updated_at,
      plan_type,
      attempts_left,
      exam_attempts(count)
    `)
    .eq('role', 'user');

  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

  // Transform data to match Student type
  return data.map(student => ({
    id: student.user_id,
    name: student.name,
    email: '', // We don't have access to emails directly due to Supabase security
    progress: 0, // This would need to be calculated based on completed exams
    achievements: 0, // This would need a separate query or join
    lastActive: student.updated_at,
    photo: student.photo_url || '',
    plan: student.plan_type,
    attemptsLeft: student.attempts_left,
    attemptsCount: student.exam_attempts?.length || 0
  }));
};

export const updateExamService = async (id: string, examData: any) => {
  const { data, error } = await supabase
    .from('exams')
    .update(examData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating exam:', error);
    throw error;
  }

  return data;
};

export const createExamService = async (examData: any) => {
  const { data, error } = await supabase
    .from('exams')
    .insert(examData)
    .select()
    .single();

  if (error) {
    console.error('Error creating exam:', error);
    throw error;
  }

  return data;
};

export const deleteExamService = async (id: string) => {
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
