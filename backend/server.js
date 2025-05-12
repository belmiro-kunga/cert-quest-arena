require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the db configuration

// Importar rotas
const simuladoRoutes = require('./routes/simuladoRoutes');
const questaoRoutes = require('./routes/questaoRoutes');

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
app.use(express.json()); // for parsing application/json

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


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
  console.log(`Teste a conexão com o banco em http://localhost:${PORT}/api/test-db`);
  console.log(`Gerenciamento de simulados em http://localhost:${PORT}/api/simulados`);
  console.log(`Gerenciamento de questões em http://localhost:${PORT}/api/questoes`);
});
