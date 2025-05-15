import { api } from './api';
import { getDefaultLanguage } from '@/utils/language';

export interface PolicySettings {
  enabled: boolean;
  lastUpdated: string;
  version: string;
  content: string;
  requiresAcceptance: boolean;
  customization: {
    headerText: string;
    acceptButtonText: string;
    rejectButtonText: string;
    popupMessage: string;
  };
}

export interface CookiePolicyCustomization {
  headerText: string;
  bannerText: string;
  acceptAllButtonText: string;
  acceptSelectedButtonText: string;
  rejectAllButtonText: string;
  settingsButtonText: string;
}

export interface CookieType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export interface CookiePolicySettings extends Omit<PolicySettings, 'customization'> {
  showBanner: boolean;
  bannerPosition: BannerPosition;
  customization: CookiePolicyCustomization;
  cookieTypes: CookieType[];
}

export type BannerPosition = 'top' | 'bottom';

export interface SystemSettings {
  platformName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  currency: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure: boolean;
  smtpFromEmail?: string;
  smtpFromName?: string;
  emailNotificationsEnabled: boolean;
  emailSubscriptionsEnabled: boolean;
  spamProtectionEnabled: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
}

export interface EmailSubscription {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
}

const defaultSettings: SystemSettings = {
  platformName: 'CertQuest Arena',
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  smtpSecure: true,
  emailNotificationsEnabled: true,
  emailSubscriptionsEnabled: true,
  spamProtectionEnabled: true,
};

export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await api.get('/system-settings');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return defaultSettings;
    }
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const response = await api.put('/system-settings', settings);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  },

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get('/system-settings/email-templates');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar templates de email:', error);
      return [];
    }
  },

  async updateEmailTemplate(template: EmailTemplate): Promise<EmailTemplate> {
    try {
      const response = await api.put(`/system-settings/email-templates/${template.id}`, template);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar template de email:', error);
      throw error;
    }
  },

  async getEmailSubscriptions(): Promise<EmailSubscription[]> {
    try {
      const response = await api.get('/system-settings/email-subscriptions');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar assinaturas de email:', error);
      return [];
    }
  },

  async updateEmailSubscription(subscription: EmailSubscription): Promise<EmailSubscription> {
    try {
      const response = await api.put(`/system-settings/email-subscriptions/${subscription.id}`, subscription);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar assinatura de email:', error);
      throw error;
    }
  },

  async uploadLogo(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.post('/system-settings/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      throw error;
    }
  },

  async uploadFavicon(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('favicon', file);
      const response = await api.post('/system-settings/upload-favicon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload do favicon:', error);
      throw error;
    }
  },

  updatePageTitle(title: string): void {
    document.title = title;
  },

  updateFavicon(url: string): void {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = url;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = url;
      document.head.appendChild(newLink);
    }
  },

  updateThemeColors(primaryColor: string, secondaryColor: string): void {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
  },
}; 