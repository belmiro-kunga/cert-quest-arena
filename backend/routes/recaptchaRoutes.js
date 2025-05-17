const express = require('express');
const router = express.Router();
const RecaptchaSettings = require('../models/RecaptchaSettings');
const { isAdmin } = require('../middleware/authMiddleware');

// Obter configurações do reCAPTCHA (endpoint público)
router.get('/config', async (req, res) => {
  try {
    const settings = await RecaptchaSettings.get();
    
    // Retornar apenas as informações seguras para o cliente
    // (não incluir a chave secreta)
    res.json({
      enabled: settings.enabled,
      siteKey: settings.siteKey,
      threshold: settings.threshold
    });
  } catch (error) {
    console.error('Erro ao buscar configurações do reCAPTCHA:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações do reCAPTCHA' });
  }
});

// Atualizar configurações do reCAPTCHA (apenas admin)
router.put('/config', isAdmin, async (req, res) => {
  try {
    const { enabled, siteKey, secretKey, threshold } = req.body;
    
    // Validar os dados
    if (siteKey === undefined || secretKey === undefined || threshold === undefined) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Atualizar as configurações
    await RecaptchaSettings.update({
      enabled: enabled === true || enabled === 'true',
      siteKey,
      secretKey,
      threshold: parseInt(threshold)
    });
    
    res.json({ success: true, message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações do reCAPTCHA:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações do reCAPTCHA' });
  }
});

// Verificar um token reCAPTCHA
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }
    
    const settings = await RecaptchaSettings.get();
    
    // Se o reCAPTCHA estiver desativado, retornar sucesso
    if (!settings.enabled) {
      return res.json({ success: true });
    }
    
    // Verificar o token com a API do Google
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: settings.secretKey,
        response: token
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Verificação do reCAPTCHA falhou',
        errorCodes: data['error-codes'] 
      });
    }
  } catch (error) {
    console.error('Erro ao verificar token reCAPTCHA:', error);
    res.status(500).json({ error: 'Erro ao verificar token reCAPTCHA' });
  }
});

module.exports = router;
