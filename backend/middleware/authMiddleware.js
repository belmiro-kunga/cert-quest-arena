/**
 * Middleware de autenticação para proteger rotas
 */

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Não autorizado. Faça login para continuar.' });
};

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  
  // Verificar credenciais de admin por email
  if (req.isAuthenticated() && req.user && req.user.email === 'admin@certquest.com') {
    return next();
  }
  
  res.status(403).json({ error: 'Acesso negado. Permissão de administrador necessária.' });
};

// Middleware para verificar se o usuário é o proprietário do recurso
const isOwner = (resourceField) => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Não autorizado. Faça login para continuar.' });
  }

  const resourceId = req.params[resourceField];
  
  // Se o usuário for admin, permitir acesso
  if (req.user.role === 'admin' || req.user.email === 'admin@certquest.com') {
    return next();
  }
  
  // Verificar se o usuário é o proprietário do recurso
  if (req.user.id === resourceId) {
    return next();
  }
  
  res.status(403).json({ error: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isOwner
};
