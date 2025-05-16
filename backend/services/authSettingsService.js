const db = require('../db');

class AuthSettingsService {
  async getSettings() {
    try {
      const result = await db.query(
        'SELECT provider, client_id, client_secret, callback_url, enabled FROM auth_settings'
      );

      // Transformar os resultados em um objeto mais amigável
      const settings = {
        google: {
          clientId: '',
          clientSecret: '',
          callbackUrl: `${process.env.FRONTEND_URL}/auth/google/callback`,
          enabled: false
        },
        github: {
          clientId: '',
          clientSecret: '',
          callbackUrl: `${process.env.FRONTEND_URL}/auth/github/callback`,
          enabled: false
        }
      };

      result.rows.forEach(row => {
        if (row.provider === 'google' || row.provider === 'github') {
          settings[row.provider] = {
            clientId: row.client_id || '',
            clientSecret: row.client_secret || '',
            callbackUrl: row.callback_url || settings[row.provider].callbackUrl,
            enabled: row.enabled
          };
        }
      });

      return settings;
    } catch (error) {
      console.error('Erro ao buscar configurações de autenticação:', error);
      throw error;
    }
  }

  async updateSettings(provider, config) {
    try {
      // Verificar se já existe configuração para este provedor
      const existingConfig = await db.query(
        'SELECT id FROM auth_settings WHERE provider = $1',
        [provider]
      );

      if (existingConfig.rows.length > 0) {
        // Atualizar configuração existente
        await db.query(
          `UPDATE auth_settings 
           SET client_id = $1, 
               client_secret = $2, 
               callback_url = $3, 
               enabled = $4,
               updated_at = CURRENT_TIMESTAMP
           WHERE provider = $5`,
          [
            config.clientId,
            config.clientSecret,
            config.callbackUrl,
            config.enabled,
            provider
          ]
        );
      } else {
        // Criar nova configuração
        await db.query(
          `INSERT INTO auth_settings 
           (provider, client_id, client_secret, callback_url, enabled)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            provider,
            config.clientId,
            config.clientSecret,
            config.callbackUrl,
            config.enabled
          ]
        );
      }

      // Se o provedor foi desativado, remover as credenciais
      if (!config.enabled) {
        await db.query(
          `UPDATE auth_settings 
           SET client_id = '', 
               client_secret = ''
           WHERE provider = $1`,
          [provider]
        );
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações de autenticação:', error);
      throw error;
    }
  }

  // Método para obter configurações ativas para uso no sistema de autenticação
  async getActiveProviderConfig(provider) {
    try {
      const result = await db.query(
        'SELECT client_id, client_secret, callback_url FROM auth_settings WHERE provider = $1 AND enabled = true',
        [provider]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const config = result.rows[0];
      return {
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: config.callback_url
      };
    } catch (error) {
      console.error('Erro ao buscar configuração do provedor:', error);
      throw error;
    }
  }
}

module.exports = new AuthSettingsService();
