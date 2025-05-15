/**
 * Script para restaurar o banco de dados PostgreSQL a partir de um backup
 * Executa o comando psql para restaurar um arquivo de backup
 */
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Pasta de backups
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  console.error('Pasta de backups não encontrada!');
  process.exit(1);
}

// Listar todos os backups disponíveis
const backupFiles = fs.readdirSync(backupDir)
  .filter(file => file.endsWith('.sql'))
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
  rl.question(`\nATENÇÃO: Você está prestes a restaurar o banco de dados a partir do backup:\n${selectedBackup}\n\nTodos os dados atuais serão substituídos. Continuar? (s/N): `, (confirm) => {
    if (confirm.toLowerCase() !== 's') {
      console.log('Operação cancelada pelo usuário.');
      rl.close();
      return;
    }
    
    // Obter variáveis de ambiente para conexão com o banco
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';
    const dbName = process.env.DB_NAME || 'certquest';
    
    console.log(`\nIniciando restauração do banco de dados ${dbName} a partir do backup ${selectedBackup}...`);
    
    // Comando para restaurar o backup usando psql
    // Nota: PGPASSWORD é definido como variável de ambiente para evitar prompt de senha
    const command = `set PGPASSWORD=${dbPassword} && psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${backupFilePath}"`;
    
    // Executar o comando
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao restaurar backup: ${error.message}`);
        rl.close();
        return;
      }
      
      if (stderr) {
        // psql envia mensagens para stderr, mas não são necessariamente erros
        console.log(`Saída do processo de restauração: ${stderr}`);
      }
      
      console.log(`Restauração concluída com sucesso!`);
      rl.close();
    });
  });
});
