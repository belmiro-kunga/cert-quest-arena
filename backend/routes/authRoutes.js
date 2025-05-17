const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Chave secreta para JWT - em produção, use variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'cert-quest-arena-secret-key';

// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// Rota para registro de usuários
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
    }
    
    // Criar o usuário no banco de dados
    const newUser = await userModel.createUser(name, email, password);
    
    // Buscar informações de afiliado
    const affiliateInfo = await userModel.getAffiliateInfo(newUser.id);
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Formatar resposta
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      photoURL: newUser.photo_url,
      affiliate: {
        status: affiliateInfo.status,
        earnings: parseFloat(affiliateInfo.earnings),
        referrals: affiliateInfo.referrals,
        link: affiliateInfo.referral_link,
        applicationDate: affiliateInfo.application_date
      },
      createdAt: newUser.created_at
    };
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(400).json({ error: err.message || 'Erro ao registrar usuário' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Verificar credenciais
    const user = await userModel.verifyCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Buscar informações de afiliado
    const affiliateInfo = await userModel.getAffiliateInfo(user.id);
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Formatar resposta
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photo_url,
      affiliate: {
        status: affiliateInfo.status,
        earnings: parseFloat(affiliateInfo.earnings),
        referrals: affiliateInfo.referrals,
        link: affiliateInfo.referral_link,
        applicationDate: affiliateInfo.application_date
      },
      twoFactorAuth: {
        enabled: user.two_factor_enabled,
        secret: user.two_factor_secret
      }
    };
    
    res.json({
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(400).json({ error: err.message || 'Erro ao fazer login' });
  }
});

// Rota para obter perfil do usuário atual
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar usuário pelo ID
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Buscar informações de afiliado
    const affiliateInfo = await userModel.getAffiliateInfo(userId);
    
    // Formatar resposta
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photo_url,
      affiliate: {
        status: affiliateInfo.status,
        earnings: parseFloat(affiliateInfo.earnings),
        referrals: affiliateInfo.referrals,
        link: affiliateInfo.referral_link,
        applicationDate: affiliateInfo.application_date
      },
      twoFactorAuth: {
        enabled: user.two_factor_enabled
      }
    };
    
    res.json(userResponse);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(400).json({ error: err.message || 'Erro ao buscar perfil do usuário' });
  }
});

// Rota para atualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, photoURL } = req.body;
    
    // Atualizar perfil
    const updatedUser = await userModel.updateUserProfile(userId, {
      name,
      photo_url: photoURL
    });
    
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(400).json({ error: err.message || 'Erro ao atualizar perfil do usuário' });
  }
});

module.exports = router;
