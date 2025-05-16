import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from '../lib/db/config';
import { logger } from '../utils/logger';
import { Encryption } from '../utils/encryption';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class BackupService {
  private static instance: BackupService;
  private backupDir: string;
  private encryption: Encryption;

  private constructor() {
    this.backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
    this.encryption = Encryption.getInstance();
    this.ensureBackupDir();
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  private ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Cria backup do banco de dados
  public async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.sql`;
      const filepath = path.join(this.backupDir, filename);

      // Comando para backup do PostgreSQL
      const command = `pg_dump -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -F c -f ${filepath}`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.POSTGRES_PASSWORD
        }
      });

      // Criptografa o arquivo de backup
      const encryptedFilepath = `${filepath}.enc`;
      const fileContent = fs.readFileSync(filepath, 'utf8');
      const encryptedContent = this.encryption.encrypt(fileContent);
      fs.writeFileSync(encryptedFilepath, encryptedContent);

      // Remove o arquivo não criptografado
      fs.unlinkSync(filepath);

      logger.info('Backup created successfully', { filename: encryptedFilepath });
      return encryptedFilepath;
    } catch (error) {
      logger.error('Backup creation failed:', error);
      throw new Error('Falha ao criar backup');
    }
  }

  // Restaura backup do banco de dados
  public async restoreBackup(backupFile: string): Promise<void> {
    try {
      const filepath = path.join(this.backupDir, backupFile);
      
      // Descriptografa o arquivo
      const encryptedContent = fs.readFileSync(filepath, 'utf8');
      const decryptedContent = this.encryption.decrypt(encryptedContent);
      const tempFile = `${filepath}.temp`;
      fs.writeFileSync(tempFile, decryptedContent);

      // Comando para restaurar backup
      const command = `pg_restore -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -c ${tempFile}`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.POSTGRES_PASSWORD
        }
      });

      // Remove arquivo temporário
      fs.unlinkSync(tempFile);

      logger.info('Backup restored successfully', { filename: backupFile });
    } catch (error) {
      logger.error('Backup restoration failed:', error);
      throw new Error('Falha ao restaurar backup');
    }
  }

  // Lista backups disponíveis
  public listBackups(): string[] {
    try {
      return fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.enc'))
        .sort((a, b) => {
          const dateA = new Date(a.split('-')[1].split('.')[0]);
          const dateB = new Date(b.split('-')[1].split('.')[0]);
          return dateB.getTime() - dateA.getTime();
        });
    } catch (error) {
      logger.error('Failed to list backups:', error);
      throw new Error('Falha ao listar backups');
    }
  }

  // Remove backups antigos
  public async cleanupOldBackups(maxAgeDays: number = 30): Promise<void> {
    try {
      const files = this.listBackups();
      const now = new Date();
      
      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = fs.statSync(filepath);
        const ageDays = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (ageDays > maxAgeDays) {
          fs.unlinkSync(filepath);
          logger.info('Old backup removed', { filename: file, age: ageDays });
        }
      }
    } catch (error) {
      logger.error('Backup cleanup failed:', error);
      throw new Error('Falha ao limpar backups antigos');
    }
  }
} 