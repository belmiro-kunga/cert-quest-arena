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

  async sendStudySessionEmail(userEmail: string, userName: string, sessionData: {
    date: Date;
    studyTime: number; // em minutos
    focusScore: number;
    progressGained: number;
    questionsAnswered: number;
    correctAnswers: number;
    xpGained: number;
    achievements: string[];
    topics: Array<{
      name: string;
      timeSpent: number;
      masteryLevel: number;
    }>;
    reviewTopics: Array<{
      name: string;
      reason: string;
    }>;
    insights: Array<{
      topic: string;
      insight: string;
    }>;
    nextSession: {
      date: Date;
      duration: number;
      topics: string[];
    };
    goals: {
      daily: {
        target: number;
        current: number;
      };
      weekly: {
        target: number;
        current: number;
      };
    };
  }) {
    try {
      // Busca o template de sessão de estudo
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'study-session')
        .single();

      if (!template) {
        throw new Error('Template de email de sessão de estudo não encontrado');
      }

      // Formata a data
      const formattedDate = sessionData.date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Formata o tempo de estudo
      const hours = Math.floor(sessionData.studyTime / 60);
      const minutes = sessionData.studyTime % 60;
      const formattedStudyTime = hours > 0
        ? `${hours}h ${minutes}min`
        : `${minutes}min`;

      // Calcula a taxa de acerto
      const accuracyRate = Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100);

      // Formata as conquistas
      const achievementsFormatted = sessionData.achievements
        .map(achievement => `- ${achievement}`)
        .join('\n');

      // Formata os tópicos estudados
      const topicsFormatted = sessionData.topics
        .map(topic => `- ${topic.name}\n  ⏱️ ${Math.round(topic.timeSpent)}min | ⭐ Domínio: ${topic.masteryLevel}%`)
        .join('\n');

      // Formata os tópicos para revisão
      const reviewTopicsFormatted = sessionData.reviewTopics
        .map(topic => `- ${topic.name}\n  ${topic.reason}`)
        .join('\n');

      // Formata os insights
      const insightsFormatted = sessionData.insights
        .map(insight => `- ${insight.topic}: ${insight.insight}`)
        .join('\n');

      // Formata a próxima sessão
      const nextSessionDate = sessionData.nextSession.date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric'
      });

      const nextSessionFormatted = `Data: ${nextSessionDate}\nDuração: ${sessionData.nextSession.duration}min\nTópicos: ${sessionData.nextSession.topics.join(', ')}`;

      // Calcula progresso das metas
      const dailyGoalProgress = Math.round((sessionData.goals.daily.current / sessionData.goals.daily.target) * 100);
      const weeklyGoalProgress = Math.round((sessionData.goals.weekly.current / sessionData.goals.weekly.target) * 100);

      // Gera link para próxima sessão
      const nextSessionLink = `${window.location.origin}/study-session/new?topics=${encodeURIComponent(sessionData.nextSession.topics.join(','))}&duration=${sessionData.nextSession.duration}`;

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject.replace('{{date}}', formattedDate),
        body: template.body,
        variables: {
          name: userName,
          date: formattedDate,
          studyTime: formattedStudyTime,
          focusScore: sessionData.focusScore.toString(),
          progressGained: sessionData.progressGained.toString(),
          questionsAnswered: sessionData.questionsAnswered.toString(),
          accuracyRate: accuracyRate.toString(),
          xpGained: sessionData.xpGained.toString(),
          achievements: achievementsFormatted,
          topics: topicsFormatted,
          reviewTopics: reviewTopicsFormatted,
          insights: insightsFormatted,
          nextSession: nextSessionFormatted,
          dailyGoalProgress: dailyGoalProgress.toString(),
          weeklyGoalProgress: weeklyGoalProgress.toString(),
          nextSessionLink
        },
      });

      console.log('Email de resumo da sessão de estudo enviado com sucesso para:', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email de resumo da sessão de estudo:', error);
      throw error;
    }
  },

  async sendCertificateEarnedEmail(userEmail: string, userName: string, certData: {
    certName: string;
    certLevel: string;
    finalScore: number;
    prepTime: string;
    progress: number;
    achievements: string[];
    certificateId: string;
    nextSteps: string[];
    recommendedCerts: Array<{
      name: string;
      level: string;
      description: string;
    }>;
  }) {
    try {
      // Busca o template de certificado conquistado
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'certificate-earned')
        .single();

      if (!template) {
        throw new Error('Template de email de certificado conquistado não encontrado');
      }

      // Formata as conquistas
      const achievementsFormatted = certData.achievements
        .map(achievement => `- ${achievement}`)
        .join('\n');

      // Gera links
      const baseUrl = window.location.origin;
      const certificateLink = `${baseUrl}/certificates/${certData.certificateId}`;
      const profileLink = `${baseUrl}/profile/certificates`;

      // Gera links de compartilhamento
      const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateLink)}&title=${encodeURIComponent(`Acabei de conquistar o certificado ${certData.certName} na plataforma CertQuest Arena! 🎓`)}`;
      
      const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Acabei de conquistar o certificado ${certData.certName} na plataforma CertQuest Arena! 🎓\nConfira aqui: ${certificateLink}`)}`;

      // Formata os próximos passos
      const nextStepsFormatted = certData.nextSteps
        .map(step => `- ${step}`)
        .join('\n');

      // Formata as certificações recomendadas
      const recommendedCertsFormatted = certData.recommendedCerts
        .map(cert => `- ${cert.name} (${cert.level})\n  ${cert.description}`)
        .join('\n\n');

      // Envia email para o usuário
      await this.sendEmail({
        to: userEmail,
        subject: template.subject.replace('{{certName}}', certData.certName),
        body: template.body,
        variables: {
          name: userName,
          certName: certData.certName,
          certLevel: certData.certLevel,
          finalScore: certData.finalScore.toString(),
          prepTime: certData.prepTime,
          progress: certData.progress.toString(),
          achievements: achievementsFormatted,
          certificateLink,
          linkedinShareLink,
          twitterShareLink,
          nextSteps: nextStepsFormatted,
          recommendedCerts: recommendedCertsFormatted,
          profileLink
        },
      });

      console.log('Email de certificado conquistado enviado com sucesso para:', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email de certificado conquistado:', error);
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