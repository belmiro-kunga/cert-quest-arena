const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { pool } = require('../db');

passport.serializeUser((user, done) => {
  done(null, user?.id || null);
});

passport.deserializeUser(async (id, done) => {
  if (!id) return done(null, null);
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

// Função auxiliar para verificar se as credenciais estão configuradas
const isProviderConfigured = (provider) => {
  switch (provider) {
    case 'google':
      return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL;
    case 'github':
      return process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL;
    default:
      return false;
  }
};

// Configuração básica do Passport
passport.initialize();

// Google Strategy - Configurar apenas se as credenciais estiverem disponíveis
if (isProviderConfigured('google')) {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (existingUser.rows.length) {
        return done(null, existingUser.rows[0]);
      }

      // Se não existe, criar novo usuário
      const newUser = await pool.query(
        'INSERT INTO users (name, email, profile_picture, provider) VALUES ($1, $2, $3, $4) RETURNING *',
        [
          profile.displayName,
          profile.emails[0].value,
          profile.photos[0].value,
          'google'
        ]
      );

      return done(null, newUser.rows[0]);
    } catch (err) {
      return done(err, null);
    }
  }
));

// GitHub Strategy - Configurar apenas se as credenciais estiverem disponíveis
if (isProviderConfigured('github')) {
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE github_id = $1 OR email = $2',
        [profile.id, profile.emails?.[0]?.value]
      );

      if (existingUser.rows.length) {
        return done(null, existingUser.rows[0]);
      }

      // Se não existe, criar novo usuário
      const newUser = await pool.query(
        'INSERT INTO users (name, email, profile_picture, github_id, provider) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          profile.displayName || profile.username,
          profile.emails?.[0]?.value || null,
          profile.photos?.[0]?.value,
          profile.id,
          'github'
        ]
      );

      return done(null, newUser.rows[0]);
    } catch (err) {
      return done(err, null);
    }
  }));
}

module.exports = passport;
