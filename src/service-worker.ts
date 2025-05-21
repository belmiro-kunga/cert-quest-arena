const CACHE_NAME = 'cert-quest-arena-v1';
const STATIC_CACHE = 'cert-quest-static-v1';
const DYNAMIC_CACHE = 'cert-quest-dynamic-v1';
const OFFLINE_CACHE = 'cert-quest-offline-v1';
const DATA_CACHE = 'cert-quest-data-v1';
const IMAGE_CACHE = 'cert-quest-images-v1';
const FONT_CACHE = 'cert-quest-fonts-v1';

// Configuração de cache
const CACHE_CONFIG = {
  static: {
    cacheName: STATIC_CACHE,
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
      '/assets/icons/icon-512x512.png',
      '/assets/fonts/*',
      '/assets/images/*',
      '/assets/data/*'
    ],
    maxEntries: 50
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    maxEntries: 50,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  offline: {
    cacheName: OFFLINE_CACHE,
    maxEntries: 10,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  data: {
    cacheName: DATA_CACHE,
    maxEntries: 50,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
};

const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/assets/offline.css',
  '/assets/offline.js',
  '/assets/fonts/*',
  '/assets/images/*',
  '/assets/data/*'
];

// Estratégia de cache
const CACHE_STRATEGIES = {
  // Cache-first para assets estáticos
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxSize: 50
  },
  // Network-first para dados dinâmicos
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'networkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    maxSize: 50
  },
  // Offline-first para páginas
  offline: {
    cacheName: OFFLINE_CACHE,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    maxSize: 10
  },
  // Cache-first para dados
  data: {
    cacheName: DATA_CACHE,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    maxSize: 100
  },
  // Cache-first para imagens
  image: {
    cacheName: IMAGE_CACHE,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    maxSize: 100
  },
  // Cache-first para fontes
  font: {
    cacheName: FONT_CACHE,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxSize: 20
  }
};

// Limite do cache
const CACHE_LIMIT = {
  [STATIC_CACHE]: 50,
  [DYNAMIC_CACHE]: 50,
  [OFFLINE_CACHE]: 10,
  [DATA_CACHE]: 100,
  [IMAGE_CACHE]: 100,
  [FONT_CACHE]: 20
};

// Função para limpar cache antigo
async function trimCache(cacheName: string, maxEntries: number) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

// Função para verificar se o cache está expirado
function isCacheExpired(cacheName: string, timestamp: number): boolean {
  const strategy = CACHE_STRATEGIES[cacheName as keyof typeof CACHE_STRATEGIES];
  if (!strategy?.maxAge) return false;
  return Date.now() - timestamp > strategy.maxAge;
}

// Função para limpar cache expirado
async function cleanupExpiredCache(cacheName: string) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  await Promise.all(
    keys.map(async (key) => {
      const response = await cache.match(key);
      if (response && isCacheExpired(cacheName, response.headers.get('Date') as unknown as number)) {
        await cache.delete(key);
      }
    })
  );
}

// Instalação do service worker
self.addEventListener('install', async (event: ExtendableEvent) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
});

// Ativação do service worker
self.addEventListener('activate', async (event: ExtendableEvent) => {
  const cacheNames = await caches.keys();
  
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith('cert-quest-') && cacheName !== CACHE_NAME)
      .map((cacheName) => caches.delete(cacheName))
  );
});

// Estratégia de fetch
self.addEventListener('fetch', async (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // Verificar tipo de recurso e aplicar estratégia apropriada
  if (url.pathname.startsWith('/api/')) {
    // Dados dinâmicos: network-first
    await handleNetworkFirst(event, DATA_CACHE);
  } else if (url.pathname.startsWith('/images/')) {
    // Imagens: cache-first com limpeza
    await handleCacheFirst(event, IMAGE_CACHE);
  } else if (url.pathname.startsWith('/fonts/')) {
    // Fontes: cache-first com longa duração
    await handleCacheFirst(event, FONT_CACHE);
  } else if (url.pathname.startsWith('/offline')) {
    // Página offline: cache-first
    await handleCacheFirst(event, OFFLINE_CACHE);
  } else {
    // Recursos estáticos: cache-first
    await handleCacheFirst(event, STATIC_CACHE);
  }
});

