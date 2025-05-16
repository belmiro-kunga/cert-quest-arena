const express = require('express');
const router = express.Router();
const authSettingsService = require('../services/authSettingsService');
const { isAdmin } = require('../middleware/authMiddleware');

// Obter configurações de autenticação
router.get('/', isAdmin, async (req, res) => {
  try {
    const settings = await authSettingsService.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações de autenticação' });
  }
});

// Atualizar configurações de autenticação
router.post('/', isAdmin, async (req, res) => {
  try {
    const { provider, config } = req.body;

    if (!provider || !config) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    if (provider !== 'google' && provider !== 'github') {
      return res.status(400).json({ error: 'Provedor inválido' });
    }

    await authSettingsService.updateSettings(provider, config);
    res.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações de autenticação' });
  }
});

module.exports = router;
