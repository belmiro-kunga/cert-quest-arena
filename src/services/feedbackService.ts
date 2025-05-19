import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para a tabela feedback que ainda não existe no Supabase
interface Feedback {
  id: string;
  user_id: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  tags?: string[];
  attachments?: string[];
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  metadata?: Record<string, any>;
}

interface FeedbackComment {
  id: string;
  feedback_id: string;
  user_id: string;
  content: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

type FeedbackInsert = Omit<Feedback, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>;
type FeedbackUpdate = Partial<FeedbackInsert>;
type FeedbackCommentInsert = Omit<FeedbackComment, 'id' | 'created_at' | 'updated_at'>;
type FeedbackCommentUpdate = Partial<FeedbackCommentInsert>;

export const feedbackService = {
  // Métodos para Feedback
  async getAllFeedback(status?: Feedback['status'], type?: Feedback['type']): Promise<Feedback[]> {
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar feedback:', error);
      return [];
    }
  },

  async getFeedbackById(id: string): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar feedback:', error);
      return null;
    }
  },

  async createFeedback(feedback: FeedbackInsert): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert(feedback)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar feedback:', error);
      return null;
    }
  },

  async updateFeedback(id: string, feedback: FeedbackUpdate): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update(feedback)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar feedback:', error);
      return null;
    }
  },

  async deleteFeedback(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar feedback:', error);
      return false;
    }
  },

  async updateFeedbackStatus(id: string, status: Feedback['status']): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status do feedback:', error);
      return null;
    }
  },

  async uploadAttachment(id: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `feedback/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('feedback')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('feedback')
        .getPublicUrl(filePath);

      const { data: feedback } = await this.getFeedbackById(id);
      if (!feedback) throw new Error('Feedback não encontrado');

      const attachments = [...(feedback.attachments || []), publicUrl];
      const { error: updateError } = await supabase
        .from('feedback')
        .update({ attachments })
        .eq('id', id);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      logger.error('Erro ao fazer upload do anexo:', error);
      return null;
    }
  },

  async searchFeedback(query: string): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar feedback:', error);
      return [];
    }
  },

  // Métodos para Comentários
  async getFeedbackComments(feedbackId: string): Promise<FeedbackComment[]> {
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .select('*')
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar comentários:', error);
      return [];
    }
  },

  async createComment(comment: FeedbackCommentInsert): Promise<FeedbackComment | null> {
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .insert(comment)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar comentário:', error);
      return null;
    }
  },

  async updateComment(id: string, comment: FeedbackCommentUpdate): Promise<FeedbackComment | null> {
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .update(comment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar comentário:', error);
      return null;
    }
  },

  async deleteComment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feedback_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar comentário:', error);
      return false;
    }
  },

  async uploadCommentAttachment(commentId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${commentId}-${Math.random()}.${fileExt}`;
      const filePath = `feedback/comments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('feedback')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('feedback')
        .getPublicUrl(filePath);

      const { data: comment } = await supabase
        .from('feedback_comments')
        .select('*')
        .eq('id', commentId)
        .single();

      if (!comment) throw new Error('Comentário não encontrado');

      const attachments = [...(comment.attachments || []), publicUrl];
      const { error: updateError } = await supabase
        .from('feedback_comments')
        .update({ attachments })
        .eq('id', commentId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      logger.error('Erro ao fazer upload do anexo do comentário:', error);
      return null;
    }
  }
}; 