export const CACHE_CONFIG = {
  static: {
    cacheName: 'cert-quest-static-v1',
    urls: [
      '/',
      '/index.html',
      '/assets/index.js',
      '/assets/index.css',
      '/manifest.json',
      '/favicon.ico',
      '/offline.html',
      '/assets/offline.css',
      '/assets/offline.js',
      '/assets/icons/icon-192x192.png',
      '/assets/icons/icon-512x512.png'
    ],
    maxEntries: 50
  },
  dynamic: {
    cacheName: 'cert-quest-dynamic-v1',
    maxEntries: 50,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  offline: {
    cacheName: 'cert-quest-offline-v1',
    maxEntries: 10,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  data: {
    cacheName: 'cert-quest-data-v1',
    maxEntries: 50,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  image: {
    cacheName: 'cert-quest-images-v1',
    maxEntries: 100,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
  },
  font: {
    cacheName: 'cert-quest-fonts-v1',
    maxEntries: 50,
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 ano
  }
};

export const CACHE_STRATEGIES = {
  static: {
    cacheName: CACHE_CONFIG.static.cacheName,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxSize: CACHE_CONFIG.static.maxEntries
  },
  dynamic: {
    cacheName: CACHE_CONFIG.dynamic.cacheName,
    strategy: 'networkFirst',
    maxAge: CACHE_CONFIG.dynamic.maxAge,
    maxSize: CACHE_CONFIG.dynamic.maxEntries
  },
  offline: {
    cacheName: CACHE_CONFIG.offline.cacheName,
    strategy: 'cacheFirst',
    maxAge: CACHE_CONFIG.offline.maxAge,
    maxSize: CACHE_CONFIG.offline.maxEntries
  },
  data: {
    cacheName: CACHE_CONFIG.data.cacheName,
    strategy: 'networkFirst',
    maxAge: CACHE_CONFIG.data.maxAge,
    maxSize: CACHE_CONFIG.data.maxEntries
  },
  image: {
    cacheName: CACHE_CONFIG.image.cacheName,
    strategy: 'cacheFirst',
    maxAge: CACHE_CONFIG.image.maxAge,
    maxSize: CACHE_CONFIG.image.maxEntries
  },
  font: {
    cacheName: CACHE_CONFIG.font.cacheName,
    strategy: 'cacheFirst',
    maxAge: CACHE_CONFIG.font.maxAge,
    maxSize: CACHE_CONFIG.font.maxEntries
  }
};

export const CACHE_LIMIT = {
  static: CACHE_CONFIG.static.maxEntries,
  dynamic: CACHE_CONFIG.dynamic.maxEntries,
  offline: CACHE_CONFIG.offline.maxEntries,
  data: CACHE_CONFIG.data.maxEntries,
  image: CACHE_CONFIG.image.maxEntries,
  font: CACHE_CONFIG.font.maxEntries
};
