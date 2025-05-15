const db = require('../db');

// Criar a tabela de configurações do sistema se ela não existir
const createTableIfNotExists = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configurações padrão se não existirem
    const defaultSettings = [
      {
        key: 'site_name',
        value: 'Cert Quest Arena',
        description: 'Nome do site'
      },
      {
        key: 'site_description',
        value: 'Plataforma de simulados para certificações',
        description: 'Descrição do site'
      },
      {
        key: 'default_currency',
        value: 'USD',
        description: 'Moeda padrão do site (USD, BRL, EUR)'
      },
      {
        key: 'subscription_default_duration',
        value: '365',
        description: 'Duração padrão das subscrições em dias'
      }
    ];

    for (const setting of defaultSettings) {
      await db.query(`
        INSERT INTO system_settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `, [setting.key, setting.value, setting.description]);
    }

    console.log('Tabela de configurações do sistema verificada/criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabela de configurações do sistema:', error);
    throw error;
  }
};

// Obter todas as configurações
const getAllSettings = async () => {
  try {
    const result = await db.query('SELECT * FROM system_settings ORDER BY key');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar configurações do sistema:', error);
    throw error;
  }
};

// Obter uma configuração específica
const getSetting = async (key) => {
  try {
    const result = await db.query('SELECT * FROM system_settings WHERE key = $1', [key]);
    return result.rows[0];
  } catch (error) {
    console.error(`Erro ao buscar configuração ${key}:`, error);
    throw error;
  }
};

// Atualizar uma configuração
const updateSetting = async (key, value) => {
  try {
    const result = await db.query(`
      UPDATE system_settings
      SET value = $1, updated_at = CURRENT_TIMESTAMP
      WHERE key = $2
      RETURNING *
    `, [value, key]);
    return result.rows[0];
  } catch (error) {
    console.error(`Erro ao atualizar configuração ${key}:`, error);
    throw error;
  }
};

module.exports = {
  createTableIfNotExists,
  getAllSettings,
  getSetting,
  updateSetting
}; 