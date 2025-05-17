require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const db = require('./db'); // Import the db configuration
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const paymentController = require('./controllers/paymentController');

// Importar modelos
const simuladoModel = require('./models/simuladoModel');
const pacoteModel = require('./models/pacoteModel');
const systemSettingsModel = require('./models/systemSettingsModel');
const AuthSettings = require('./models/AuthSettings');
const userModel = require('./models/userModel');

// Importar rotas
const simuladoRoutes = require('./routes/simuladoRoutes');
const questaoRoutes = require('./routes/questaoRoutes');
const resultRoutes = require('./routes/resultRoutes');
const pacoteRoutes = require('./routes/pacoteRoutes');
const systemSettingsRoutes = require('./routes/systemSettings');
const recaptchaRoutes = require('./routes/recaptchaRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Criar a aplicação Express
const app = express();
const PORT = process.env.PORT || 3008;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS
const corsOptions = {
  origin: function(origin, callback) {
    // Permitir requisições sem origem (como apps mobile ou curl)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8092',
      'http://127.0.0.1:56728',  // Browser preview
      'http://127.0.0.1:49580',  // Browser preview atual
      /^http:\/\/localhost:\d+$/,  // Qualquer porta em localhost
      /^http:\/\/127\.0\.0\.1:\d+$/  // Qualquer porta em 127.0.0.1
    ];
    
    // Verificar se a origem está na lista ou corresponde ao padrão regex
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
console.log('CORS configurado para permitir requisições locais e do browser preview');

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas de autenticação
app.use('/auth', require('./routes/auth'));

// Rotas de configuração de autenticação (admin)
app.use('/admin/settings/auth', require('./routes/authSettings'));

// Rotas do reCAPTCHA
app.use('/auth/recaptcha', recaptchaRoutes);

// Middleware para capturar erros de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Erro de parsing JSON:', err);
    return res.status(400).json({ error: 'JSON inválido', details: err.message });
  }
  next(err);
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Cert Quest Arena Backend is running!');
});

// Test DB Connection Route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()'); // Simple query to test connection
    res.json({ message: 'Database connection successful!', currentTime: result.rows[0].now });
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).json({ error: 'Failed to connect to database', details: err.message });
  }
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Verificar a conexão com o banco de dados
    const dbResult = await db.query('SELECT 1');
    
    // Verificar outros serviços críticos aqui, se necessário
    
    // Se tudo estiver funcionando, retornar status 200
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbResult.rows.length > 0 ? 'online' : 'offline',
        api: 'online'
      },
      version: '1.0.0'
    });
  } catch (err) {
    console.error('Health check falhou:', err);
    
    // Se houver um erro, retornar status 500 com detalhes
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'offline',
        api: 'online'
      },
      error: err.message,
      version: '1.0.0'
    });
  }
});

// Registrar rotas da API
console.log('Registrando rotas de simulados...');
app.use('/api/simulados', simuladoRoutes);
console.log('Rotas de simulados registradas!');

console.log('Registrando rotas de questões...');
app.use('/api/questoes', questaoRoutes);
console.log('Rotas de questões registradas!');

console.log('Registrando rotas de resultados...');
app.use('/api/resultados', resultRoutes);
console.log('Rotas de resultados registradas!');

console.log('Registrando rotas de pacotes...');
app.use('/api/pacotes', pacoteRoutes);
console.log('Rotas de pacotes registradas!');

console.log('Registrando rotas de configurações do sistema...');
app.use('/api/system-settings', systemSettingsRoutes);
console.log('Rotas de configurações do sistema registradas!');

console.log('Registrando rotas de autenticação...');
app.use('/api/auth', authRoutes);
console.log('Rotas de autenticação registradas!');

console.log('Registrando rotas de usuários...');
app.use('/api/users', userRoutes);
console.log('Rotas de usuários registradas!');

