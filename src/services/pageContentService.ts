import axios from 'axios';
import { API_URL } from '@/config';

// Tipos para as páginas institucionais
export interface Section {
  _id?: string;
  sectionKey: string;
  title: string;
  content: string;
  order: number;
}

export interface ContactInfo {
  emails: Array<{ label: string; email: string }>;
  phones: Array<{ label: string; number: string }>;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialMedia: Array<{ platform: string; url: string }>;
}

export interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
}

export interface PageContent {
  _id?: string;
  pageKey: 'about' | 'contact';
  title: string;
  subtitle: string;
  sections: Section[];
  contactInfo?: ContactInfo;
  faqs?: FAQ[];
  lastUpdated: Date;
  updatedBy?: string;
}

// Serviço para gerenciar o conteúdo das páginas
const pageContentService = {
  // Obter conteúdo de uma página específica
  getPageContent: async (pageKey: 'about' | 'contact'): Promise<PageContent> => {
    try {
      const response = await axios.get(`${API_URL}/pages/${pageKey}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter conteúdo da página ${pageKey}:`, error);
      throw error;
    }
  },

  // Listar todas as páginas disponíveis (admin)
  listPages: async (): Promise<PageContent[]> => {
    try {
      const response = await axios.get(`${API_URL}/pages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar páginas:', error);
      throw error;
    }
  },

  // Atualizar conteúdo de uma página (admin)
  updatePageContent: async (pageKey: 'about' | 'contact', data: Partial<PageContent>): Promise<PageContent> => {
    try {
      const response = await axios.put(`${API_URL}/pages/${pageKey}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar página ${pageKey}:`, error);
      throw error;
    }
  },

  // Adicionar uma nova seção a uma página (admin)
  addSection: async (pageKey: 'about' | 'contact', section: Omit<Section, '_id'>): Promise<PageContent> => {
    try {
      const response = await axios.post(`${API_URL}/pages/${pageKey}/sections`, section, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar seção à página ${pageKey}:`, error);
      throw error;
    }
  },

  // Atualizar uma seção específica (admin)
  updateSection: async (
    pageKey: 'about' | 'contact', 
    sectionKey: string, 
    data: Partial<Omit<Section, '_id' | 'sectionKey'>>
  ): Promise<PageContent> => {
    try {
      const response = await axios.put(`${API_URL}/pages/${pageKey}/sections/${sectionKey}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar seção ${sectionKey}:`, error);
      throw error;
    }
  },

  // Remover uma seção (admin)
  removeSection: async (pageKey: 'about' | 'contact', sectionKey: string): Promise<{ message: string; page: PageContent }> => {
    try {
      const response = await axios.delete(`${API_URL}/pages/${pageKey}/sections/${sectionKey}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover seção ${sectionKey}:`, error);
      throw error;
    }
  },

  // Adicionar FAQ (admin)
  addFAQ: async (faq: Omit<FAQ, '_id'>): Promise<PageContent> => {
    try {
      const response = await axios.post(`${API_URL}/pages/contact/faqs`, faq, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar FAQ:', error);
      throw error;
    }
  },

  // Atualizar FAQ (admin)
  updateFAQ: async (faqId: string, data: Partial<Omit<FAQ, '_id'>>): Promise<PageContent> => {
    try {
      const response = await axios.put(`${API_URL}/pages/contact/faqs/${faqId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar FAQ ${faqId}:`, error);
      throw error;
    }
  },

  // Remover FAQ (admin)
  removeFAQ: async (faqId: string): Promise<{ message: string; page: PageContent }> => {
    try {
      const response = await axios.delete(`${API_URL}/pages/contact/faqs/${faqId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover FAQ ${faqId}:`, error);
      throw error;
    }
  },

  // Atualizar informações de contato (admin)
  updateContactInfo: async (data: Partial<ContactInfo>): Promise<PageContent> => {
    try {
      const response = await axios.put(`${API_URL}/pages/contact/info`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar informações de contato:', error);
      throw error;
    }
  }
};

export default pageContentService;
