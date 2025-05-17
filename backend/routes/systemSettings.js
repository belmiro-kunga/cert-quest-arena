const express = require('express');
const router = express.Router();
const systemSettingsModel = require('../models/systemSettingsModel');
const { isAdmin } = require('../middleware/auth');

// Rota de teste para verificar se a tabela foi inicializada
router.get('/test-init', async (req, res) => {
  try {
    // Forçar inicialização da tabela
    await systemSettingsModel.createTableIfNotExists();
    
    // Buscar todas as configurações
    const settings = await systemSettingsModel.getAllSettings();
    
    res.json({
      message: 'Tabela de configurações do sistema inicializada com sucesso',
      settings
    });
  } catch (error) {
    console.error('Erro ao testar inicialização:', error);
    res.status(500).json({ error: 'Erro ao testar inicialização', details: error.message });
  }
});

// Obter todas as configurações
router.get('/', async (req, res) => {
  try {
    const settings = await systemSettingsModel.getAllSettings();
    res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações do sistema' });
  }
});

// Obter uma configuração específica
router.get('/:key', async (req, res) => {
  try {
    const setting = await systemSettingsModel.getSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração do sistema' });
  }
});

// Atualizar uma configuração (apenas admin)
// TODO: Restaurar middleware isAdmin em produção
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Valor é obrigatório' });
    }

    const setting = await systemSettingsModel.updateSetting(req.params.key, value);
    if (!setting) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    res.json(setting);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração do sistema' });
  }
});

// Rota para obter apenas a moeda padrão (compatível com frontend)
router.get('/default_currency', async (req, res) => {
  try {
    const setting = await systemSettingsModel.getSetting('default_currency');
    if (!setting) {
      return res.status(404).json({ error: 'Configuração de moeda padrão não encontrada' });
    }
    res.json({ currency: setting.value });
  } catch (error) {
    console.error('Erro ao buscar moeda padrão:', error);
    res.status(500).json({ error: 'Erro ao buscar moeda padrão' });
  }
});

module.exports = router; 