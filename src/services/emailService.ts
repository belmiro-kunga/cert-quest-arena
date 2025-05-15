import { api } from './api';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface EmailSubscription {
  id: string;
  email: string;
  name?: string;
  preferences: {
    marketing: boolean;
    updates: boolean;
    notifications: boolean;
  };
  isActive: boolean;
}

export const emailService = {
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get('/email/templates');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar templates de email:', error);
      return [];
    }
  },

  async createTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    try {
      const response = await api.post('/email/templates', template);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar template de email:', error);
      throw error;
    }
  },

  async updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    try {
      const response = await api.put(`/email/templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar template de email:', error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      await api.delete(`/email/templates/${id}`);
    } catch (error) {
      console.error('Erro ao deletar template de email:', error);
      throw error;
    }
  },

  async getSubscriptions(): Promise<EmailSubscription[]> {
    try {
      const response = await api.get('/email/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar assinaturas de email:', error);
      return [];
    }
  },

  async createSubscription(subscription: Omit<EmailSubscription, 'id'>): Promise<EmailSubscription> {
    try {
      const response = await api.post('/email/subscriptions', subscription);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura de email:', error);
      throw error;
    }
  },

  async updateSubscription(id: string, subscription: Partial<EmailSubscription>): Promise<EmailSubscription> {
    try {
      const response = await api.put(`/email/subscriptions/${id}`, subscription);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar assinatura de email:', error);
      throw error;
    }
  },

  async deleteSubscription(id: string): Promise<void> {
    try {
      await api.delete(`/email/subscriptions/${id}`);
    } catch (error) {
      console.error('Erro ao deletar assinatura de email:', error);
      throw error;
    }
  },

  async sendEmail(to: string, templateId: string, variables: Record<string, string>): Promise<void> {
    try {
      await api.post('/email/send', {
        to,
        templateId,
        variables
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  },

  async sendBulkEmail(templateId: string, variables: Record<string, string>): Promise<void> {
    try {
      await api.post('/email/send-bulk', {
        templateId,
        variables
      });
    } catch (error) {
      console.error('Erro ao enviar emails em massa:', error);
      throw error;
    }
  },
};