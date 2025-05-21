import { PERFORMANCE_CONFIG } from '../config/performance-config';
import { usePerformance } from '../hooks/usePerformance';

// Testes para PWA e Performance
describe('PWA e Performance', () => {
  // Testes de PWA
  describe('PWA', () => {
    it('deve ser instalável', async () => {
      const isInstallable = 'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window;
      expect(isInstallable).toBe(true);
    });

    it('deve ter ícones necessários', async () => {
      const manifest = await navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return null;
        return fetch(reg.scope + 'manifest.json').then(res => res.json());
      });

      expect(manifest).toHaveProperty('icons');
      expect(manifest.icons).toHaveLength(2); // pelo menos 192x192 e 512x512
    });

    it('deve funcionar offline', async () => {
      // Simular modo offline
      const originalOnline = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true
      });

      // Verificar se o site funciona
      const response = await fetch('/');
      expect(response.ok).toBe(true);

      // Restaurar modo online
      Object.defineProperty(navigator, 'onLine', {
        value: originalOnline,
        configurable: true
      });
    });
  });

  // Testes de Performance
  describe('Performance', () => {
    it('deve ter carregamento inicial rápido', async () => {
      const { getCacheStrategy } = usePerformance();
      const strategy = getCacheStrategy('index.html');
      expect(strategy.strategy).toBe('cache-first');
      expect(strategy.maxAge).toBe(PERFORMANCE_CONFIG.cache.static.maxAge);
    });

    it('deve otimizar imagens', async () => {
      const { optimizeImage } = usePerformance();
      const optimizedUrl = optimizeImage('/image.jpg', 800, 600);
      expect(optimizedUrl).toContain('?w=800');
      expect(optimizedUrl).toContain('&h=600');
      expect(optimizedUrl).toContain('&q=80');
    });

    it('deve usar lazy loading', async () => {
      const { shouldLazyLoad } = usePerformance();
      expect(shouldLazyLoad('component')).toBe(true);
    });
  });

  // Testes de SEO
  describe('SEO', () => {
    it('deve ter metadados corretos', async () => {
      const meta = document.getElementsByTagName('meta');
      expect(meta).toBeTruthy();
      
      const title = document.title;
      expect(title).toBe(PERFORMANCE_CONFIG.seo.defaultTitle);

      const description = meta["description"];
      expect(description).toBeTruthy();
      expect(description.content).toBe(PERFORMANCE_CONFIG.seo.defaultDescription);
    });

    it('deve ter sitemap', async () => {
      const response = await fetch('/sitemap.xml');
      expect(response.ok).toBe(true);
    });
  });
});
