
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
    
    // Transform data to match the Student interface with type assertion
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email || '',  // Add default value
      plan_type: (profile.plan_type || 'free') as 'free' | 'basic' | 'premium',
      attempts_left: profile.attempts_left,
      progress: 0, // Default value
      achievements: 0, // Default value
      lastActive: profile.updated_at,
      exams: [], // Default value
      created_at: profile.created_at
    }));
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
        profiles(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(payment => {
      // Safe access of nested properties
      const profileName = payment.profiles && typeof payment.profiles === 'object' 
        ? (payment.profiles as any).name || 'Unknown User'
        : 'Unknown User';
      
      return {
        ...payment,
        userName: profileName,
        status: payment.status as 'pending' | 'completed' | 'failed' | 'refunded'
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

// Language management functions
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
