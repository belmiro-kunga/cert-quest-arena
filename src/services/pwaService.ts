import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { manifest } from '../manifest.json';

interface PWAConfig {
  manifest: typeof manifest;
}

const CONFIG_FILE = join(process.cwd(), 'public', 'config.json');

export const pwaService = {
  async loadConfig(): Promise<PWAConfig> {
    try {
      if (existsSync(CONFIG_FILE)) {
        const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
        return config;
      }
      return {
        manifest: manifest
      };
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return {
        manifest: manifest
      };
    }
  },

  async saveConfig(config: PWAConfig): Promise<void> {
    try {
      writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  },

  async updateManifest(config: PWAConfig): Promise<void> {
    try {
      const manifestPath = join(process.cwd(), 'public', 'manifest.json');
      writeFileSync(manifestPath, JSON.stringify(config.manifest, null, 2));
    } catch (error) {
      console.error('Erro ao atualizar manifest:', error);
    }
  }
};
