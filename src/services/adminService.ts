
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Student, Payment, SystemConfig } from '@/types/admin';

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

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
        user_id,
        profiles!inner(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(payment => ({
      ...payment,
      userName: payment.profiles.name
    })) || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

// Novas funções para gerenciar idiomas
export const fetchLanguages = async () => {
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
};

export const createLanguage = async (language: { code: string; name: string; flag: string }) => {
  try {
    const { data, error } = await supabase
      .from('languages')
      .insert([language])
      .select();
    
    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error('Error creating language:', error);
    throw error;
  }
};

export const updateLanguage = async (language: { code: string; name: string; flag: string }) => {
  try {
    const { data, error } = await supabase
      .from('languages')
      .update({ name: language.name, flag: language.flag })
      .eq('code', language.code)
      .select();
    
    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error('Error updating language:', error);
    throw error;
  }
};

export const deleteLanguage = async (code: string) => {
  try {
    const { error } = await supabase
      .from('languages')
      .delete()
      .eq('code', code);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};
