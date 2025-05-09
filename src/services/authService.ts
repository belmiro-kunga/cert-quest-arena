import { supabase } from '@/lib/supabase';
import { emailService } from './emailService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      // Registra o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        console.error('Erro ao registrar usuário:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não criado');
      }

      // Cria o perfil do usuário
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        name,
        role: 'user',
      });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }

      // Envia email de confirmação
      await emailService.sendRegistrationConfirmation(
        email,
        name,
        authData.session?.access_token || ''
      );

      return {
        id: authData.user.id,
        email: authData.user.email!,
        name,
        role: 'user',
        createdAt: authData.user.created_at,
        updatedAt: authData.user.updated_at,
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      // Busca o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        name: profile.name,
        role: profile.role,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao buscar usuário atual:', error);
        throw error;
      }

      if (!user) {
        return null;
      }

      // Busca o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      return {
        id: user.id,
        email: user.email!,
        name: profile.name,
        role: profile.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      // Busca o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      // Gera o token de recuperação
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
        throw error;
      }

      // Envia email de recuperação
      await emailService.sendPasswordRecovery(
        email,
        profile.name,
        data?.user?.id || ''
      );
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      throw error;
    }
  },

  async updatePassword(password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro na atualização de senha:', error);
      throw error;
    }
  },
}; 