// Inicializar tabelas e dados
const initializeDatabase = async () => {
  try {
    console.log('Inicializando tabelas do banco de dados...');
    
    // Inicializar tabelas de questões
    await simuladoModel.initializeQuestionsTable();
    console.log('Tabelas de questões verificadas/criadas com sucesso');
    
    // Verificar coluna de preço
    await simuladoModel.checkPriceColumn();
    console.log('Verificação da coluna preco concluída');
    
    // Inicializar tabelas de pacotes
    await pacoteModel.initializePackagesTable();
    console.log('Tabelas de pacotes verificadas/criadas com sucesso');
    await pacoteModel.initializePackages();
    console.log('Tabelas de pacotes inicializadas');
    
    // Inicializar tabelas de simulados
    await simuladoModel.initializeSimuladosTable();
    console.log('Tabela de simulados verificada/criada com sucesso');
    await simuladoModel.initializeSimuladosTable();
    console.log('Tabela de simulados verificada/criada com sucesso');
    await simuladoModel.initializeSimulados();
    console.log('Tabelas de simulados inicializadas.');
    
    // Verificar coluna de preço novamente (para garantir)
    await simuladoModel.checkPriceColumn();
    console.log('Verificação da coluna preco concluída');
    
    // Inicializar tabelas de pacotes novamente (para garantir)
    await pacoteModel.initializePackagesTable();
    console.log('Tabelas de pacotes verificadas/criadas com sucesso');
    await pacoteModel.initializePackages();
    console.log('Tabelas de pacotes inicializadas.');
    
    // Inicializar tabela de configurações do sistema
    await systemSettingsModel.initializeSystemSettingsTable();
    console.log('Tabela de configurações do sistema verificada/criada com sucesso');
    await systemSettingsModel.initializeSystemSettings();
    console.log('Tabelas de configurações do sistema inicializadas');
    
    // Inicializar configurações de autenticação
    await AuthSettings.initializeAuthSettings();
    console.log('Tabela de configurações de autenticação inicializada');
    
    // Inicializar tabelas de usuários
    await userModel.createUserTable();
    console.log('Tabelas de usuários verificadas/criadas com sucesso');
    
    console.log('Inicialização do banco de dados concluída com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
  }
};

// Iniciar o servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
  
  // Inicializar banco de dados
  await initializeDatabase();
  
  console.log(`Teste a conexão com o banco em http://localhost:${PORT}/api/test-db`);
  console.log(`Gerenciamento de simulados em http://localhost:${PORT}/api/simulados`);
  console.log(`Gerenciamento de questões em http://localhost:${PORT}/api/questoes`);
  console.log(`Gerenciamento de pacotes em http://localhost:${PORT}/api/pacotes`);
  console.log(`Gerenciamento de configurações do sistema em http://localhost:${PORT}/api/system-settings`);
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'simulado',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Teste a conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao PostgreSQL com sucesso!');
    release();
});

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Middleware para controle de acesso por papel
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || !req.user.roles || !req.user.roles.includes(role)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
        }
        next();
    };
}

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

// Rotas de Autenticação
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const checkResult = await client.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (checkResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        const hash = await bcrypt.hash(senha, 10);
        const insertResult = await client.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, hash]
        );
        
        await client.query('COMMIT');
        
        res.json({ 
            message: 'Usuário cadastrado com sucesso!', 
            user: {
                id: insertResult.rows[0].id,
                nome: insertResult.rows[0].nome,
                email: insertResult.rows[0].email
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro no cadastro:', err);
        res.status(500).json({ error: 'Erro no servidor ao cadastrar usuário.' });
    } finally {
        client.release();
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
    
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }
        
        const user = result.rows[0];
        const match = await bcrypt.compare(senha, user.senha);
        
        if (!match) {
            return res.status(400).json({ error: 'Senha incorreta.' });
        }
        
        const token = jwt.sign(
            { 
                id: user.id, 
                nome: user.nome, 
                email: user.email, 
                roles: user.admin ? ['admin'] : [] 
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({ 
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                admin: user.admin
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro no servidor ao fazer login.' });
    } finally {
        client.release();
    }
});

// Rotas de Usuário
app.get('/me', auth, async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, nome, email, photo FROM usuarios WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        const user = result.rows[0];
        res.json({ 
            user: {
                id: user.id,
                name: user.nome,
                email: user.email,
                photo: user.photo || null
            }
        });
    } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
    } finally {
        client.release();
    }
});

// Rotas de Certificações
app.get('/certificacoes', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM certificacoes WHERE ativo = TRUE');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar certificações.' });
    } finally {
        client.release();
    }
});

