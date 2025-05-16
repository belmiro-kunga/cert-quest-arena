const db = require('../db');

class AuthSettings {
  static async getAll() {
    try {
      const result = await db.query(
        'SELECT provider, client_id, client_secret, callback_url, enabled FROM auth_settings'
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar configurações de autenticação:', error);
      throw error;
    }
  }

  static async getByProvider(provider) {
    try {
      const result = await db.query(
        'SELECT provider, client_id, client_secret, callback_url, enabled FROM auth_settings WHERE provider = $1',
        [provider]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar configuração do provedor:', error);
      throw error;
    }
  }

  static async upsert(provider, { clientId, clientSecret, callbackUrl, enabled }) {
    try {
      const existingConfig = await this.getByProvider(provider);

      if (existingConfig) {
        const result = await db.query(
          `UPDATE auth_settings 
           SET client_id = $1, 
               client_secret = $2, 
               callback_url = $3, 
               enabled = $4,
               updated_at = CURRENT_TIMESTAMP
           WHERE provider = $5
           RETURNING provider, client_id, client_secret, callback_url, enabled`,
          [clientId, clientSecret, callbackUrl, enabled, provider]
        );
        return result.rows[0];
      } else {
        const result = await db.query(
          `INSERT INTO auth_settings 
           (provider, client_id, client_secret, callback_url, enabled)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING provider, client_id, client_secret, callback_url, enabled`,
          [provider, clientId, clientSecret, callbackUrl, enabled]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração de autenticação:', error);
      throw error;
    }
  }

  static async delete(provider) {
    try {
      await db.query('DELETE FROM auth_settings WHERE provider = $1', [provider]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir configuração de autenticação:', error);
      throw error;
    }
  }

  static async toggleProvider(provider, enabled) {
    try {
      const result = await db.query(
        `UPDATE auth_settings 
         SET enabled = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE provider = $2
         RETURNING provider, client_id, client_secret, callback_url, enabled`,
        [enabled, provider]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao alterar status do provedor:', error);
      throw error;
    }
  }
}

module.exports = AuthSettings;
