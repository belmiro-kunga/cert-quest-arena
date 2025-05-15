const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * Middleware para verificar se o token JWT é válido
 */
const authenticateToken = (req, res, next) => {
  // Para desenvolvimento, podemos desabilitar temporariamente a autenticação
  // Remover este bypass em produção
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('⚠️ Autenticação desabilitada em ambiente de desenvolvimento');
    req.user = { id: 1, email: 'admin@example.com', role: 'admin' };
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware para verificar se o usuário é um administrador
 */
const isAdmin = async (req, res, next) => {
  // Para desenvolvimento, podemos desabilitar temporariamente a verificação de admin
  // Remover este bypass em produção
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('⚠️ Verificação de admin desabilitada em ambiente de desenvolvimento');
    return next();
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Verificar se o usuário é um administrador no banco de dados
    const result = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userRole = result.rows[0].role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Permissão de administrador necessária' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar permissões de administrador:', error);
    res.status(500).json({ error: 'Erro ao verificar permissões', details: error.message });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};