// Suporte a notificações push
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      tag: data.tag,
      data: data.data
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  if (event.notification.data?.url) {
    event.waitUntil(
      clients.matchAll({
        type: 'window'
      }).then((windowClients) => {
        let client = windowClients.find((client) => client.url === event.notification.data.url);
        
        if (client) {
          return client.focus();
        } else {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// Suporte a sincronização
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'retry-sync') {
    event.waitUntil(
      syncRequests()
    );
  }
});

// Estratégia cache-first com limpeza
async function handleCacheFirst(event: Event, cacheName: string) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(event.request);

  if (response) {
    // Verificar se o cache está expirado
    if (isCacheExpired(cacheName, Date.parse(response.headers.get('Date') || '0'))) {
      await cleanupExpiredCache(cacheName);
      return fetch(event.request);
    }
    return response;
  }

  try {
    const networkResponse = await fetch(event.request);
    if (!networkResponse.ok) {
      return networkResponse;
    }

    const responseToCache = networkResponse.clone();
    await cache.put(event.request, responseToCache);
    await trimCache(cacheName, CACHE_LIMIT[cacheName]);

    return networkResponse;
  } catch {
    // Se falhar, usar página offline
    return cache.match('/offline.html');
  }
}

// Estratégia network-first com cache
async function handleNetworkFirst(event: Event, cacheName: string) {
  try {
    const networkResponse = await fetch(event.request);
    if (!networkResponse.ok) {
      return networkResponse;
    }

    const responseToCache = networkResponse.clone();
    const cache = await caches.open(cacheName);
    await cache.put(event.request, responseToCache);
    await trimCache(cacheName, CACHE_LIMIT[cacheName]);

    return networkResponse;
  } catch {
    // Se falhar, usar dados cacheados
    const cache = await caches.open(cacheName);
    const response = await cache.match(event.request);
    if (response) return response;
    
    // Se não houver dados cacheados, usar página offline
    return cache.match('/offline.html');
  }
}

const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/assets/offline.css',
  '/assets/offline.js',
  '/assets/fonts/*',
  '/assets/images/*',
  '/assets/data/*'
];

// Estratégia de cache
const CACHE_STRATEGIES = {
  // Cache-first para assets estáticos
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxSize: 50
  },
  // Network-first para dados dinâmicos
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'networkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    maxSize: 50
  },
  // Offline-first para páginas
  offline: {
    cacheName: OFFLINE_CACHE,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    maxSize: 10
  },
  // Cache-first para dados
  data: {
    cacheName: DATA_CACHE,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    maxSize: 100
  },
  // Cache-first para imagens
  image: {
    cacheName: IMAGE_CACHE,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    maxSize: 100
  },
  // Cache-first para fontes
  font: {
    cacheName: FONT_CACHE,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxSize: 20
  }
};

// Limite do cache
const CACHE_LIMIT = {
  [STATIC_CACHE]: 50,
  [DYNAMIC_CACHE]: 50,
  [OFFLINE_CACHE]: 10,
  [DATA_CACHE]: 100,
  [IMAGE_CACHE]: 100,
  [FONT_CACHE]: 20
};

// Função para// Tipos para eventos do service worker
type FetchEvent = ExtendableEvent & {
  request: Request;
  respondWith: (response: Promise<Response>) => void;
};

// Função para limpar cache antigo
async function trimCache(cacheName: string, maxEntries: number) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

// Função para verificar se o cache está expirado
function isCacheExpired(cacheName: string, timestamp: number): boolean {
  const strategy = CACHE_STRATEGIES[cacheName as keyof typeof CACHE_STRATEGIES];
  if (!strategy?.maxAge) return false;
  return Date.now() - timestamp > strategy.maxAge;
}

// Função para limpar cache expirado
async function cleanupExpiredCache(cacheName: string) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  await Promise.all(
    keys.map(async (key) => {
      const response = await cache.match(key);
      if (response && isCacheExpired(cacheName, response.headers.get('Date') as unknown as number)) {
        await cache.delete(key);
      }
    })
  );
}

// Instalação do service worker
self.addEventListener('install', async (event: ExtendableEvent) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
});

