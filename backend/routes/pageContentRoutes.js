const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const { isAdmin } = require('../middleware/auth');

// Inicializar páginas padrão ao iniciar o servidor
(async () => {
  try {
    await PageContent.initializeDefaultPages();
    console.log('Páginas institucionais inicializadas com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar páginas institucionais:', error);
  }
})();

// Obter conteúdo de uma página específica (público)
router.get('/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    if (!['about', 'contact'].includes(pageKey)) {
      return res.status(400).json({ message: 'Chave de página inválida' });
    }
    
    const pageContent = await PageContent.findOne({ pageKey });
    
    if (!pageContent) {
      return res.status(404).json({ message: 'Conteúdo da página não encontrado' });
    }
    
    res.json(pageContent);
  } catch (error) {
    console.error('Erro ao obter conteúdo da página:', error);
    res.status(500).json({ message: 'Erro ao obter conteúdo da página' });
  }
});

// Listar todas as páginas disponíveis (admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const pages = await PageContent.find({}, 'pageKey title lastUpdated');
    res.json(pages);
  } catch (error) {
    console.error('Erro ao listar páginas:', error);
    res.status(500).json({ message: 'Erro ao listar páginas' });
  }
});

// Atualizar conteúdo de uma página (admin)
router.put('/:pageKey', isAdmin, async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updateData = req.body;
    
    if (!['about', 'contact'].includes(pageKey)) {
      return res.status(400).json({ message: 'Chave de página inválida' });
    }
    
    // Adicionar informações de atualização
    updateData.lastUpdated = new Date();
    updateData.updatedBy = req.admin.id;
    
    const updatedPage = await PageContent.findOneAndUpdate(
      { pageKey },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPage) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    res.json(updatedPage);
  } catch (error) {
    console.error('Erro ao atualizar página:', error);
    res.status(500).json({ message: 'Erro ao atualizar página', error: error.message });
  }
});

// Adicionar uma nova seção a uma página (admin)
router.post('/:pageKey/sections', isAdmin, async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { sectionKey, title, content, order } = req.body;
    
    if (!sectionKey || !title || !content) {
      return res.status(400).json({ message: 'Dados incompletos para a seção' });
    }
    
    const page = await PageContent.findOne({ pageKey });
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    // Verificar se a seção já existe
    const sectionExists = page.sections.some(section => section.sectionKey === sectionKey);
    
    if (sectionExists) {
      return res.status(400).json({ message: 'Seção com esta chave já existe' });
    }
    
    // Adicionar nova seção
    page.sections.push({
      sectionKey,
      title,
      content,
      order: order || page.sections.length
    });
    
    page.lastUpdated = new Date();
    page.updatedBy = req.admin.id;
    
    await page.save();
    
    res.status(201).json(page);
  } catch (error) {
    console.error('Erro ao adicionar seção:', error);
    res.status(500).json({ message: 'Erro ao adicionar seção', error: error.message });
  }
});

// Atualizar uma seção específica (admin)
router.put('/:pageKey/sections/:sectionKey', isAdmin, async (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    const { title, content, order } = req.body;
    
    const page = await PageContent.findOne({ pageKey });
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    // Encontrar o índice da seção
    const sectionIndex = page.sections.findIndex(section => section.sectionKey === sectionKey);
    
    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Seção não encontrada' });
    }
    
    // Atualizar a seção
    if (title) page.sections[sectionIndex].title = title;
    if (content) page.sections[sectionIndex].content = content;
    if (order !== undefined) page.sections[sectionIndex].order = order;
    
    page.lastUpdated = new Date();
    page.updatedBy = req.admin.id;
    
    await page.save();
    
    res.json(page);
  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    res.status(500).json({ message: 'Erro ao atualizar seção', error: error.message });
  }
});

// Remover uma seção (admin)
router.delete('/:pageKey/sections/:sectionKey', isAdmin, async (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    
    const page = await PageContent.findOne({ pageKey });
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    // Filtrar a seção a ser removida
    const initialLength = page.sections.length;
    page.sections = page.sections.filter(section => section.sectionKey !== sectionKey);
    
    if (page.sections.length === initialLength) {
      return res.status(404).json({ message: 'Seção não encontrada' });
    }
    
    page.lastUpdated = new Date();
    page.updatedBy = req.admin.id;
    
    await page.save();
    
    res.json({ message: 'Seção removida com sucesso', page });
  } catch (error) {
    console.error('Erro ao remover seção:', error);
    res.status(500).json({ message: 'Erro ao remover seção', error: error.message });
  }
});

