const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota para iniciar autenticação Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback do Google
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: true 
  }),
  (req, res) => {
    // Sucesso na autenticação
    res.redirect('/dashboard');
  }
);

// Rota para iniciar autenticação GitHub
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback do GitHub
router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/login',
    session: true 
  }),
  (req, res) => {
    // Sucesso na autenticação
    res.redirect('/dashboard');
  }
);

// Rota de logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
