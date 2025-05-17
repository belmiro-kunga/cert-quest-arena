const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'simulado',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function registerUser() {
  const client = await pool.connect();
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Verificar se o usuário já existe
    const checkResult = await client.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (checkResult.rows.length > 0) {
      console.log('Usuário já existe');
      return;
    }

    // Criar hash da senha
    const hash = await bcrypt.hash(password, 10);

    // Inserir usuário
    const result = await client.query(
      'INSERT INTO usuarios (nome, email, senha, admin) VALUES ($1, $2, $3, true) RETURNING id',
      [name, email, hash]
    );

    console.log('Usuário admin criado com sucesso:', result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
  } finally {
    client.release();
    pool.end();
  }
}

registerUser(); 