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
      // Busca o template de notificação de compra simulada
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
          simulatedName,
          simulatedPrice: simulatedPrice.toFixed(2),
        },
      });

      console.log('Notificação de compra simulada enviada com sucesso');

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
      console.error('Erro ao enviar notificação de compra simulada:', error);
      throw error;
    }
  },

  async sendExamResultsEmail(userEmail: string, userName: string, examResult: {
    examName: string;
    score: number;
    totalPoints: number;
    completionTime: string;
    correctAnswers: number;
    totalQuestions: number;
    strongAreas: string[];
    improvementAreas: string[];
    studyRecommendations: string[];
    nextSteps: string[];
    passingScore: number;
  }) {
    try {
      // Busca o template de resultados do exame
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'exam-results')
        .single();

      if (!template) {
        throw new Error('Template de email de resultados do exame não encontrado');
      }

      // Calcula a taxa de acerto
      const accuracyRate = Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100);

      // Formata as áreas de domínio
      const strongAreasFormatted = examResult.strongAreas
        .map(area => `- ${area}`)
        .join('\n');

      // Formata as áreas para melhorar
      const improvementAreasFormatted = examResult.improvementAreas
        .map(area => `- ${area}`)
        .join('\n');

      // Formata as recomendações de estudo
      const studyRecommendationsFormatted = examResult.studyRecommendations
        .map(rec => `- ${rec}`)
        .join('\n');

      // Formata os próximos passos
      const nextStepsFormatted = examResult.nextSteps
        .map(step => `- ${step}`)
        .join('\n');

      // Gera o link de revisão
      const reviewLink = `${window.location.origin}/exam-review/${examResult.examName}`;

      // Define a mensagem de aprovação/reprovação
      const passingMessage = examResult.score >= examResult.passingScore
        ? `🎉 Parabéns! Você foi APROVADO neste exame! Sua pontuação (${examResult.score}) superou a pontuação mínima necessária (${examResult.passingScore}).`
        : `Continue se esforçando! Você precisa de ${examResult.passingScore} pontos para ser aprovado. Com mais prática, você conseguirá!`;

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject.replace('{{examName}}', examResult.examName),
        body: template.body,
        variables: {
          name: userName,
          examName: examResult.examName,
          score: examResult.score.toString(),
          totalPoints: examResult.totalPoints.toString(),
          completionTime: examResult.completionTime,
          correctAnswers: examResult.correctAnswers.toString(),
          totalQuestions: examResult.totalQuestions.toString(),
          accuracyRate: accuracyRate.toString(),
          strongAreas: strongAreasFormatted,
          improvementAreas: improvementAreasFormatted,
          studyRecommendations: studyRecommendationsFormatted,
          nextSteps: nextStepsFormatted,
          reviewLink,
          passingMessage
        },
      });

      console.log('Email de resultados do exame enviado com sucesso para:', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email de resultados do exame:', error);
      throw error;
    }
  },

  async sendMilestoneEmail(userEmail: string, userName: string, milestone: {
    name: string;
    description: string;
    rewards: string[];
    nextMilestone?: {
      name: string;
      description: string;
      requirements: string[];
    };
  }) {
    try {
      // Busca o template de marco alcançado
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'milestone-reached')
        .single();

      if (!template) {
        throw new Error('Template de email de marco alcançado não encontrado');
      }

      // Busca as estatísticas do usuário
      const { data: userStats } = await supabase
        .from('user_statistics')
        .select('total_study_hours, total_questions, correct_answers')
        .eq('user_id', userEmail)
        .single();

      // Calcula a taxa de acerto
      const accuracyRate = userStats
        ? Math.round((userStats.correct_answers / userStats.total_questions) * 100)
        : 0;

      // Formata as recompensas
      const formattedRewards = milestone.rewards
        .map(reward => `- ${reward}`)
        .join('\n');

      // Formata o próximo marco
      const nextMilestoneText = milestone.nextMilestone
        ? `${milestone.nextMilestone.name}\n\n${milestone.nextMilestone.description}\n\nRequisitos:\n${milestone.nextMilestone.requirements.map(req => `- ${req}`).join('\n')}`
        : 'Você atingiu o nível máximo! Continue mantendo seu excelente desempenho!';

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          name: userName,
          milestoneName: milestone.name,
          milestoneDescription: milestone.description,
          rewards: formattedRewards,
          totalHours: userStats?.total_study_hours.toFixed(1) || '0',
          questionsAnswered: userStats?.total_questions.toString() || '0',
          accuracyRate: accuracyRate.toString(),
          nextMilestone: nextMilestoneText
        },
      });

      console.log('Email de marco alcançado enviado com sucesso para:', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email de marco alcançado:', error);
      throw error;
    }
  },

  async sendWelcomeEmail(userEmail: string, userName: string) {
    try {
      // Busca o template de boas-vindas
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'welcome')
        .single();

      if (!template) {
        throw new Error('Template de email de boas-vindas não encontrado');
      }

      // Gera os links necessários
      const profileLink = `${window.location.origin}/profile`;
      const assessmentLink = `${window.location.origin}/assessment`;
      const resourcesLink = `${window.location.origin}/resources`;
      const communityLink = `${window.location.origin}/community`;

      // Busca certificações recomendadas para iniciantes
      const { data: recommendedCertifications } = await supabase
        .from('certifications')
        .select('name, description')
        .eq('level', 'beginner')
        .limit(3);

      // Formata as certificações recomendadas
      const recommendedCerts = recommendedCertifications
        ? recommendedCertifications
          .map(cert => `- ${cert.name}: ${cert.description}`)
          .join('\n')
        : 'Carregando recomendações...';

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          name: userName,
          profileLink,
          assessmentLink,
          resourcesLink,
          recommendedCerts,
          communityLink,
          supportEmail: 'suporte@certquestarena.com'
        },
      });

      console.log('Email de boas-vindas enviado com sucesso para:', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      throw error;
    }
  },
};