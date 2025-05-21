import { PWAManifest, PWAIcon, PWASplashScreen } from '../types/pwa';
import { useToast } from '../hooks/useToast';

export class PWAService {
  private static instance: PWAService;
  private toast = useToast();

  private constructor() {}

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  async getManifest(): Promise<PWAManifest> {
    try {
      const response = await fetch('/manifest.json');
      if (!response.ok) {
        throw new Error('Erro ao carregar manifest');
      }
      return await response.json();
    } catch (error) {
      this.toast.error('Erro ao carregar configurações do PWA');
      throw error;
    }
  }

  async updateManifest(manifest: PWAManifest): Promise<void> {
    try {
      const response = await fetch('/manifest.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manifest),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar manifest');
      }

      // Atualizar cache do service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
        });
      }

      this.toast.success('Configurações do PWA atualizadas com sucesso!');
    } catch (error) {
      this.toast.error('Erro ao atualizar configurações do PWA');
      throw error;
    }
  }

  async generateIcons(file: File): Promise<PWAIcon[]> {
    const iconSizes = [
      { size: '32x32' },
      { size: '48x48' },
      { size: '96x96' },
      { size: '128x128' },
      { size: '192x192' },
      { size: '256x256' },
      { size: '384x384' },
      { size: '512x512' }
    ];

    // Aqui você pode adicionar a lógica para gerar os ícones em diferentes tamanhos
    // Por exemplo, usando uma biblioteca como sharp ou imagemagick
    
    return iconSizes.map(size => ({
      src: `assets/icons/icon-${size.size}.png`,
      sizes: size.size,
      type: 'image/png',
      purpose: 'any maskable'
    }));
  }

  async addSplashScreen(file: File, platform: string, orientation: string): Promise<PWASplashScreen> {
    // Aqui você pode adicionar a lógica para salvar o splash screen
    // Por exemplo, usando uma biblioteca de processamento de imagens
    
    return {
      src: `assets/splash-screens/splash-${platform}-${orientation}.png`,
      sizes: '1242x2688', // Tamanho padrão para iOS
      platform,
      orientation
    };
  }
}
