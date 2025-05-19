import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para a tabela notifications que ainda não existe no Supabase
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  status: 'unread' | 'read' | 'archived';
  link?: string;
  icon?: string;
  created_at: string;
  read_at?: string;
  metadata?: Record<string, any>;
}

type NotificationInsert = Omit<Notification, 'id' | 'created_at' | 'read_at'>;
type NotificationUpdate = Partial<NotificationInsert>;

export const notificationService = {
  async getAllNotifications(userId: string, status?: Notification['status']): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar notificações:', error);
      return [];
    }
  },

  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar notificação:', error);
      return null;
    }
  },

  async createNotification(notification: NotificationInsert): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar notificação:', error);
      return null;
    }
  },

  async updateNotification(id: string, notification: NotificationUpdate): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update(notification)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar notificação:', error);
      return null;
    }
  },

  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar notificação:', error);
      return false;
    }
  },

  async markAsRead(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao marcar notificação como lida:', error);
      return null;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'unread');

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao marcar todas notificações como lidas:', error);
      return false;
    }
  },

  async archiveNotification(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao arquivar notificação:', error);
      return null;
    }
  },

  async archiveAllNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'archived' })
        .eq('user_id', userId)
        .in('status', ['unread', 'read']);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao arquivar todas notificações:', error);
      return false;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'unread');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      logger.error('Erro ao buscar contagem de notificações não lidas:', error);
      return 0;
    }
  },

  async deleteOldNotifications(userId: string, days: number): Promise<boolean> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', date.toISOString());

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar notificações antigas:', error);
      return false;
    }
  }
}; 