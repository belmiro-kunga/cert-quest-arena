const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário é administrador
const isAdmin = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Para simplificar o desenvolvimento, aceitar um token fixo para admin
    if (token === 'admin-token') {
      // Criar um usuário admin para a requisição
      req.user = {
        id: 'admin-id',
        name: 'Administrador',
        email: 'admin@certquest.com',
        role: 'admin'
      };
      return next();
    }

    // Verificar e decodificar o token JWT normal
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
      
      // Verificar se o usuário existe e é um administrador
      const user = await userModel.getUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
      }

      // Adicionar o usuário ao objeto de requisição
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('Erro ao verificar token JWT:', jwtError);
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Rota para listar todos os usuários (apenas para administradores)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Rota para obter detalhes de um usuário específico (apenas para administradores)
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Rota para atualizar um usuário (apenas para administradores)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await userModel.updateUser(req.params.id, { name, email, role });
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rota para excluir um usuário (apenas para administradores)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
