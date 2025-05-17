const db = require('../db');
const bcrypt = require('bcryptjs');

// Função para criar a tabela de usuários se não existir
const createUserTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        photo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(255),
        two_factor_backup_codes JSONB
      )
    `);

    // Criar tabela de informações de afiliado
    await db.query(`
      CREATE TABLE IF NOT EXISTS affiliate_info (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        earnings DECIMAL(10, 2) DEFAULT 0,
        referrals INTEGER DEFAULT 0,
        referral_link VARCHAR(255),
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tabelas de usuários e afiliados verificadas/criadas com sucesso');
  } catch (err) {
    console.error('Erro ao criar tabelas de usuários:', err);
    throw err;
  }
};

// Função para criar um novo usuário
const createUser = async (name, email, password) => {
  try {
    // Verificar se o email já está em uso
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('Este email já está em uso');
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserir o usuário no banco de dados
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword]
    );

    // Criar entrada na tabela de afiliados
    const userId = result.rows[0].id;
    const referralLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/ref/${userId}`;
    
    await db.query(
      'INSERT INTO affiliate_info (user_id, referral_link) VALUES ($1, $2)',
      [userId, referralLink]
    );

    return result.rows[0];
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    throw err;
  }
};

// Função para buscar um usuário pelo email
const getUserByEmail = async (email) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar usuário por email:', err);
    throw err;
  }
};

// Função para verificar credenciais de login
const verifyCredentials = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Não retornar a senha no objeto do usuário
    delete user.password;
    return user;
  } catch (err) {
    console.error('Erro ao verificar credenciais:', err);
    throw err;
  }
};

// Função para obter informações de afiliado
const getAffiliateInfo = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM affiliate_info WHERE user_id = $1', [userId]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar informações de afiliado:', err);
    throw err;
  }
};

// Função para atualizar o perfil do usuário
const updateUserProfile = async (userId, userData) => {
  try {
    const { name, photo_url } = userData;
    
    const result = await db.query(
      'UPDATE users SET name = $1, photo_url = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, role, photo_url',
      [name, photo_url, userId]
    );
    
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao atualizar perfil do usuário:', err);
    throw err;
  }
};

// Função para listar todos os usuários
const getAllUsers = async () => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    throw err;
  }
};

// Função para obter um usuário pelo ID
const getUserById = async (userId) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Erro ao buscar usuário por ID:', err);
    throw err;
  }
};

// Função para atualizar um usuário (admin)
const updateUser = async (userId, userData) => {
  try {
    const { name, email, role } = userData;
    
    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const emailExists = await db.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailExists.rows.length > 0) {
        throw new Error('Email já está em uso por outro usuário');
      }
    }
    
    // Construir a query de atualização dinamicamente
    let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    const params = [];
    
    if (name) {
      values.push(name);
      params.push(`name = $${values.length}`);
    }
    
    if (email) {
      values.push(email);
      params.push(`email = $${values.length}`);
    }
    
    if (role) {
      values.push(role);
      params.push(`role = $${values.length}`);
    }
    
    if (params.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização');
    }
    
    query += ', ' + params.join(', ');
    values.push(userId);
    query += ` WHERE id = $${values.length} RETURNING id, name, email, role, created_at, updated_at`;
    
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    throw err;
  }
};

// Função para excluir um usuário
const deleteUser = async (userId) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    return true;
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    throw err;
  }
};

// Função para buscar usuários por papel (role)
const getUsersByRole = async (role) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE role = $1 ORDER BY created_at DESC', [role]);
    return result.rows;
  } catch (err) {
    console.error(`Erro ao buscar usuários com papel ${role}:`, err);
    throw err;
  }
};

// Função para contar o número de usuários por papel
const countUsersByRole = async () => {
  try {
    const result = await db.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    return result.rows;
  } catch (err) {
    console.error('Erro ao contar usuários por papel:', err);
    throw err;
  }
};

module.exports = {
  createUserTable,
  createUser,
  getUserByEmail,
  getUserById,
  verifyCredentials,
  getAffiliateInfo,
  updateUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByRole,
  countUsersByRole
};
