const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageKey: {
    type: String,
    required: true,
    unique: true,
    enum: ['about', 'contact'] // Chaves para as páginas gerenciáveis
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  sections: [{
    sectionKey: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  contactInfo: {
    emails: [{
      label: String,
      email: String
    }],
    phones: [{
      label: String,
      number: String
    }],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    socialMedia: [{
      platform: String,
      url: String
    }]
  },
  faqs: [{
    question: String,
    answer: String,
    order: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

// Método para inicializar as páginas com conteúdo padrão
pageContentSchema.statics.initializeDefaultPages = async function() {
  const PageContent = this;
  
  // Verificar se já existem páginas
  const aboutPage = await PageContent.findOne({ pageKey: 'about' });
  const contactPage = await PageContent.findOne({ pageKey: 'contact' });
  
  // Se não existir a página Sobre nós, criar com conteúdo padrão
  if (!aboutPage) {
    await PageContent.create({
      pageKey: 'about',
      title: 'Sobre o CertQuest Arena',
      subtitle: 'Ajudando profissionais a conquistarem suas certificações com confiança desde 2022',
      sections: [
        {
          sectionKey: 'mission',
          title: 'Nossa Missão',
          content: 'No CertQuest Arena, nossa missão é democratizar o acesso à preparação de alta qualidade para certificações profissionais em tecnologia. Acreditamos que o conhecimento técnico certificado deve estar ao alcance de todos os profissionais, independentemente de sua localização ou recursos financeiros.',
          order: 1
        },
        {
          sectionKey: 'values',
          title: 'Nossos Valores',
          content: 'Excelência, Comunidade, Aprendizado Contínuo, Foco no Resultado, Confiabilidade, Acessibilidade',
          order: 2
        },
        {
          sectionKey: 'history',
          title: 'Nossa História',
          content: 'O CertQuest Arena nasceu da frustração de um grupo de profissionais de TI que não encontravam simulados de qualidade para suas certificações. Decidimos criar a plataforma que gostaríamos de ter tido em nossa própria jornada de certificação.',
          order: 3
        }
      ]
    });
  }
  
  // Se não existir a página Contato, criar com conteúdo padrão
  if (!contactPage) {
    await PageContent.create({
      pageKey: 'contact',
      title: 'Entre em Contato',
      subtitle: 'Estamos aqui para ajudar. Entre em contato conosco para tirar dúvidas, fazer sugestões ou solicitar informações.',
      contactInfo: {
        emails: [
          { label: 'Contato', email: 'contato@certquestarena.com' },
          { label: 'Suporte', email: 'suporte@certquestarena.com' }
        ],
        phones: [
          { label: 'Central de Atendimento', number: '+55 (11) 3456-7890' }
        ],
        address: {
          street: 'Av. Paulista, 1000, Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil'
        },
        socialMedia: [
          { platform: 'Twitter', url: 'https://twitter.com/certquestarena' },
          { platform: 'Facebook', url: 'https://facebook.com/certquestarena' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/certquestarena' }
        ]
      },
      faqs: [
        {
          question: 'Como posso obter suporte técnico?',
          answer: 'Para suporte técnico, envie um email para suporte@certquestarena.com ou utilize o formulário de contato nesta página. Nossa equipe responderá em até 24 horas úteis.',
          order: 1
        },
        {
          question: 'Vocês oferecem descontos para grupos ou empresas?',
          answer: 'Sim, oferecemos planos especiais para empresas e grupos de estudo. Entre em contato conosco pelo email comercial@certquestarena.com para discutir suas necessidades específicas.',
          order: 2
        },
        {
          question: 'Como posso sugerir uma nova certificação?',
          answer: 'Adoramos receber sugestões! Utilize o formulário de contato e selecione "Sugestão" como assunto. Nossa equipe avaliará a viabilidade e entrará em contato com você.',
          order: 3
        }
      ]
    });
  }
};

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;
