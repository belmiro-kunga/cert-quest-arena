import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para a tabela users que ainda não existe no Supabase
interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    language?: string;
  };
}

type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
type UserUpdate = Partial<UserInsert>;

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar usuários:', error);
      return [];
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  },

  async createUser(user: UserInsert): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar usuário:', error);
      return null;
    }
  },

  async updateUser(id: string, user: UserUpdate): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar usuário:', error);
      return null;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar usuário:', error);
      return false;
    }
  },

  async updateUserStatus(id: string, status: User['status']): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status do usuário:', error);
      return null;
    }
  },

  async updateUserRole(id: string, role: User['role']): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar role do usuário:', error);
      return null;
    }
  },

  async updateUserPreferences(id: string, preferences: User['preferences']): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ preferences })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar preferências do usuário:', error);
      return null;
    }
  },

  async uploadAvatar(id: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      logger.error('Erro ao fazer upload do avatar:', error);
      return null;
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar usuários:', error);
      return [];
    }
  },

  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar usuários por role:', error);
      return [];
    }
  },

  async getUsersByStatus(status: User['status']): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar usuários por status:', error);
      return [];
    }
  }
};
