const express = require('express');
const router = express.Router();
const AuthSettings = require('../models/AuthSettings');
const { isAdmin } = require('../middleware/authMiddleware');

// Obter todas as configurações de autenticação
router.get('/', isAdmin, async (req, res) => {
  try {
    const settings = await AuthSettings.getAll();
    
    // Transformar os resultados em um formato mais amigável
    const formattedSettings = {
      google: {
        clientId: '',
        clientSecret: '',
        callbackUrl: `${process.env.FRONTEND_URL}/auth/google/callback`,
        enabled: false
      },
      github: {
        clientId: '',
        clientSecret: '',
        callbackUrl: `${process.env.FRONTEND_URL}/auth/github/callback`,
        enabled: false
      }
    };

    settings.forEach(setting => {
      if (setting.provider === 'google' || setting.provider === 'github') {
        formattedSettings[setting.provider] = {
          clientId: setting.client_id || '',
          clientSecret: setting.client_secret || '',
          callbackUrl: setting.callback_url || formattedSettings[setting.provider].callbackUrl,
          enabled: setting.enabled
        };
      }
    });

    res.json(formattedSettings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações de autenticação' });
  }
});

// Obter configuração de um provedor específico
router.get('/:provider', isAdmin, async (req, res) => {
  try {
    const { provider } = req.params;
    
    if (provider !== 'google' && provider !== 'github') {
      return res.status(400).json({ error: 'Provedor inválido' });
    }

    const setting = await AuthSettings.getByProvider(provider);
    if (!setting) {
      return res.json({
        clientId: '',
        clientSecret: '',
        callbackUrl: `${process.env.FRONTEND_URL}/auth/${provider}/callback`,
        enabled: false
      });
    }

    res.json({
      clientId: setting.client_id || '',
      clientSecret: setting.client_secret || '',
      callbackUrl: setting.callback_url || `${process.env.FRONTEND_URL}/auth/${provider}/callback`,
      enabled: setting.enabled
    });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração de autenticação' });
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

    const result = await AuthSettings.upsert(provider, {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      callbackUrl: config.callbackUrl || `${process.env.FRONTEND_URL}/auth/${provider}/callback`,
      enabled: config.enabled
    });

    res.json({
      message: 'Configurações atualizadas com sucesso',
      config: {
        clientId: result.client_id,
        clientSecret: result.client_secret,
        callbackUrl: result.callback_url,
        enabled: result.enabled
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações de autenticação' });
  }
});

// Ativar/Desativar provedor
router.patch('/:provider/toggle', isAdmin, async (req, res) => {
  try {
    const { provider } = req.params;
    const { enabled } = req.body;

    if (provider !== 'google' && provider !== 'github') {
      return res.status(400).json({ error: 'Provedor inválido' });
    }

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'O parâmetro enabled deve ser um booleano' });
    }

    const result = await AuthSettings.toggleProvider(provider, enabled);
    if (!result) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    res.json({
      message: `Provedor ${enabled ? 'ativado' : 'desativado'} com sucesso`,
      config: {
        clientId: result.client_id,
        clientSecret: result.client_secret,
        callbackUrl: result.callback_url,
        enabled: result.enabled
      }
    });
  } catch (error) {
    console.error('Erro ao alterar status do provedor:', error);
    res.status(500).json({ error: 'Erro ao alterar status do provedor' });
  }
});

module.exports = router;
