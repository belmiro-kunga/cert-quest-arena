require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const db = require('./db'); // Import the db configuration

// Importar modelos
const simuladoModel = require('./models/simuladoModel');
const pacoteModel = require('./models/pacoteModel');
const systemSettingsModel = require('./models/systemSettingsModel');
const AuthSettings = require('./models/AuthSettings');

// Importar rotas
const simuladoRoutes = require('./routes/simuladoRoutes');
const questaoRoutes = require('./routes/questaoRoutes');
const resultRoutes = require('./routes/resultRoutes');
const pacoteRoutes = require('./routes/pacoteRoutes');
const systemSettingsRoutes = require('./routes/systemSettings');

// Criar a aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

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
      'http://127.0.0.1:56728',  // Browser preview
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
app.use('/admin/settings/auth', require('./routes/authSettings')); // for parsing application/json

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

// Inicializar tabelas e dados
const initializeDatabase = async () => {
  try {
    console.log('Inicializando tabelas do banco de dados...');
    
    // Inicializar tabelas de simulados
    await simuladoModel.initialize();
    console.log('Tabelas de simulados inicializadas.');
    
    // Inicializar tabelas de pacotes
    await pacoteModel.createTableIfNotExists();
    console.log('Tabelas de pacotes inicializadas.');
    
    // Inicializar tabelas de configurações do sistema
    await systemSettingsModel.createTableIfNotExists();
    console.log('Tabelas de configurações do sistema inicializadas');

    // Inicializar tabela de configurações de autenticação
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_settings (
        id SERIAL PRIMARY KEY,
        provider VARCHAR(50) NOT NULL,
        client_id TEXT,
        client_secret TEXT,
        callback_url TEXT,
        enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela de configurações de autenticação inicializada');
    
    console.log('Inicialização do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

// Start the server
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
  
  // Inicializar banco de dados
  await initializeDatabase();
  
  console.log(`Teste a conexão com o banco em http://localhost:${PORT}/api/test-db`);
  console.log(`Gerenciamento de simulados em http://localhost:${PORT}/api/simulados`);
  console.log(`Gerenciamento de questões em http://localhost:${PORT}/api/questoes`);
  console.log(`Gerenciamento de pacotes em http://localhost:${PORT}/api/pacotes`);
  console.log(`Gerenciamento de configurações do sistema em http://localhost:${PORT}/api/system-settings`);
});
