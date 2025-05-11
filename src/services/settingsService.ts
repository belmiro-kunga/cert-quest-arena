import { supabase } from '@/lib/supabase';
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
  platformName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  currency: string;
  // Email Settings
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUsername: string | null;
  smtpPassword: string | null;
  smtpSecure: boolean;
  smtpFromEmail: string | null;
  smtpFromName: string | null;
  emailNotificationsEnabled: boolean;
  emailSubscriptionsEnabled: boolean;
  spamProtectionEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  privacyPolicy: PolicySettings;
  termsOfUse: PolicySettings;
  cookiePolicy: CookiePolicySettings;
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

export const defaultPolicySettings: PolicySettings = {
  enabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  version: '1.0',
  content: '',
  requiresAcceptance: true,
  customization: {
    headerText: '',
    acceptButtonText: 'Aceitar',
    rejectButtonText: 'Rejeitar',
    popupMessage: '',
  },
};

export const defaultCookiePolicy: CookiePolicySettings = {
  enabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  version: '1.0',
  content: '',
  requiresAcceptance: true,
  showBanner: true,
  bannerPosition: 'bottom',
  customization: {
    headerText: 'Política de Cookies',
    bannerText: 'Utilizamos cookies para melhorar sua experiência. Escolha quais tipos de cookies aceitar.',
    acceptAllButtonText: 'Aceitar Todos',
    acceptSelectedButtonText: 'Aceitar Selecionados',
    rejectAllButtonText: 'Rejeitar Todos',
    settingsButtonText: 'Configurações',
  },
  cookieTypes: [
    {
      id: 'essential',
      name: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site.',
      required: true,
      enabled: true,
    },
    {
      id: 'performance',
      name: 'Cookies de Desempenho',
      description: 'Ajudam a melhorar a experiência coletando informações anônimas.',
      required: false,
      enabled: true,
    },
    {
      id: 'functional',
      name: 'Cookies de Funcionalidade',
      description: 'Permitem que o site lembre suas preferências.',
      required: false,
      enabled: true,
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Usados para rastrear visitantes entre sites para publicidade.',
      required: false,
      enabled: false,
    },
  ],
};

export const defaultSystemSettings: SystemSettings = {
  id: '1',
  platformName: 'Cert Quest Arena',
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  language: getDefaultLanguage(),
  timezone: 'UTC',
  currency: 'USD',
  smtpHost: null,
  smtpPort: null,
  smtpUsername: null,
  smtpPassword: null,
  smtpSecure: true,
  smtpFromEmail: null,
  smtpFromName: null,
  emailNotificationsEnabled: false,
  emailSubscriptionsEnabled: false,
  spamProtectionEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  privacyPolicy: defaultPolicySettings,
  termsOfUse: defaultPolicySettings,
  cookiePolicy: defaultCookiePolicy,
};

// Define settings service
export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error) throw error;

    if (!data) {
      return this.createDefaultSettings();
    }

    const settings: SystemSettings = {
      id: data.id,
      platformName: data.platform_name || 'Cert Quest Arena',
      logoUrl: data.logo_url,
      faviconUrl: data.favicon_url,
      primaryColor: data.primary_color || '#007bff',
      secondaryColor: data.secondary_color || '#6c757d',
      language: data.language || getDefaultLanguage(),
      timezone: data.timezone || 'UTC',
      currency: data.currency || 'USD',
      smtpHost: data.smtp_host,
      smtpPort: data.smtp_port,
      smtpUsername: data.smtp_username,
      smtpPassword: data.smtp_password,
      smtpSecure: data.smtp_secure ?? true,
      smtpFromEmail: data.smtp_from_email,
      smtpFromName: data.smtp_from_name,
      emailNotificationsEnabled: data.email_notifications_enabled ?? false,
      emailSubscriptionsEnabled: data.email_subscriptions_enabled ?? false,
      spamProtectionEnabled: data.spam_protection_enabled ?? true,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      privacyPolicy: data.privacy_policy || defaultPolicySettings,
      termsOfUse: data.terms_of_use || defaultPolicySettings,
      cookiePolicy: data.cookie_policy || defaultCookiePolicy
    };

    return settings;
  },

  async createDefaultSettings(): Promise<SystemSettings> {
    const defaultPolicySettings: PolicySettings = {
      enabled: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0',
      content: '',
      requiresAcceptance: true,
      customization: {
        headerText: '',
        acceptButtonText: 'Aceitar',
        rejectButtonText: 'Rejeitar',
        popupMessage: '',
      },
    };

    const defaultCookiePolicy: CookiePolicySettings = {
      ...defaultPolicySettings,
      showBanner: true,
      bannerPosition: 'bottom',
      customization: {
        headerText: 'Política de Cookies',
        bannerText: 'Utilizamos cookies para melhorar sua experiência. Escolha quais tipos de cookies aceitar.',
        acceptAllButtonText: 'Aceitar Todos',
        acceptSelectedButtonText: 'Aceitar Selecionados',
        rejectAllButtonText: 'Rejeitar Todos',
        settingsButtonText: 'Configurações',
      },
      cookieTypes: [
        {
          id: 'essential',
          name: 'Cookies Essenciais',
          description: 'Necessários para o funcionamento básico do site.',
          required: true,
          enabled: true,
        },
        {
          id: 'performance',
          name: 'Cookies de Desempenho',
          description: 'Ajudam a melhorar a experiência coletando informações anônimas.',
          required: false,
          enabled: true,
        },
        {
          id: 'functional',
          name: 'Cookies de Funcionalidade',
          description: 'Permitem que o site lembre suas preferências.',
          required: false,
          enabled: true,
        },
        {
          id: 'marketing',
          name: 'Cookies de Marketing',
          description: 'Usados para rastrear visitantes entre sites para publicidade.',
          required: false,
          enabled: false,
        },
      ],
    };

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
      privacy_policy: defaultPolicySettings,
      terms_of_use: defaultPolicySettings,
      cookie_policy: defaultCookiePolicy,
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
      privacyPolicy: data.privacy_policy || defaultPolicySettings,
      termsOfUse: data.terms_of_use || defaultPolicySettings,
      cookiePolicy: data.cookie_policy || defaultCookiePolicy,
    };
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const { data: currentSettings, error: fetchError } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (fetchError || !currentSettings) {
      throw new Error('Settings not found');
    }

    const updateData = {
      platform_name: settings.platformName,
      logo_url: settings.logoUrl,
      favicon_url: settings.faviconUrl,
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
      privacy_policy: settings.privacyPolicy,
      terms_of_use: settings.termsOfUse,
      cookie_policy: settings.cookiePolicy,
      updated_at: new Date().toISOString()
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
      privacyPolicy: data.privacy_policy || defaultPolicySettings,
      termsOfUse: data.terms_of_use || defaultPolicySettings,
      cookiePolicy: data.cookie_policy || defaultCookiePolicy,
    };
  },

  async uploadLogo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Error uploading logo');
    }

    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error('Error getting public URL');
    }

    await this.updateSettings({ logoUrl: data.publicUrl });

    return data.publicUrl;
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