// Rotas de Simulados
app.get('/simulados', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM simulados WHERE ativo = TRUE');
        
        const formattedRows = result.rows.map(row => ({
            id: row.id.toString(),
            title: row.titulo,
            description: row.descricao,
            questionsCount: row.qt_questoes,
            duration: row.duracao_minutos,
            difficulty: row.dificuldade,
            price: row.preco,
            discountPrice: row.preco_desconto,
            discountPercentage: row.percentual_desconto,
            discountExpiresAt: row.data_fim_desconto,
            purchases: row.qt_vendas || 0,
            rating: row.avaliacao || 0,
            passingScore: row.nota_aprovacao || 70,
            questions: []
        }));
        
        res.json(formattedRows);
    } catch (err) {
        console.error('Erro ao buscar simulados:', err);
        res.status(500).json({ error: 'Erro ao buscar simulados.' });
    } finally {
        client.release();
    }
});

app.get('/simulados/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM simulados WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Simulado não encontrado.' });
        
        const simulado = {
            id: result.rows[0].id.toString(),
            title: result.rows[0].titulo,
            description: result.rows[0].descricao,
            questionsCount: result.rows[0].qt_questoes,
            duration: result.rows[0].duracao_minutos,
            difficulty: result.rows[0].dificuldade,
            price: result.rows[0].preco,
            discountPrice: result.rows[0].preco_desconto,
            discountPercentage: result.rows[0].percentual_desconto,
            discountExpiresAt: result.rows[0].data_fim_desconto,
            purchases: result.rows[0].qt_vendas || 0,
            rating: result.rows[0].avaliacao || 0,
            passingScore: result.rows[0].nota_aprovacao || 70,
            questions: []
        };
        
        res.json(simulado);
    } catch (err) {
        console.error('Erro ao buscar simulado:', err);
        res.status(500).json({ error: 'Erro ao buscar simulado.' });
    } finally {
        client.release();
    }
});

// Rotas de Tentativas
app.post('/tentativas', auth, async (req, res) => {
    const { simulado_id, respostas } = req.body;
    if (!simulado_id || !Array.isArray(respostas)) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'INSERT INTO tentativas_simulado (usuario_id, simulado_id, data_inicio) VALUES ($1, $2, NOW()) RETURNING id',
            [req.user.id, simulado_id]
        );
        const tentativa_id = result.rows[0].id;
        
        for (const resp of respostas) {
            await client.query(
                'INSERT INTO respostas_usuario (tentativa_id, questao_id, alternativa_id, correta) VALUES ($1, $2, $3, $4)',
                [tentativa_id, resp.questao_id, resp.alternativa_id, resp.correta]
            );
        }
        
        await client.query(
            'UPDATE tentativas_simulado SET data_fim = NOW() WHERE id = $1',
            [tentativa_id]
        );
        
        await client.query('COMMIT');
        res.json({ tentativa_id, message: 'Tentativa registrada com sucesso!' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao registrar tentativa:', err);
        res.status(500).json({ error: 'Erro ao registrar tentativa.' });
    } finally {
        client.release();
    }
});

// Rotas de Notificações
app.get('/notificacoes', auth, async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM notificacoes WHERE usuario_id = $1 ORDER BY data_criacao DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar notificações:', err);
        res.status(500).json({ error: 'Erro ao buscar notificações.' });
    } finally {
        client.release();
    }
});

// Rotas de Pedidos
app.post('/pedidos', auth, async (req, res) => {
    const { itens, valor_total, metodo_pagamento } = req.body;
    if (!Array.isArray(itens) || !valor_total) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'INSERT INTO pedidos (usuario_id, valor_total, status, metodo_pagamento, data_pedido) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
            [req.user.id, valor_total, 'pendente', metodo_pagamento]
        );
        const pedido_id = result.rows[0].id;
        
        for (const item of itens) {
            await client.query(
                'INSERT INTO itens_pedido (pedido_id, simulado_id, preco) VALUES ($1, $2, $3)',
                [pedido_id, item.simulado_id, item.preco]
            );
        }
        
        await client.query('COMMIT');
        res.json({ pedido_id, message: 'Pedido criado com sucesso!' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', err);
        res.status(500).json({ error: 'Erro ao criar pedido.' });
    } finally {
        client.release();
    }
});

// Rotas de Admin
app.get('/admin/usuarios', auth, requireRole('admin'), async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, nome, email, admin, ativo FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    } finally {
        client.release();
    }
});

// Rotas de Pagamento
app.get('/api/admin/payments', auth, requireRole('admin'), paymentController.getPayments);
app.post('/api/payment/create-session', auth, paymentController.createPaymentSession);
app.post('/api/payment/webhook', paymentController.handleWebhook);
