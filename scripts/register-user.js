const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../server/.env' });

async function registerUser() {
  const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const email = 'aluno@teste.com';
    const senha = 'password';
    const nome = 'Aluno Teste';

    // Verificar se o usuário já existe
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Email já cadastrado.');
      return;
    }

    // Criar hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // Inserir usuário
    await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );

    console.log('Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
  } finally {
    process.exit();
  }
}

registerUser(); 