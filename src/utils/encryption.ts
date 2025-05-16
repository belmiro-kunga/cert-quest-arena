import crypto from 'crypto';
import { logger } from './logger';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

export class Encryption {
  private static instance: Encryption;
  private key: Buffer;

  private constructor() {
    this.key = Buffer.from(ENCRYPTION_KEY, 'hex');
  }

  public static getInstance(): Encryption {
    if (!Encryption.instance) {
      Encryption.instance = new Encryption();
    }
    return Encryption.instance;
  }

  // Criptografa dados
  public encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Retorna IV + AuthTag + Dados Criptografados
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      logger.error('Encryption error:', error);
      throw new Error('Falha ao criptografar dados');
    }
  }

  // Descriptografa dados
  public decrypt(text: string): string {
    try {
      const [ivHex, authTagHex, encryptedHex] = text.split(':');
      
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      
      const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      logger.error('Decryption error:', error);
      throw new Error('Falha ao descriptografar dados');
    }
  }

  // Gera hash seguro para senhas
  public static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      100000, // Número de iterações
      64, // Tamanho do hash
      'sha512'
    ).toString('hex');
    
    return `${salt}:${hash}`;
  }

  // Verifica senha
  public static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(
      password,
      salt,
      100000,
      64,
      'sha512'
    ).toString('hex');
    
    return hash === verifyHash;
  }

  // Mascara dados sensíveis
  public static maskSensitiveData(data: string, type: 'email' | 'cpf' | 'phone'): string {
    switch (type) {
      case 'email':
        const [name, domain] = data.split('@');
        return `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}@${domain}`;
      
      case 'cpf':
        return `${data.slice(0, 3)}.${'*'.repeat(3)}.${'*'.repeat(3)}-${data.slice(-2)}`;
      
      case 'phone':
        return `(${data.slice(0, 2)}) ${'*'.repeat(5)}-${data.slice(-4)}`;
      
      default:
        return data;
    }
  }
} 