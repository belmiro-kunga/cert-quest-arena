const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'certquest',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkSimulados() {
  try {
    console.log('Verificando simulados no banco de dados...');
    
    // Verificar todos os simulados
    const allSimulados = await pool.query('SELECT id, titulo, ativo FROM simulados ORDER BY id');
    console.log('Todos os simulados:');
    console.table(allSimulados.rows);
    
    // Verificar simulados ativos
    const activeSimulados = await pool.query('SELECT id, titulo, ativo FROM simulados WHERE ativo = TRUE ORDER BY id');
    console.log('Simulados ativos:');
    console.table(activeSimulados.rows);
    
    // Fechar a conexão com o banco de dados
    await pool.end();
  } catch (error) {
    console.error('Erro ao verificar simulados:', error);
  }
}

checkSimulados();
