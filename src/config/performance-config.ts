export const PERFORMANCE_CONFIG = {
  // Lazy Loading
  lazyLoading: {
    images: true,
    routes: true,
    components: true
  },

  // Compressão de imagens
  imageOptimization: {
    quality: 80,
    formats: ['webp', 'avif'],
    sizes: {
      mobile: 768,
      desktop: 1920
    }
  },

  // Cache
  cache: {
    static: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      include: ['index.html', '*.js', '*.css', '*.ico', '*.png', '*.jpg', '*.jpeg', '*.webp', '*.avif']
    },
    dynamic: {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      maxEntries: 50
    }
  },

  // Bundling
  bundling: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000
    },
    treeshaking: true,
    minification: true
  },

  // SEO
  seo: {
    titleTemplate: '%s | Cert Quest Arena',
    defaultTitle: 'Cert Quest Arena',
    defaultDescription: 'Plataforma de certificações profissionais',
    defaultKeywords: 'certificações, profissionais, desenvolvimento, carreira',
    robots: {
      allow: true,
      index: true,
      follow: true
    },
    sitemap: {
      enabled: true,
      changefreq: 'weekly',
      priority: 0.8
    }
  }
};
