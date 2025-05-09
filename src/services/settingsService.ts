import { supabase } from '@/lib/supabase';
import { getDefaultLanguage } from '@/utils/language';

export interface SystemSettings {
  id: string;
  platformName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  currency: string;
  // Email Settings
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
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSubscription {
  id: string;
  email: string;
  name?: string;
  preferences: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }

    // Se não houver configurações, cria com valores padrão
    if (!data) {
      return this.createDefaultSettings();
    }

    return {
      id: data.id,
      platformName: data.platform_name,
      logoUrl: data.logo_url,
      faviconUrl: data.favicon_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      language: data.language,
      timezone: data.timezone,
      currency: data.currency,
      smtpHost: data.smtp_host,
      smtpPort: data.smtp_port,
      smtpUsername: data.smtp_username,
      smtpPassword: data.smtp_password,
      smtpSecure: data.smtp_secure,
      smtpFromEmail: data.smtp_from_email,
      smtpFromName: data.smtp_from_name,
      emailNotificationsEnabled: data.email_notifications_enabled,
      emailSubscriptionsEnabled: data.email_subscriptions_enabled,
      spamProtectionEnabled: data.spam_protection_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createDefaultSettings(): Promise<SystemSettings> {
    const defaultSettings = {
      platform_name: 'CertQuest Arena',
      primary_color: '#2563eb',
      secondary_color: '#1e40af',
      language: getDefaultLanguage(),
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      smtp_secure: true,
      email_notifications_enabled: true,
      email_subscriptions_enabled: true,
      spam_protection_enabled: true,
    };

    const { data, error } = await supabase
      .from('system_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar configurações padrão:', error);
      throw error;
    }

    return {
      id: data.id,
      platformName: data.platform_name,
      logoUrl: data.logo_url,
      faviconUrl: data.favicon_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      language: data.language,
      timezone: data.timezone,
      currency: data.currency,
      smtpHost: data.smtp_host,
      smtpPort: data.smtp_port,
      smtpUsername: data.smtp_username,
      smtpPassword: data.smtp_password,
      smtpSecure: data.smtp_secure,
      smtpFromEmail: data.smtp_from_email,
      smtpFromName: data.smtp_from_name,
      emailNotificationsEnabled: data.email_notifications_enabled,
      emailSubscriptionsEnabled: data.email_subscriptions_enabled,
      spamProtectionEnabled: data.spam_protection_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const { data: currentSettings } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (!currentSettings) {
      throw new Error('Configurações não encontradas');
    }

    const updateData = {
      platform_name: settings.platformName,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      language: settings.language,
      timezone: settings.timezone,
      currency: settings.currency,
      smtp_host: settings.smtpHost,
      smtp_port: settings.smtpPort,
      smtp_username: settings.smtpUsername,
      smtp_password: settings.smtpPassword,
      smtp_secure: settings.smtpSecure,
      smtp_from_email: settings.smtpFromEmail,
      smtp_from_name: settings.smtpFromName,
      email_notifications_enabled: settings.emailNotificationsEnabled,
      email_subscriptions_enabled: settings.emailSubscriptionsEnabled,
      spam_protection_enabled: settings.spamProtectionEnabled,
    };

    const { data, error } = await supabase
      .from('system_settings')
      .update(updateData)
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }

    return {
      id: data.id,
      platformName: data.platform_name,
      logoUrl: data.logo_url,
      faviconUrl: data.favicon_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      language: data.language,
      timezone: data.timezone,
      currency: data.currency,
      smtpHost: data.smtp_host,
      smtpPort: data.smtp_port,
      smtpUsername: data.smtp_username,
      smtpPassword: data.smtp_password,
      smtpSecure: data.smtp_secure,
      smtpFromEmail: data.smtp_from_email,
      smtpFromName: data.smtp_from_name,
      emailNotificationsEnabled: data.email_notifications_enabled,
      emailSubscriptionsEnabled: data.email_subscriptions_enabled,
      spamProtectionEnabled: data.spam_protection_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar templates de email:', error);
      throw error;
    }

    return data.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      isActive: template.is_active,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    }));
  },

  async updateEmailTemplate(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update({
        name: template.name,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        is_active: template.isActive,
      })
      .eq('id', template.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar template de email:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      body: data.body,
      variables: data.variables,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Email Subscriptions
  async getEmailSubscriptions(): Promise<EmailSubscription[]> {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .select('*')
      .order('email');

    if (error) {
      console.error('Erro ao buscar assinaturas de email:', error);
      throw error;
    }

    return data.map(subscription => ({
      id: subscription.id,
      email: subscription.email,
      name: subscription.name,
      preferences: subscription.preferences,
      isActive: subscription.is_active,
      createdAt: subscription.created_at,
      updatedAt: subscription.updated_at,
    }));
  },

  async updateEmailSubscription(subscription: Partial<EmailSubscription>): Promise<EmailSubscription> {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .update({
        email: subscription.email,
        name: subscription.name,
        preferences: subscription.preferences,
        is_active: subscription.isActive,
      })
      .eq('id', subscription.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar assinatura de email:', error);
      throw error;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      preferences: data.preferences,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async uploadLogo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('system')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload do logo:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('system')
      .getPublicUrl(filePath);

    // Atualiza o URL do logo nas configurações
    const { data: currentSettings } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (currentSettings) {
      await supabase
        .from('system_settings')
        .update({ logo_url: publicUrl })
        .eq('id', currentSettings.id);
    }

    return publicUrl;
  },

  async uploadFavicon(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `favicon-${Date.now()}.${fileExt}`;
    const filePath = `favicons/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('system')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload do favicon:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('system')
      .getPublicUrl(filePath);

    // Atualiza o URL do favicon nas configurações
    const { data: currentSettings } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (currentSettings) {
      await supabase
        .from('system_settings')
        .update({ favicon_url: publicUrl })
        .eq('id', currentSettings.id);
    }

    return publicUrl;
  },

  // Função para atualizar o título da página
  updatePageTitle(title: string) {
    document.title = title;
  },

  // Função para atualizar o favicon
  updateFavicon(url: string) {
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = url;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = url;
      document.head.appendChild(newFavicon);
    }
  },

  // Função para atualizar as cores do tema
  updateThemeColors(primaryColor: string, secondaryColor: string) {
    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--secondary', secondaryColor);
  },
}; 