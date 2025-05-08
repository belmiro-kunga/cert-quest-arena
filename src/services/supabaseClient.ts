// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in your .env file (e.g., .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  // You might want to throw an error here or handle it more gracefully depending on your app's needs
  // For example, you could return a mock client or disable features that require Supabase.
  // However, for initial setup, throwing an error makes it clear what's wrong.
  throw new Error('Supabase client failed to initialize: URL or Anon Key missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
