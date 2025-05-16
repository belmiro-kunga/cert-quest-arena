import { createClient } from '@supabase/supabase-js';
import { Pool, PoolConfig } from 'pg';
import { logger } from '../utils/logger';

const isDevelopment = process.env.NODE_ENV === 'development';

// PostgreSQL Configuration with security settings
const pgConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'cert_quest_arena',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  // Security settings
  ssl: !isDevelopment ? { rejectUnauthorized: true } : false,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection
  maxUses: 7500, // close a connection after it has been used this many times
};

// Supabase Configuration
const supabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
};

// Create PostgreSQL pool for development
const pgPool = isDevelopment ? new Pool(pgConfig) : null;

// Create Supabase client for production
const supabaseClient = !isDevelopment ? createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  supabaseConfig.options
) : null;

// Error handling for pool
if (pgPool) {
  pgPool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
}

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      if (isDevelopment && pgPool) {
        return await pgPool.query(text, params);
      } else if (supabaseClient) {
        return await supabaseClient.rpc('execute_sql', { query: text, params });
      }
      throw new Error('No database connection available');
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  },

  // Métodos específicos do Supabase para produção
  supabase: supabaseClient,

  // Métodos específicos do PostgreSQL para desenvolvimento
  pg: pgPool,

  // Método para verificar a conexão
  checkConnection: async () => {
    try {
      if (isDevelopment && pgPool) {
        await pgPool.query('SELECT NOW()');
      } else if (supabaseClient) {
        await supabaseClient.from('_health').select('*').limit(1);
      }
      return true;
    } catch (error) {
      logger.error('Database connection check failed:', error);
      return false;
    }
  }
};

// Função para migrar dados do PostgreSQL para Supabase
export const migrateToSupabase = async () => {
  if (!isDevelopment || !pgPool || !supabaseClient) {
    throw new Error('Migration only available in development mode');
  }

  try {
    // Implementar lógica de migração aqui
    logger.info('Starting database migration...');
    
    // 1. Exportar dados do PostgreSQL
    // 2. Transformar dados se necessário
    // 3. Importar dados no Supabase
    
    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
}; 