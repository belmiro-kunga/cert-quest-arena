require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cert_quest_arena',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Testar a conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    return;
  }
  console.log('Conectado ao PostgreSQL com sucesso!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool, // Export the pool itself if needed for transactions etc.
  getClient: async () => {
    const client = await pool.connect();
    return client;
  }
};
