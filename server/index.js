const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const paymentController = require('./controllers/paymentController');

// Middleware para controle de acesso por papel
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(role)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
}

// Cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
  try {
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ error: 'Email já cadastrado.' });
    const hash = await bcrypt.hash(senha, 10);
    await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);
    res.json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro no servidor ao cadastrar usuário.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'Usuário não encontrado.' });
    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(400).json({ error: 'Senha incorreta.' });
    
    // Simplificando o token sem roles por enquanto
    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, roles: [] },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no servidor ao fazer login.' });
  }
});

// Middleware para autenticação
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido.' });
  }
}

// Rota protegida: dados do usuário
app.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// --- Certificações ---
app.get('/certificacoes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM certificacoes WHERE ativo = TRUE');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar certificações.' });
  }
});

app.get('/certificacoes/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM certificacoes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Certificação não encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar certificação.' });
  }
});

// --- Simulados ---
app.get('/simulados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM simulados WHERE ativo = TRUE');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar simulados.' });
  }
});

app.get('/simulados/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM simulados WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Simulado não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar simulado.' });
  }
});

// --- Questões ---
app.get('/simulados/:id/questoes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM questoes WHERE simulado_id = ? AND ativa = TRUE', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar questões.' });
  }
});

// --- Alternativas ---
app.get('/questoes/:id/alternativas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alternativas WHERE questao_id = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alternativas.' });
  }
});

// --- Tentativas de Simulado ---
app.post('/tentativas', async (req, res) => {
  const { usuario_id, simulado_id, respostas } = req.body;
  if (!usuario_id || !simulado_id || !Array.isArray(respostas)) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO tentativas_simulado (usuario_id, simulado_id, data_inicio) VALUES (?, ?, NOW())',
      [usuario_id, simulado_id]
    );
    const tentativa_id = result.insertId;
    for (const resp of respostas) {
      await conn.query(
        'INSERT INTO respostas_usuario (tentativa_id, questao_id, alternativa_id, correta) VALUES (?, ?, ?, ?)',
        [tentativa_id, resp.questao_id, resp.alternativa_id, resp.correta]
      );
    }
    await conn.query(
      'UPDATE tentativas_simulado SET data_fim = NOW() WHERE id = ?',
      [tentativa_id]
    );
    await conn.commit();
    res.json({ tentativa_id, message: 'Tentativa registrada com sucesso!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erro ao registrar tentativa.' });
  } finally {
    conn.release();
  }
});

// --- Notificações ---
app.get('/notificacoes', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY data_criacao DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
});

// --- Carrinho ---
app.get('/carrinho', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carrinho.' });
  }
});

app.post('/carrinho', auth, async (req, res) => {
  const { item_type, item_id } = req.body;
  if (!item_type || !item_id) return res.status(400).json({ error: 'Dados incompletos.' });
  try {
    await db.query('INSERT INTO cart_items (user_id, item_type, item_id) VALUES (?, ?, ?)', [req.user.id, item_type, item_id]);
    res.json({ message: 'Item adicionado ao carrinho.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho.' });
  }
});

app.delete('/carrinho/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removido do carrinho.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover item do carrinho.' });
  }
});

// --- Pedidos ---
app.get('/pedidos', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pedidos WHERE usuario_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

app.post('/pedidos', auth, async (req, res) => {
  const { itens, valor_total, metodo_pagamento } = req.body;
  if (!Array.isArray(itens) || !valor_total) return res.status(400).json({ error: 'Dados incompletos.' });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO pedidos (usuario_id, valor_total, status, metodo_pagamento, data_pedido) VALUES (?, ?, ?, ?, NOW())',
      [req.user.id, valor_total, 'pendente', metodo_pagamento]
    );
    const pedido_id = result.insertId;
    for (const item of itens) {
      await conn.query(
        'INSERT INTO itens_pedido (pedido_id, simulado_id, preco) VALUES (?, ?, ?)',
        [pedido_id, item.simulado_id, item.preco]
      );
    }
    await conn.commit();
    res.json({ pedido_id, message: 'Pedido criado com sucesso!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  } finally {
    conn.release();
  }
});

// --- Relatórios e Dashboards (Views) ---
app.get('/relatorios/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relatorio_desempenho_usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar relatório de usuários.' });
  }
});

app.get('/relatorios/simulados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relatorio_desempenho_simulados_pt');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar relatório de simulados.' });
  }
});

app.get('/dashboard', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dashboard_usuario_pt WHERE usuario_id = ?', [req.user.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dashboard.' });
  }
});

// Exemplo de rota protegida para admin
app.get('/admin/usuarios', auth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nome, email, admin, ativo FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Rotas de pagamento
app.post('/api/payment/create-session', auth, paymentController.createPaymentSession);
app.post('/api/payment/confirm', auth, paymentController.confirmPayment);
app.post('/api/payment/webhook', paymentController.handleWebhook);

// Rota alternativa para criar usuário inicial (POST)
app.post('/setup/create-user', async (req, res) => {
  console.log('Tentando criar usuário inicial via POST...');
  try {
    const email = 'aluno@teste.com';
    const senha = 'password';
    const nome = 'Aluno Teste';

    console.log('Verificando se usuário existe...');
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Usuário já existe');
      return res.json({ message: 'Usuário já existe. Tente fazer login.' });
    }

    console.log('Criando hash da senha...');
    const hash = await bcrypt.hash(senha, 10);

    console.log('Inserindo usuário no banco...');
    await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );

    console.log('Usuário criado com sucesso!');
    res.json({ message: 'Usuário inicial criado com sucesso!' });
  } catch (err) {
    console.error('Erro detalhado:', err);
    res.status(500).json({ error: 'Erro ao criar usuário inicial.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
  console.log('Rotas disponíveis:');
  console.log('- GET /create-initial-user');
  console.log('- POST /login');
  console.log('- POST /register');
}); 