/**
 * Script para configurar o login social no banco de dados
 */
require('dotenv').config();
const { pool } = require('../db');

async function setupSocialLogin() {
  try {
    console.log('Configurando login social...');
    
    // Verificar se a tabela auth_settings existe e adicionar restrição de unicidade
    await pool.query(`
      DROP TABLE IF EXISTS auth_settings;
      CREATE TABLE auth_settings (
        id SERIAL PRIMARY KEY,
        provider VARCHAR(50) NOT NULL,
        client_id TEXT,
        client_secret TEXT,
        callback_url TEXT,
        enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX idx_auth_settings_provider ON auth_settings(provider);
    `);
    
    console.log('Tabela auth_settings recriada com sucesso!');
    
    // Configurar Google OAuth
    const googleConfig = {
      provider: 'google',
      client_id: 'google-client-id', // Substitua pelo seu Client ID real
      client_secret: 'google-client-secret', // Substitua pelo seu Client Secret real
      callback_url: 'http://localhost:3001/auth/google/callback',
      enabled: true
    };
    
    // Configurar GitHub OAuth
    const githubConfig = {
      provider: 'github',
      client_id: 'github-client-id', // Substitua pelo seu Client ID real
      client_secret: 'github-client-secret', // Substitua pelo seu Client Secret real
      callback_url: 'http://localhost:3001/auth/github/callback',
      enabled: true
    };
    
    // Inserir configurações do Google
    await pool.query(`
      INSERT INTO auth_settings (provider, client_id, client_secret, callback_url, enabled)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      googleConfig.provider,
      googleConfig.client_id,
      googleConfig.client_secret,
      googleConfig.callback_url,
      googleConfig.enabled
    ]);
    
    console.log('Configuração do Google OAuth salva com sucesso!');
    
    // Inserir configurações do GitHub
    await pool.query(`
      INSERT INTO auth_settings (provider, client_id, client_secret, callback_url, enabled)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      githubConfig.provider,
      githubConfig.client_id,
      githubConfig.client_secret,
      githubConfig.callback_url,
      githubConfig.enabled
    ]);
    
    console.log('Configuração do GitHub OAuth salva com sucesso!');
    
    // Criar tabela users se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT,
        role VARCHAR(50) DEFAULT 'student',
        provider VARCHAR(50),
        profile_picture TEXT,
        github_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Inserir usuário admin se não existir
    const adminExists = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@certquest.com']);
    
    if (adminExists.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Administrador', 'admin@certquest.com', 'admin123', 'admin')
      `);
      console.log('Usuário administrador criado com sucesso!');
    } else {
      console.log('Usuário administrador já existe.');
    }
    
    console.log('Tabela de usuários atualizada com sucesso!');
    console.log('Configuração de login social concluída!');
    
  } catch (error) {
    console.error('Erro ao configurar login social:', error);
  } finally {
    // Fechar a conexão com o pool
    pool.end();
  }
}

// Executar a função
setupSocialLogin();