// Ativação do service worker
self.addEventListener('activate', async (event: ExtendableEvent) => {
  const cacheNames = await caches.keys();
  
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith('cert-quest-') && cacheName !== CACHE_NAME)
      .map((cacheName) => caches.delete(cacheName))
  );
});

// Estratégia de fetch
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // Verificar tipo de recurso e aplicar estratégia apropriada
  if (url.pathname.startsWith('/api/')) {
    // Dados dinâmicos: network-first
    handleNetworkFirst(event, DATA_CACHE);
  } else if (url.pathname.startsWith('/images/')) {
    // Imagens: cache-first com limpeza
    handleCacheFirst(event, IMAGE_CACHE);
  } else if (url.pathname.startsWith('/fonts/')) {
    // Fontes: cache-first com longa duração
    handleCacheFirst(event, FONT_CACHE);
  } else if (url.pathname.startsWith('/offline')) {
    // Página offline: cache-first
    handleCacheFirst(event, OFFLINE_CACHE);
  } else {
    // Recursos estáticos: cache-first
    handleCacheFirst(event, STATIC_CACHE);
  }
});

// Estratégia cache-first com limpeza
async function handleCacheFirst(event: FetchEvent, cacheName: string) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(event.request);

  if (response) {
    // Verificar se o cache está expirado
    if (isCacheExpired(cacheName, Date.parse(response.headers.get('Date') || '0'))) {
      await cleanupExpiredCache(cacheName);
      return fetch(event.request);
    }
    return response;
  }

  try {
    const networkResponse = await fetch(event.request);
    if (!networkResponse.ok) {
      return networkResponse;
    }

    const responseToCache = networkResponse.clone();
    await cache.put(event.request, responseToCache);
    await trimCache(cacheName, CACHE_LIMIT[cacheName]);

    return networkResponse;
  } catch {
    // Se falhar, usar página offline
    return cache.match('/offline.html');
  }
}

// Estratégia network-first com cache
async function handleNetworkFirst(event: FetchEvent, cacheName: string) {
  try {
    const networkResponse = await fetch(event.request);
    if (!networkResponse.ok) {
      return networkResponse;
    }

    const responseToCache = networkResponse.clone();
    const cache = await caches.open(cacheName);
    await cache.put(event.request, responseToCache);
    await trimCache(cacheName, CACHE_LIMIT[cacheName]);

    return networkResponse;
  } catch {
    // Se falhar, usar dados cacheados
    const cache = await caches.open(cacheName);
    const response = await cache.match(event.request);
    if (response) return response;
    
    // Se não houver dados cacheados, usar página offline
    return cache.match('/offline.html');
  }
}

// Instalação do service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação do service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('cert-quest-') && cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Estratégia de fetch
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Verificar tipo de recurso
  if (url.pathname.startsWith('/api/')) {
    // Dados dinâmicos: network-first
  }

  // Verifica se é uma requisição para API
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      caches.open(CACHE_CONFIG.data.cacheName).then((cache) => {
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Para outros recursos, usa cache-first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;
      return fetch(request).then((networkResponse) => {
        caches.open(CACHE_CONFIG.static.cacheName).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Se falhar, retorna a página offline
        return caches.match('/offline.html');
      });
    })
  );
    }).catch(() => {
      // Se falhar, usar dados cacheados
      return caches.match(event.request);
    })
  );
}

// Sincronização offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-api-calls') {
    // Implementar lógica de retry para chamadas API
    event.waitUntil(
      syncPendingAPIs()
    );
  }
});

// Queue para chamadas API pendentes
let pendingAPIs: Array<{ url: string; method: string; body?: any }> = [];

// Função para adicionar chamadas pendentes
function addToPendingAPIs(url: string, method: string, body?: any) {
  pendingAPIs.push({ url, method, body });
  // Registrar evento de sync
  self.registration.sync.register('retry-api-calls');
}

// Função para sincronizar chamadas pendentes
async function syncPendingAPIs() {
  for (const api of pendingAPIs) {
    try {
      await fetch(api.url, {
        method: api.method,
        body: api.body ? JSON.stringify(api.body) : undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Falha ao sincronizar API:', error);
    }
  }
  pendingAPIs = [];
}
