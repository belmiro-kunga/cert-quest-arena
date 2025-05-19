import { createClient, SupabaseClient, AuthChangeEvent } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Environment validation
const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

// Type for environment variables
type EnvVarKey = keyof typeof requiredEnvVars;

// Custom error for environment configuration
class SupabaseConfigError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'SupabaseConfigError';
  }
}

// Environment validation function
function validateEnvironment(): void {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new SupabaseConfigError(
      `Missing required environment variables: ${missingVars.join(', ')}`,
      'MISSING_ENV_VARS',
      { missingVars }
    );
  }

  // Validate URL format
  const url = requiredEnvVars.VITE_SUPABASE_URL;
  try {
    new URL(url!);
  } catch (error) {
    throw new SupabaseConfigError(
      'Invalid Supabase URL format',
      'INVALID_URL',
      { url }
    );
  }

  // Validate anon key format (should be a JWT-like string)
  const anonKey = requiredEnvVars.VITE_SUPABASE_ANON_KEY;
  if (!anonKey?.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
    throw new SupabaseConfigError(
      'Invalid Supabase anon key format',
      'INVALID_ANON_KEY'
    );
  }
}

// Client configuration
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'cert-quest-arena',
      'x-application-version': import.meta.env.npm_package_version || '1.0.0'
    }
  }
} as const;

// Client singleton
class SupabaseClientManager {
  private static instance: SupabaseClientManager;
  private client: SupabaseClient<Database> | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager();
    }
    return SupabaseClientManager.instance;
  }

  public initialize(): SupabaseClient<Database> {
    if (this.isInitialized && this.client) {
      return this.client;
    }

    try {
      validateEnvironment();

      this.client = createClient<Database>(
        requiredEnvVars.VITE_SUPABASE_URL!,
        requiredEnvVars.VITE_SUPABASE_ANON_KEY!,
        supabaseConfig
      );

      this.isInitialized = true;
      return this.client;
    } catch (error) {
      if (error instanceof SupabaseConfigError) {
        throw error;
      }
      throw new SupabaseConfigError(
        'Failed to initialize Supabase client',
        'INITIALIZATION_ERROR',
        error
      );
    }
  }

  public getClient(): SupabaseClient<Database> {
    if (!this.isInitialized || !this.client) {
      return this.initialize();
    }
    return this.client;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient();
      const { data, error } = await client.from('health_check').select('*').limit(1);
      
      if (error) {
        console.error('Supabase health check failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Supabase health check error:', error);
      return false;
    }
  }

  public reset(): void {
    this.client = null;
    this.isInitialized = false;
  }
}

// Create and export singleton instance
const manager = SupabaseClientManager.getInstance();

// Export initialized client
export const supabase = manager.getClient();

// Export manager for advanced usage
export { manager };

// Export types
export type { Database } from '@/types/supabase';
export type { SupabaseClient } from '@supabase/supabase-js';

// Export error type
export { SupabaseConfigError };

// Helper function to check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Helper function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return !!session;
};

// Helper function to handle auth state changes
export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

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