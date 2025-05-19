import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';
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
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireSpecial: boolean;
  passwordRequireNumber: boolean;
  passwordRequireUppercase: boolean;
  sessionTimeout: number;
  spamProtectionEnabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailSubscription {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos locais para as tabelas que ainda não existem no Supabase
interface Settings {
  id: string;
  key: string;
  value: any;
  description: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

type SettingsInsert = Omit<Settings, 'id' | 'created_at' | 'updated_at'>;
type SettingsUpdate = Partial<SettingsInsert>;

export const settingsService = {
  async getAllSettings(): Promise<Settings[]> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar configurações:', error);
      return [];
    }
  },

  async getSetting(key: string): Promise<Settings | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar configuração:', error);
      return null;
    }
  },

  async updateSetting(key: string, value: any): Promise<Settings | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar configuração:', error);
      return null;
    }
  },

  async createSetting(setting: SettingsInsert): Promise<Settings | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .insert(setting)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar configuração:', error);
      return null;
    }
  },

  async deleteSetting(key: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('settings')
        .delete()
        .eq('key', key);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao deletar configuração:', error);
      return false;
    }
  },

  async getSettingsByPrefix(prefix: string): Promise<Settings[]> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .ilike('key', `${prefix}%`)
        .order('key', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar configurações por prefixo:', error);
      return [];
    }
  },

  async updateMultipleSettings(settings: Record<string, any>): Promise<boolean> {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro ao atualizar múltiplas configurações:', error);
      return false;
    }
  },

  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || {
        id: 'default',
        siteName: 'Cert Quest Arena',
        siteDescription: 'Plataforma de simulados para certificações',
        logoUrl: '/logo.png',
        faviconUrl: '/favicon.ico',
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
        language: getDefaultLanguage(),
        timezone: 'America/Sao_Paulo',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        passwordRequireNumber: true,
        passwordRequireUppercase: true,
        sessionTimeout: 30,
        spamProtectionEnabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Erro ao buscar configurações do sistema:', error);
      throw error;
    }
  },

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'default')
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar configurações do sistema:', error);
      throw error;
    }
  },

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar templates de email:', error);
      return [];
    }
  },

  async updateEmailTemplate(template: EmailTemplate): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update({
          ...template,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar template de email:', error);
      return null;
    }
  },

  async getEmailSubscriptions(): Promise<EmailSubscription[]> {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar assinaturas de email:', error);
      return [];
    }
  },

  async updateEmailSubscription(subscription: EmailSubscription): Promise<EmailSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .update({
          ...subscription,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar assinatura de email:', error);
      return null;
    }
  },

  async uploadLogo(file: File): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('system-settings')
        .upload('logo', file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      return data.path;
    } catch (error) {
      logger.error('Erro ao fazer upload do logo:', error);
      throw error;
    }
  },

  async uploadFavicon(file: File): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('system-settings')
        .upload('favicon', file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      return data.path;
    } catch (error) {
      logger.error('Erro ao fazer upload do favicon:', error);
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