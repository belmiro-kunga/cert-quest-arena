
import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the other Supabase client
const SUPABASE_URL = "https://zspfwjmesflujextcvco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcGZ3am1lc2ZsdWpleHRjdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjcyOTcsImV4cCI6MjA2MjEwMzI5N30.DGGoB0lAtYKlz8vYtmPeMoXIIL1oUnNMVF4Jv5vY7Mg";

console.log("Creating Supabase client in lib/supabase.ts with URL:", SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos úteis para o sistema
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  phone?: string;
  plan_type: 'free' | 'premium' | 'enterprise';
  attempts_left: number;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user';
}

// Helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}; 
