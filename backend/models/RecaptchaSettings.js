const db = require('../db');

class RecaptchaSettings {
  // Obter as configurações do reCAPTCHA
  static async get() {
    try {
      const query = `
        SELECT * FROM system_settings 
        WHERE category = 'recaptcha'
      `;
      
      const { rows } = await db.query(query);
      
      // Transformar os resultados em um objeto
      const settings = {};
      rows.forEach(row => {
        settings[row.key] = row.value;
      });
      
      // Configuração padrão se não existir no banco de dados
      const defaultConfig = {
        enabled: 'true',
        siteKey: process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste
        secretKey: process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Chave de teste
        threshold: '3' // Número de tentativas antes de mostrar o reCAPTCHA
      };
      
      // Mesclar as configurações do banco com os valores padrão
      return {
        enabled: settings.enabled !== undefined ? settings.enabled === 'true' : defaultConfig.enabled === 'true',
        siteKey: settings.siteKey || defaultConfig.siteKey,
        secretKey: settings.secretKey || defaultConfig.secretKey,
        threshold: parseInt(settings.threshold || defaultConfig.threshold)
      };
    } catch (error) {
      console.error('Erro ao buscar configurações do reCAPTCHA:', error);
      throw error;
    }
  }
  
  // Atualizar as configurações do reCAPTCHA
  static async update(settings) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Para cada configuração, inserir ou atualizar
      for (const [key, value] of Object.entries(settings)) {
        const query = `
          INSERT INTO system_settings (category, key, value)
          VALUES ('recaptcha', $1, $2)
          ON CONFLICT (category, key) 
          DO UPDATE SET value = $2
        `;
        
        await client.query(query, [key, value.toString()]);
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar configurações do reCAPTCHA:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = RecaptchaSettings;