// Gerenciar FAQs (apenas para página de contato)
// Adicionar FAQ
router.post('/contact/faqs', isAdmin, async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ message: 'Pergunta e resposta são obrigatórias' });
    }
    
    const contactPage = await PageContent.findOne({ pageKey: 'contact' });
    
    if (!contactPage) {
      return res.status(404).json({ message: 'Página de contato não encontrada' });
    }
    
    // Adicionar nova FAQ
    contactPage.faqs.push({
      question,
      answer,
      order: order || contactPage.faqs.length
    });
    
    contactPage.lastUpdated = new Date();
    contactPage.updatedBy = req.admin.id;
    
    await contactPage.save();
    
    res.status(201).json(contactPage);
  } catch (error) {
    console.error('Erro ao adicionar FAQ:', error);
    res.status(500).json({ message: 'Erro ao adicionar FAQ', error: error.message });
  }
});

// Atualizar FAQ
router.put('/contact/faqs/:faqId', isAdmin, async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer, order } = req.body;
    
    const contactPage = await PageContent.findOne({ pageKey: 'contact' });
    
    if (!contactPage) {
      return res.status(404).json({ message: 'Página de contato não encontrada' });
    }
    
    // Encontrar o índice da FAQ
    const faqIndex = contactPage.faqs.findIndex(faq => faq._id.toString() === faqId);
    
    if (faqIndex === -1) {
      return res.status(404).json({ message: 'FAQ não encontrada' });
    }
    
    // Atualizar a FAQ
    if (question) contactPage.faqs[faqIndex].question = question;
    if (answer) contactPage.faqs[faqIndex].answer = answer;
    if (order !== undefined) contactPage.faqs[faqIndex].order = order;
    
    contactPage.lastUpdated = new Date();
    contactPage.updatedBy = req.admin.id;
    
    await contactPage.save();
    
    res.json(contactPage);
  } catch (error) {
    console.error('Erro ao atualizar FAQ:', error);
    res.status(500).json({ message: 'Erro ao atualizar FAQ', error: error.message });
  }
});

// Remover FAQ
router.delete('/contact/faqs/:faqId', isAdmin, async (req, res) => {
  try {
    const { faqId } = req.params;
    
    const contactPage = await PageContent.findOne({ pageKey: 'contact' });
    
    if (!contactPage) {
      return res.status(404).json({ message: 'Página de contato não encontrada' });
    }
    
    // Filtrar a FAQ a ser removida
    const initialLength = contactPage.faqs.length;
    contactPage.faqs = contactPage.faqs.filter(faq => faq._id.toString() !== faqId);
    
    if (contactPage.faqs.length === initialLength) {
      return res.status(404).json({ message: 'FAQ não encontrada' });
    }
    
    contactPage.lastUpdated = new Date();
    contactPage.updatedBy = req.admin.id;
    
    await contactPage.save();
    
    res.json({ message: 'FAQ removida com sucesso', page: contactPage });
  } catch (error) {
    console.error('Erro ao remover FAQ:', error);
    res.status(500).json({ message: 'Erro ao remover FAQ', error: error.message });
  }
});

// Atualizar informações de contato
router.put('/contact/info', isAdmin, async (req, res) => {
  try {
    const { emails, phones, address, socialMedia } = req.body;
    
    const contactPage = await PageContent.findOne({ pageKey: 'contact' });
    
    if (!contactPage) {
      return res.status(404).json({ message: 'Página de contato não encontrada' });
    }
    
    // Atualizar informações de contato
    if (emails) contactPage.contactInfo.emails = emails;
    if (phones) contactPage.contactInfo.phones = phones;
    if (address) contactPage.contactInfo.address = address;
    if (socialMedia) contactPage.contactInfo.socialMedia = socialMedia;
    
    contactPage.lastUpdated = new Date();
    contactPage.updatedBy = req.admin.id;
    
    await contactPage.save();
    
    res.json(contactPage);
  } catch (error) {
    console.error('Erro ao atualizar informações de contato:', error);
    res.status(500).json({ message: 'Erro ao atualizar informações de contato', error: error.message });
  }
});

module.exports = router;
