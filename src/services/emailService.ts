import { supabase } from '@/lib/supabase';
import { settingsService } from './settingsService';
import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  body: string;
  variables?: Record<string, string>;
}

export const emailService = {
  async sendEmail({ to, subject, body, variables = {} }: EmailData) {
    try {
      // Busca as configurações do sistema
      const settings = await settingsService.getSettings();

      // Verifica se as notificações por email estão habilitadas
      if (!settings.emailNotificationsEnabled) {
        console.log('Notificações por email desabilitadas');
        return;
      }

      // Verifica se as configurações SMTP estão definidas
      if (!settings.smtpHost || !settings.smtpPort || !settings.smtpUsername || !settings.smtpPassword) {
        console.error('Configurações SMTP incompletas');
        throw new Error('Configurações SMTP incompletas');
      }

      // Cria o transportador SMTP
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpSecure,
        auth: {
          user: settings.smtpUsername,
          pass: settings.smtpPassword,
        },
      });

      // Substitui as variáveis no corpo do email
      let processedBody = body;
      Object.entries(variables).forEach(([key, value]) => {
        processedBody = processedBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      // Envia o email
      await transporter.sendMail({
        from: `"${settings.smtpFromName}" <${settings.smtpFromEmail}>`,
        to,
        subject,
        text: processedBody,
      });

      console.log('Email enviado com sucesso para:', to);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  },

  async sendRegistrationConfirmation(userEmail: string, userName: string, confirmationToken: string) {
    try {
      // Busca o template de confirmação de cadastro
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'registration_confirmation')
        .single();

      if (!template) {
        throw new Error('Template de email não encontrado');
      }

      // Gera o link de confirmação
      const confirmationLink = `${window.location.origin}/confirm-email?token=${confirmationToken}`;

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          name: userName,
          confirmation_link: confirmationLink,
        },
      });

      // Busca o email do administrador
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('role', 'admin')
        .single();

      if (adminProfile?.email) {
        // Envia email para o administrador
        await this.sendEmail({
          to: adminProfile.email,
          subject: 'Novo usuário registrado',
          body: `
            Novo usuário registrado:
            
            Nome: ${userName}
            Email: ${userEmail}
            
            Data: ${new Date().toLocaleString('pt-BR')}
          `,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      throw error;
    }
  },

  async sendPasswordRecovery(userEmail: string, userName: string, recoveryToken: string) {
    try {
      // Busca o template de recuperação de senha
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'password_recovery')
        .single();

      if (!template) {
        throw new Error('Template de email não encontrado');
      }

      // Gera o link de recuperação
      const recoveryLink = `${window.location.origin}/reset-password?token=${recoveryToken}`;

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          name: userName,
          recovery_link: recoveryLink,
        },
      });

      // Busca o email do administrador
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('role', 'admin')
        .single();

      if (adminProfile?.email) {
        // Envia email para o administrador
        await this.sendEmail({
          to: adminProfile.email,
          subject: 'Solicitação de recuperação de senha',
          body: `
            Solicitação de recuperação de senha:
            
            Usuário: ${userName} (${userEmail})
            
            Data: ${new Date().toLocaleString('pt-BR')}
          `,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar email de recuperação de senha:', error);
      throw error;
    }
  },

  async sendSimulatedPurchaseNotification(userEmail: string, userName: string, simulatedName: string, simulatedPrice: number) {
    try {
      // Busca o template de compra de simulado
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'simulated_purchase')
        .single();

      if (!template) {
        throw new Error('Template de email não encontrado');
      }

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          name: userName,
          simulated_name: simulatedName,
          price: simulatedPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
      });

      // Busca o email do administrador
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('role', 'admin')
        .single();

      if (adminProfile?.email) {
        // Envia email para o administrador
        await this.sendEmail({
          to: adminProfile.email,
          subject: `Nova compra de simulado: ${simulatedName}`,
          body: `
            Nova compra realizada:
            
            Usuário: ${userName} (${userEmail})
            Simulado: ${simulatedName}
            Valor: ${simulatedPrice.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            
            Data: ${new Date().toLocaleString('pt-BR')}
          `,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de compra:', error);
      throw error;
    }
  },
}; 