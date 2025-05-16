require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const db = require('./db'); // Import the db configuration

// Importar modelos e rotas
const simuladoModel = require('./models/simuladoModel');
const pacoteModel = require('./models/pacoteModel');
const systemSettingsModel = require('./models/systemSettingsModel');

// Importar rotas
const simuladoRoutes = require('./routes/simuladoRoutes');
const questaoRoutes = require('./routes/questaoRoutes');
const resultRoutes = require('./routes/resultRoutes');
const pacoteRoutes = require('./routes/pacoteRoutes');
const systemSettingsRoutes = require('./routes/systemSettings');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Enable CORS for requests from your frontend
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Permitir ambas as origens
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // Permitir cookies e credenciais
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
};
app.use(cors(corsOptions));

console.log('CORS configurado para permitir origens:', corsOptions.origin);

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para parsing de JSON com logs de erro
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas de autenticação
app.use('/auth', require('./routes/auth')); // for parsing application/json

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
    console.log('Tabelas de configurações do sistema inicializadas.');
    
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
