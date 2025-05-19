import axios from 'axios';
import { ContentItem, ContentCategory, ContentTag } from '@/types/admin';
import { API_URL } from '@/config';

// Buscar todos os itens de conteúdo
export const fetchContentItems = async (type?: string): Promise<ContentItem[]> => {
  try {
    const url = type ? `${API_URL}/conteudo?type=${type}` : `${API_URL}/conteudo`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens de conteúdo:', error);
    return [];
  }
};

// Buscar um item de conteúdo por ID
export const fetchContentItemById = async (id: string): Promise<ContentItem | null> => {
  try {
    const response = await axios.get(`${API_URL}/conteudo/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar item de conteúdo ${id}:`, error);
    return null;
  }
};

// Criar um novo item de conteúdo
export const createContentItem = async (contentData: Partial<ContentItem>): Promise<ContentItem | null> => {
  try {
    const response = await axios.post(`${API_URL}/conteudo`, contentData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar item de conteúdo:', error);
    return null;
  }
};

// Atualizar um item de conteúdo existente
export const updateContentItem = async (id: string, contentData: Partial<ContentItem>): Promise<ContentItem | null> => {
  try {
    const response = await axios.put(`${API_URL}/conteudo/${id}`, contentData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar item de conteúdo ${id}:`, error);
    return null;
  }
};

// Excluir um item de conteúdo
export const deleteContentItem = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/conteudo/${id}`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir item de conteúdo ${id}:`, error);
    return false;
  }
};

// Buscar categorias de conteúdo
export const fetchContentCategories = async (): Promise<ContentCategory[]> => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};

// Buscar tags de conteúdo
export const fetchContentTags = async (): Promise<ContentTag[]> => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return [];
  }
};
