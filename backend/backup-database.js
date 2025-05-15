/**
 * Script para fazer backup do banco de dados PostgreSQL
 * Executa o comando pg_dump para criar um arquivo de backup
 */
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Criar pasta de backups se não existir
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Obter data e hora atual para o nome do arquivo
const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
const backupFileName = `certquest_backup_${timestamp}.sql`;
const backupFilePath = path.join(backupDir, backupFileName);

// Obter variáveis de ambiente para conexão com o banco
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'certquest';

// Comando para fazer o backup usando pg_dump
// Nota: PGPASSWORD é definido como variável de ambiente para evitar prompt de senha
const command = `set PGPASSWORD=${dbPassword} && pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${backupFilePath}" -v`;

console.log('Iniciando backup do banco de dados...');
console.log(`Arquivo de backup será salvo em: ${backupFilePath}`);

// Executar o comando
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao fazer backup: ${error.message}`);
    return;
  }
  
  if (stderr) {
    // pg_dump envia mensagens de progresso para stderr, mas não são necessariamente erros
    console.log(`Saída do processo de backup: ${stderr}`);
  }
  
  console.log(`Backup concluído com sucesso! Arquivo salvo em: ${backupFilePath}`);
  
  // Listar todos os backups disponíveis
  const backupFiles = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
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
});
