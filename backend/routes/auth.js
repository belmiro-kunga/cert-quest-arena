const express = require('express');
const passport = require('passport');
const router = express.Router();

// Middleware para verificar se a estratégia está disponível
const checkStrategy = (strategy) => (req, res, next) => {
  if (!passport._strategies[strategy]) {
    return res.status(503).json({
      error: `Autenticação com ${strategy} não está configurada`
    });
  }
  next();
};

// Rota para iniciar autenticação Google
router.get('/google',
  checkStrategy('google'),
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: true
  })
);

// Callback do Google
router.get('/google/callback',
  checkStrategy('google'),
  passport.authenticate('google', { 
    failureRedirect: '/login?error=google_auth_failed',
    successRedirect: '/dashboard',
    session: true 
  })
);

// Rota para iniciar autenticação GitHub
router.get('/github',
  checkStrategy('github'),
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: true
  })
);

// Callback do GitHub
router.get('/github/callback',
  checkStrategy('github'),
  passport.authenticate('github', { 
    failureRedirect: '/login?error=github_auth_failed',
    successRedirect: '/dashboard',
    session: true 
  })
);

// Rota de logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Status da autenticação
router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user
  });
});

module.exports = router;
