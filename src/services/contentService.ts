import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Tipos locais para as tabelas de conteúdo que ainda não existem no Supabase
interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: 'article' | 'page' | 'post';
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  category_id?: string;
  tags?: string[];
  featured_image?: string;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  metadata?: Record<string, any>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

type ContentInsert = Omit<Content, 'id' | 'created_at' | 'updated_at'>;
type ContentUpdate = Partial<ContentInsert>;
type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
type CategoryUpdate = Partial<CategoryInsert>;
type TagInsert = Omit<Tag, 'id' | 'created_at' | 'updated_at'>;
type TagUpdate = Partial<TagInsert>;

export const contentService = {
  // Métodos para Conteúdo
  async getAllContent(type?: Content['type'], status?: Content['status']): Promise<Content[]> {
    try {
      let query = supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar conteúdo:', error);
      return [];
    }
  },

  async getContentById(id: string): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar conteúdo:', error);
      return null;
    }
  },

  async getContentBySlug(slug: string): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar conteúdo por slug:', error);
      return null;
    }
  },

  async createContent(content: ContentInsert): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .insert(content)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar conteúdo:', error);
      return null;
    }
  },

  async updateContent(id: string, content: ContentUpdate): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update(content)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar conteúdo:', error);
      return null;
    }
  },

  async deleteContent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar conteúdo:', error);
      return false;
    }
  },

  async updateContentStatus(id: string, status: Content['status']): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({ status, published_at: status === 'published' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar status do conteúdo:', error);
      return null;
    }
  },

  async uploadFeaturedImage(id: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('content')
        .update({ featured_image: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      logger.error('Erro ao fazer upload da imagem destacada:', error);
      return null;
    }
  },

  async searchContent(query: string): Promise<Content[]> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar conteúdo:', error);
      return [];
    }
  },

  // Métodos para Categorias
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar categoria:', error);
      return null;
    }
  },

  async createCategory(category: CategoryInsert): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar categoria:', error);
      return null;
    }
  },

  async updateCategory(id: string, category: CategoryUpdate): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar categoria:', error);
      return null;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar categoria:', error);
      return false;
    }
  },

  // Métodos para Tags
  async getAllTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar tags:', error);
      return [];
    }
  },

  async getTagById(id: string): Promise<Tag | null> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar tag:', error);
      return null;
    }
  },

  async createTag(tag: TagInsert): Promise<Tag | null> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar tag:', error);
      return null;
    }
  },

  async updateTag(id: string, tag: TagUpdate): Promise<Tag | null> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update(tag)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar tag:', error);
      return null;
    }
  },

  async deleteTag(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar tag:', error);
      return false;
    }
  }
};
