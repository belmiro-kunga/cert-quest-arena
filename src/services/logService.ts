import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para a tabela logs que ainda não existe no Supabase
interface Log {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

type LogInsert = Omit<Log, 'id' | 'created_at'>;

export const logService = {
  async getLogs(level?: Log['level'], startDate?: string, endDate?: string): Promise<Log[]> {
    try {
      let query = supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (level) {
        query = query.eq('level', level);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs:', error);
      return [];
    }
  },

  async getLogById(id: string): Promise<Log | null> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar log:', error);
      return null;
    }
  },

  async createLog(log: LogInsert): Promise<Log | null> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar log:', error);
      return null;
    }
  },

  async deleteLog(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar log:', error);
      return false;
    }
  },

  async deleteLogsByDateRange(startDate: string, endDate: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('logs')
        .delete()
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar logs por período:', error);
      return false;
    }
  },

  async getLogsByUser(userId: string): Promise<Log[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs do usuário:', error);
      return [];
    }
  },

  async getLogsByLevel(level: Log['level']): Promise<Log[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('level', level)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs por nível:', error);
      return [];
    }
  },

  async searchLogs(query: string): Promise<Log[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .or(`message.ilike.%${query}%,context.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs:', error);
      return [];
    }
  },

  async getLogStats(): Promise<{
    total: number;
    byLevel: Record<Log['level'], number>;
    byDate: Array<{ date: string; count: number }>;
  }> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('level, created_at');

      if (error) throw error;

      const logs = data || [];
      const byLevel = logs.reduce((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      }, {} as Record<Log['level'], number>);

      const byDate = logs.reduce((acc, log) => {
        const date = log.created_at.split('T')[0];
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, [] as Array<{ date: string; count: number }>);

      return {
        total: logs.length,
        byLevel,
        byDate: byDate.sort((a, b) => a.date.localeCompare(b.date))
      };
    } catch (error) {
      logger.error('Erro ao buscar estatísticas de logs:', error);
      return {
        total: 0,
        byLevel: { info: 0, warn: 0, error: 0, debug: 0 },
        byDate: []
      };
    }
  }
}; 