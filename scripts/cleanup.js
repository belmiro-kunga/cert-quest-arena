const fs = require('fs');
const path = require('path');

// Arquivos e diretórios para remover
const toRemove = [
  'backubanco',
  'supabase',
  'bun.lockb',
  'backend'
];

// Arquivos e diretórios para mover
const toMove = {
  'backend/scripts': 'server/scripts',
  'backend/__tests__': 'server/__tests__',
  'backend/migrations': 'server/migrations'
};

// Função para mover arquivos
function moveFiles(source, dest) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(dest, file);
    if (fs.existsSync(destPath)) {
      console.log(`Arquivo já existe no destino: ${destPath}`);
      return;
    }
    fs.renameSync(sourcePath, destPath);
    console.log(`Movido: ${sourcePath} -> ${destPath}`);
  });
}

// Função para remover diretório recursivamente
function removeDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      removeDirectory(filePath);
    } else {
      fs.unlinkSync(filePath);
      console.log(`Removido arquivo: ${filePath}`);
    }
  });
  
  fs.rmdirSync(dir);
  console.log(`Removido diretório: ${dir}`);
}

// Mover arquivos primeiro
Object.entries(toMove).forEach(([source, dest]) => {
  console.log(`Movendo arquivos de ${source} para ${dest}...`);
  moveFiles(source, dest);
});

// Depois remover diretórios e arquivos desnecessários
toRemove.forEach(item => {
  console.log(`Removendo ${item}...`);
  if (fs.existsSync(item)) {
    if (fs.lstatSync(item).isDirectory()) {
      removeDirectory(item);
    } else {
      fs.unlinkSync(item);
      console.log(`Removido arquivo: ${item}`);
    }
  }
}); 