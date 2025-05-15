/**
 * Script para fazer backup do banco de dados PostgreSQL usando apenas Node.js
 * Este script não depende de pg_dump, apenas do driver pg do Node.js
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Criar pasta de backups se não existir
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Obter data e hora atual para o nome do arquivo
const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
const backupFileName = `certquest_backup_${timestamp}.json`;
const backupFilePath = path.join(backupDir, backupFileName);

// Configurar conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

console.log('Iniciando backup do banco de dados...');
console.log(`Arquivo de backup será salvo em: ${backupFilePath}`);

async function getTableNames() {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const result = await pool.query(query);
  return result.rows.map(row => row.table_name);
}

async function getTableData(tableName) {
  const query = `SELECT * FROM "${tableName}"`;
  const result = await pool.query(query);
  return result.rows;
}

async function backupDatabase() {
  try {
    // Obter lista de tabelas
    const tables = await getTableNames();
    console.log(`Encontradas ${tables.length} tabelas no banco de dados.`);
    
    // Objeto para armazenar os dados do backup
    const backup = {
      metadata: {
        timestamp: now.toISOString(),
        database: process.env.DB_NAME,
        tables: tables,
        version: '1.0'
      },
      data: {}
    };
    
    // Backup de cada tabela
    for (const tableName of tables) {
      console.log(`Fazendo backup da tabela: ${tableName}`);
      const tableData = await getTableData(tableName);
      backup.data[tableName] = tableData;
      console.log(`  - ${tableData.length} registros salvos`);
    }
    
    // Salvar o backup em um arquivo JSON
    fs.writeFileSync(backupFilePath, JSON.stringify(backup, null, 2));
    
    console.log(`\nBackup concluído com sucesso! Arquivo salvo em: ${backupFilePath}`);
    
    // Listar todos os backups disponíveis
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        // Ordenar por data de modificação (mais recente primeiro)
        return fs.statSync(path.join(backupDir, b)).mtime.getTime() - 
               fs.statSync(path.join(backupDir, a)).mtime.getTime();
      });
    
    console.log('\nBackups disponíveis:');
    backupFiles.forEach((file, index) => {
      const stats = fs.statSync(path.join(backupDir, file));
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`${index + 1}. ${file} (${fileSizeInMB} MB) - ${stats.mtime.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('Erro ao fazer backup:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await pool.end();
  }
}

// Executar o backup
backupDatabase();
