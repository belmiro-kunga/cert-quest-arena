import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Helper functions for common operations
export const supabaseService = {
  // Auth helpers
  auth: {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },
    signUp: async (email: string, password: string, metadata?: { name: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    getSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    getUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  },

  // Database helpers
  db: {
    // Generic query helper
    query: async <T = any>(table: string, query: any) => {
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .match(query.match || {})
        .order(query.orderBy || 'created_at', { ascending: query.ascending ?? false })
        .limit(query.limit || 1000);
      
      if (error) throw error;
      return data as T[];
    },

    // Insert helper
    insert: async <T = any>(table: string, data: Partial<T>) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result as T;
    },

    // Update helper
    update: async <T = any>(table: string, id: string | number, data: Partial<T>) => {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .match({ id })
        .select()
        .single();
      
      if (error) throw error;
      return result as T;
    },

    // Delete helper
    delete: async (table: string, id: string | number) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .match({ id });
      
      if (error) throw error;
    }
  },

  // Storage helpers
  storage: {
    uploadFile: async (bucket: string, path: string, file: File) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      return data;
    },
    
    getPublicUrl: (bucket: string, path: string) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return data.publicUrl;
    },
    
    deleteFile: async (bucket: string, path: string) => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
    }
  }
}; 