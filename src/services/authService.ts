import { supabaseService, supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';

export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

export interface AffiliateInfo {
  status: 'pending' | 'approved' | 'rejected' | null;
  earnings: number;
  referrals: number;
  link: string;
  applicationDate?: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: AuthError;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  affiliate: AffiliateInfo;
  photoURL?: string;
  twoFactorAuth?: TwoFactorAuth;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return {
        user: response.data.user,
        session: response.data.session,
        error: response.error
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { user: null, session: null, error: error as AuthError };
    }
  },

  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      return {
        user: response.data.user,
        session: response.data.session,
        error: response.error
      };
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      return { user: null, session: null, error: error as AuthError };
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }
  },

  async updateProfile(userData: Partial<User>): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userData.id)
        .select()
        .single();
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },

  async getAffiliateInfo(userId: string): Promise<AffiliateInfo> {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('status, earnings, referrals, link, application_date')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return {
          status: null,
          earnings: 0,
          referrals: 0,
          link: `${window.location.origin}/ref/${userId}`
        };
      }

      return {
        status: data.status,
        earnings: data.earnings,
        referrals: data.referrals,
        link: data.link,
        applicationDate: data.application_date
      };
    } catch (error) {
      console.error('Erro ao buscar informações de afiliado:', error);
      throw error;
    }
  }
}; 