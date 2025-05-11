import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Verificar se as variáveis de ambiente estão definidas
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

// Criar o cliente do Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
