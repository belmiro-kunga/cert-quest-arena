import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Erro ao buscar perfil do usuário: ' + error.message);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Perfil atualizado com sucesso');
    return data;
  } catch (error: any) {
    toast.error('Erro ao atualizar perfil: ' + error.message);
    return null;
  }
}

export async function createPayment(paymentData: any) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Erro ao criar pagamento: ' + error.message);
    throw error;
  }
}

export async function fetchExams() {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Erro ao buscar simulados: ' + error.message);
    return [];
  }
}

export async function fetchExamAttempts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('exam_attempts')
      .select(`
        *,
        exams (
          id,
          title,
          passing_score
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Erro ao buscar tentativas de simulado: ' + error.message);
    return [];
  }
}
