import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Globe, Clock, DollarSign, Palette, Image, Mail, Bell, Shield, CreditCard, MapPin, Receipt, XCircle } from 'lucide-react';
import { PaymentSettings } from '@/components/admin/settings/PaymentSettings';
import { BillingSettings } from '@/components/admin/settings/BillingSettings';
import { CancellationSettings } from '@/components/admin/settings/CancellationSettings';
import { settingsService, SystemSettings, EmailTemplate, EmailSubscription } from '@/services/settingsService';
import { useToast } from '@/components/ui/use-toast';
import { getLocalizedLanguageName } from '@/utils/language';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const settingsSchema = z.object({
  platformName: z.string().min(1, 'Nome da plataforma é obrigatório'),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().min(1, 'Cor primária é obrigatória'),
  secondaryColor: z.string().min(1, 'Cor secundária é obrigatória'),
  language: z.string().min(1, 'Idioma é obrigatório'),
  timezone: z.string().min(1, 'Fuso horário é obrigatório'),
  currency: z.string().min(1, 'Moeda é obrigatória'),
  // Email Settings
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean().default(true),
  smtpFromEmail: z.string().email('Email inválido').optional(),
  smtpFromName: z.string().optional(),
  emailNotificationsEnabled: z.boolean().default(true),
  emailSubscriptionsEnabled: z.boolean().default(true),
  spamProtectionEnabled: z.boolean().default(true),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const AVAILABLE_LANGUAGES = ['pt-BR', 'en-US', 'es'];
const AVAILABLE_TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/New_York', label: 'New York (GMT-4)' },
  { value: 'Europe/London', label: 'London (GMT+1)' },
];
const AVAILABLE_CURRENCIES = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailSubscriptions, setEmailSubscriptions] = useState<EmailSubscription[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<EmailSubscription | null>(null);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        form.reset({
          platformName: settings.platformName,
          logoUrl: settings.logoUrl,
          faviconUrl: settings.faviconUrl,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          language: settings.language,
          timezone: settings.timezone,
          currency: settings.currency,
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUsername: settings.smtpUsername,
          smtpPassword: settings.smtpPassword,
          smtpSecure: settings.smtpSecure,
          smtpFromEmail: settings.smtpFromEmail,
          smtpFromName: settings.smtpFromName,
          emailNotificationsEnabled: settings.emailNotificationsEnabled,
          emailSubscriptionsEnabled: settings.emailSubscriptionsEnabled,
          spamProtectionEnabled: settings.spamProtectionEnabled,
        });

        // Aplica as configurações carregadas
        settingsService.updatePageTitle(settings.platformName);
        if (settings.faviconUrl) {
          settingsService.updateFavicon(settings.faviconUrl);
        }
        settingsService.updateThemeColors(settings.primaryColor, settings.secondaryColor);

        // Carrega templates e assinaturas
        const templates = await settingsService.getEmailTemplates();
        const subscriptions = await settingsService.getEmailSubscriptions();
        setEmailTemplates(templates);
        setEmailSubscriptions(subscriptions);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações.',
          variant: 'destructive',
        });
      }
    };

    loadSettings();
  }, [form, toast]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const updatedSettings = await settingsService.updateSettings({
        platformName: data.platformName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        language: data.language,
        timezone: data.timezone,
        currency: data.currency,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUsername: data.smtpUsername,
        smtpPassword: data.smtpPassword,
        smtpSecure: data.smtpSecure,
        smtpFromEmail: data.smtpFromEmail,
        smtpFromName: data.smtpFromName,
        emailNotificationsEnabled: data.emailNotificationsEnabled,
        emailSubscriptionsEnabled: data.emailSubscriptionsEnabled,
        spamProtectionEnabled: data.spamProtectionEnabled,
      });

      // Aplica as alterações em tempo real
      settingsService.updatePageTitle(updatedSettings.platformName);
      if (updatedSettings.faviconUrl) {
        settingsService.updateFavicon(updatedSettings.faviconUrl);
      }
      settingsService.updateThemeColors(updatedSettings.primaryColor, updatedSettings.secondaryColor);

      // Atualiza o idioma da aplicação
      i18n.changeLanguage(updatedSettings.language);

      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const logoUrl = await settingsService.uploadLogo(file);
      form.setValue('logoUrl', logoUrl);
      toast({
        title: 'Sucesso',
        description: 'Logo atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload do logo.',
        variant: 'destructive',
      });
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const faviconUrl = await settingsService.uploadFavicon(file);
      form.setValue('faviconUrl', faviconUrl);
      settingsService.updateFavicon(faviconUrl);
      toast({
        title: 'Sucesso',
        description: 'Favicon atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao fazer upload do favicon:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload do favicon.',
        variant: 'destructive',
      });
    }
  };

  const handleTemplateUpdate = async (template: EmailTemplate) => {
    try {
      const updatedTemplate = await settingsService.updateEmailTemplate(template);
      setEmailTemplates(templates =>
        templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
      );
      toast({
        title: 'Sucesso',
        description: 'Template atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o template.',
        variant: 'destructive',
      });
    }
  };

  const handleSubscriptionUpdate = async (subscription: EmailSubscription) => {
    try {
      const updatedSubscription = await settingsService.updateEmailSubscription(subscription);
      setEmailSubscriptions(subscriptions =>
        subscriptions.map(s => s.id === updatedSubscription.id ? updatedSubscription : s)
      );
      toast({
        title: 'Sucesso',
        description: 'Assinatura atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a assinatura.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações Gerais do Sistema</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="localization">
              <MapPin className="h-4 w-4 mr-2" />
              Localização
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Receipt className="h-4 w-4 mr-2" />
              Faturamento
            </TabsTrigger>
            <TabsTrigger value="cancellation">
              <XCircle className="h-4 w-4 mr-2" />
              Cancelamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Nome da Plataforma</Label>
                  <Input
                    id="platformName"
                    {...form.register('platformName')}
                    placeholder="Digite o nome da plataforma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    {form.watch('logoUrl') && (
                      <img
                        src={form.watch('logoUrl')}
                        alt="Logo"
                        className="h-8 w-8 object-contain"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                    />
                    {form.watch('faviconUrl') && (
                      <img
                        src={form.watch('faviconUrl')}
                        alt="Favicon"
                        className="h-8 w-8 object-contain"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="primaryColor"
                      type="color"
                      {...form.register('primaryColor')}
                    />
                    <Input
                      type="text"
                      {...form.register('primaryColor')}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="secondaryColor"
                      type="color"
                      {...form.register('secondaryColor')}
                    />
                    <Input
                      type="text"
                      {...form.register('secondaryColor')}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="localization">
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    onValueChange={(value) => form.setValue('language', value)}
                    defaultValue={form.getValues('language')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {getLocalizedLanguageName(lang, i18n.language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    onValueChange={(value) => form.setValue('timezone', value)}
                    defaultValue={form.getValues('timezone')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    onValueChange={(value) => form.setValue('currency', value)}
                    defaultValue={form.getValues('currency')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <div className="space-y-4">
              {/* SMTP Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Servidor SMTP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">Host SMTP</Label>
                      <Input
                        id="smtpHost"
                        {...form.register('smtpHost')}
                        placeholder="smtp.exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Porta SMTP</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        {...form.register('smtpPort', { valueAsNumber: true })}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">Usuário SMTP</Label>
                      <Input
                        id="smtpUsername"
                        {...form.register('smtpUsername')}
                        placeholder="usuario@exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Senha SMTP</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        {...form.register('smtpPassword')}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpFromEmail">Email de Envio</Label>
                      <Input
                        id="smtpFromEmail"
                        type="email"
                        {...form.register('smtpFromEmail')}
                        placeholder="noreply@exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpFromName">Nome de Envio</Label>
                      <Input
                        id="smtpFromName"
                        {...form.register('smtpFromName')}
                        placeholder="Nome do Remetente"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smtpSecure"
                      checked={form.watch('smtpSecure')}
                      onCheckedChange={(checked) => form.setValue('smtpSecure', checked)}
                    />
                    <Label htmlFor="smtpSecure">Usar SSL/TLS</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Email Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Templates de Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Templates Disponíveis</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        {emailTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={`p-2 rounded cursor-pointer ${
                              selectedTemplate?.id === template.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            {template.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedTemplate && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Assunto</Label>
                          <Input
                            value={selectedTemplate.subject}
                            onChange={(e) =>
                              setSelectedTemplate({
                                ...selectedTemplate,
                                subject: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Corpo do Email</Label>
                          <Textarea
                            value={selectedTemplate.body}
                            onChange={(e) =>
                              setSelectedTemplate({
                                ...selectedTemplate,
                                body: e.target.value,
                              })
                            }
                            rows={10}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedTemplate.isActive}
                            onCheckedChange={(checked) =>
                              setSelectedTemplate({
                                ...selectedTemplate,
                                isActive: checked,
                              })
                            }
                          />
                          <Label>Template Ativo</Label>
                        </div>
                        <Button
                          onClick={() => handleTemplateUpdate(selectedTemplate)}
                        >
                          Salvar Template
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotificationsEnabled"
                      checked={form.watch('emailNotificationsEnabled')}
                      onCheckedChange={(checked) =>
                        form.setValue('emailNotificationsEnabled', checked)
                      }
                    />
                    <Label htmlFor="emailNotificationsEnabled">
                      Habilitar Notificações por Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailSubscriptionsEnabled"
                      checked={form.watch('emailSubscriptionsEnabled')}
                      onCheckedChange={(checked) =>
                        form.setValue('emailSubscriptionsEnabled', checked)
                      }
                    />
                    <Label htmlFor="emailSubscriptionsEnabled">
                      Habilitar Assinaturas de Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="spamProtectionEnabled"
                      checked={form.watch('spamProtectionEnabled')}
                      onCheckedChange={(checked) =>
                        form.setValue('spamProtectionEnabled', checked)
                      }
                    />
                    <Label htmlFor="spamProtectionEnabled">
                      Habilitar Proteção contra Spam
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Email Subscriptions */}
              <Card>
                <CardHeader>
                  <CardTitle>Assinaturas de Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assinantes</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        {emailSubscriptions.map((subscription) => (
                          <div
                            key={subscription.id}
                            className={`p-2 rounded cursor-pointer ${
                              selectedSubscription?.id === subscription.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedSubscription(subscription)}
                          >
                            {subscription.email}
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedSubscription && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={selectedSubscription.email}
                            onChange={(e) =>
                              setSelectedSubscription({
                                ...selectedSubscription,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nome</Label>
                          <Input
                            value={selectedSubscription.name || ''}
                            onChange={(e) =>
                              setSelectedSubscription({
                                ...selectedSubscription,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedSubscription.isActive}
                            onCheckedChange={(checked) =>
                              setSelectedSubscription({
                                ...selectedSubscription,
                                isActive: checked,
                              })
                            }
                          />
                          <Label>Assinatura Ativa</Label>
                        </div>
                        <Button
                          onClick={() => handleSubscriptionUpdate(selectedSubscription)}
                        >
                          Salvar Assinatura
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="cancellation">
            <CancellationSettings />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar Configurações</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 