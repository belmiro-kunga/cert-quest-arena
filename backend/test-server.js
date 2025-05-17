// Servidor de teste simples
const express = require('express');
const app = express();

// Definir a porta explicitamente
const PORT = 3008;

// Middleware para parsing de JSON
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de teste funcionando!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}/api/health para testar`);
});
