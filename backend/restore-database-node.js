/**
 * Script para restaurar o banco de dados PostgreSQL a partir de um backup JSON
 * Este script não depende de psql, apenas do driver pg do Node.js
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Pasta de backups
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  console.error('Pasta de backups não encontrada!');
  process.exit(1);
}

// Listar todos os backups disponíveis
const backupFiles = fs.readdirSync(backupDir)
  .filter(file => file.endsWith('.json'))
  .sort((a, b) => {
    // Ordenar por data de modificação (mais recente primeiro)
    return fs.statSync(path.join(backupDir, b)).mtime.getTime() - 
           fs.statSync(path.join(backupDir, a)).mtime.getTime();
  });

if (backupFiles.length === 0) {
  console.error('Nenhum arquivo de backup encontrado!');
  process.exit(1);
}

console.log('Backups disponíveis:');
backupFiles.forEach((file, index) => {
  const stats = fs.statSync(path.join(backupDir, file));
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`${index + 1}. ${file} (${fileSizeInMB} MB) - ${stats.mtime.toLocaleString()}`);
});

// Interface para ler entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Perguntar qual backup restaurar
rl.question('\nDigite o número do backup que deseja restaurar: ', (answer) => {
  const backupIndex = parseInt(answer, 10) - 1;
  
  if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backupFiles.length) {
    console.error('Número inválido!');
    rl.close();
    process.exit(1);
  }
  
  const selectedBackup = backupFiles[backupIndex];
  const backupFilePath = path.join(backupDir, selectedBackup);
  
  // Confirmar restauração
  rl.question(`\nATENÇÃO: Você está prestes a restaurar o banco de dados a partir do backup:\n${selectedBackup}\n\nTodos os dados atuais serão substituídos. Continuar? (s/N): `, async (confirm) => {
    if (confirm.toLowerCase() !== 's') {
      console.log('Operação cancelada pelo usuário.');
      rl.close();
      return;
    }
    
    try {
      // Carregar o arquivo de backup
      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      
      // Configurar conexão com o banco de dados
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10),
      });
      
      console.log(`\nIniciando restauração do banco de dados a partir do backup ${selectedBackup}...`);
      
      // Obter um cliente para transação
      const client = await pool.connect();
      
      try {
        // Iniciar transação
        await client.query('BEGIN');
        
        // Restaurar cada tabela
        for (const tableName of Object.keys(backupData.data)) {
          const tableData = backupData.data[tableName];
          
          console.log(`Restaurando tabela: ${tableName} (${tableData.length} registros)`);
          
          // Limpar tabela
          await client.query(`DELETE FROM "${tableName}"`);
          
          // Se não há dados para restaurar, continuar para a próxima tabela
          if (tableData.length === 0) {
            console.log(`  - Tabela ${tableName} está vazia, pulando.`);
            continue;
          }
          
          // Obter colunas do primeiro registro
          const columns = Object.keys(tableData[0]);
          
          // Restaurar registros em lotes de 100
          const batchSize = 100;
          for (let i = 0; i < tableData.length; i += batchSize) {
            const batch = tableData.slice(i, i + batchSize);
            
            for (const record of batch) {
              const values = columns.map(col => record[col]);
              const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
              
              const query = `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
              
              try {
                await client.query(query, values);
              } catch (err) {
                console.error(`Erro ao inserir registro em ${tableName}:`, err.message);
                // Continuar mesmo com erro
              }
            }
            
            console.log(`  - Restaurados ${Math.min(i + batchSize, tableData.length)} de ${tableData.length} registros`);
          }
        }
        
        // Confirmar transação
        await client.query('COMMIT');
        console.log('\nRestauração concluída com sucesso!');
        
      } catch (error) {
        // Reverter transação em caso de erro
        await client.query('ROLLBACK');
        console.error('Erro durante a restauração:', error);
        console.log('A restauração foi revertida. O banco de dados não foi alterado.');
      } finally {
        // Liberar cliente
        client.release();
        // Fechar pool
        await pool.end();
        rl.close();
      }
      
    } catch (error) {
      console.error('Erro ao processar arquivo de backup:', error);
      rl.close();
    }
  });
});
