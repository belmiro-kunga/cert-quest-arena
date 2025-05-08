import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Create a Supabase client for admin operations
const SUPABASE_URL = "https://zspfwjmesflujextcvco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcGZ3am1lc2ZsdWpleHRjdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjcyOTcsImV4cCI6MjA2MjEwMzI5N30.DGGoB0lAtYKlz8vYtmPeMoXIIL1oUnNMVF4Jv5vY7Mg";

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to create an admin user
export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    // Create user in Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });
    
    if (userError) throw userError;
    
    if (userData.user) {
      // Create admin profile with role set to 'admin'
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            user_id: userData.user.id,
            name,
            plan_type: 'enterprise',
            attempts_left: 999,
            role: 'admin',
          }
        ])
        .select()
        .single();
        
      if (profileError) throw profileError;
      
      return { user: userData.user, profile: profileData };
    }
    
    throw new Error('Failed to create admin user');
  } catch (error: any) {
    toast.error('Erro ao criar usuário administrador: ' + error.message);
    throw error;
  }
};

// Function to create a regular user
export const createRegularUser = async (email: string, password: string, name: string) => {
  try {
    // Create user in Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });
    
    if (userError) throw userError;
    
    if (userData.user) {
      // Create regular profile with role set to 'user'
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            user_id: userData.user.id,
            name,
            plan_type: 'free',
            attempts_left: 3,
            role: 'user',
          }
        ])
        .select()
        .single();
        
      if (profileError) throw profileError;
      
      return { user: userData.user, profile: profileData };
    }
    
    throw new Error('Failed to create regular user');
  } catch (error: any) {
    toast.error('Erro ao criar usuário regular: ' + error.message);
    throw error;
  }
};

// Function to initialize default users
export const initializeDefaultUsers = async () => {
  try {
    // Check if admin exists
    const { data: admins } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'admin');
      
    if (!admins || admins.length === 0) {
      // No admin found, create one
      await createAdminUser('admin@certquest.com', 'admin123', 'Admin CertQuest');
      toast.success('Usuário administrador criado: admin@certquest.com / admin123');
    }
    
    // Check if regular user exists
    const { data: regularUsers } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('plan_type', 'free')
      .limit(1);
      
    if (!regularUsers || regularUsers.length === 0) {
      // No regular user found, create one
      await createRegularUser('user@certquest.com', 'user123', 'Usuário CertQuest');
      toast.success('Usuário regular criado: user@certquest.com / user123');
    }
    
    return { success: true };
  } catch (error: any) {
    toast.error('Erro ao inicializar usuários padrão: ' + error.message);
    return { success: false, error };
  }
};
