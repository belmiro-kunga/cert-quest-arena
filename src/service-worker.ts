import { CACHE_CONFIG, CACHE_STRATEGIES, CACHE_LIMIT } from './config/service-worker-config';

// Definições globais para o TypeScript
declare const self: ServiceWorkerGlobalScope & {
  skipWaiting: () => Promise<void>;
  clients: ServiceWorkerClients;
  clientsClaim: () => Promise<void>;
  registration: ServiceWorkerRegistration;
};

declare const caches: CacheStorage;

// Tipos para eventos do service worker
type ServiceWorkerEvent = FetchEvent & {
  respondWith: (response: Promise<Response>) => void;
};

type SyncEvent = ExtendableEvent & {
  tag: string;
};

// Definição do tipo PushEvent
interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface PushMessageData {
  json(): any;
}

// Definição do tipo Transferable
interface Transferable {
  transfer(): void;
}

// Definição do tipo ServiceWorkerClient
interface ServiceWorkerClient {
  id: string;
  type: 'window' | 'worker' | 'sharedworker' | 'all';
  url: string;
  postMessage(message: any, transfer?: Transferable[]): void;
}

// Definição do tipo ServiceWorkerClients
interface ServiceWorkerClients {
  claim(): Promise<void>;
  get(id: string): Promise<ServiceWorkerClient | null>;
  matchAll(options?: ClientQueryOptions): Promise<ServiceWorkerClient[]>;
}

// Definição do tipo ClientQueryOptions
interface ClientQueryOptions {
  includeUncontrolled?: boolean;
  type?: 'window' | 'worker' | 'sharedworker' | 'all';
}

// Definição do tipo FetchEvent
interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response>): void;
}

// Definição do tipo NotificationEvent
interface NotificationEvent extends ExtendableEvent {
  notification: Notification;
}

// Definição do tipo Notification
interface Notification {
  close(): void;
  data: any;
}

// Definição do tipo ServiceWorkerRegistration com sync
interface ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  };
}

declare namespace ServiceWorkerRegistration {
  interface Sync {
    register(tag: string): Promise<void>;
  }
}

// Função para limpar cache antigo
const trimCache = async (cacheName: string, maxEntries: number) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length <= maxEntries) return;

  // Ordenar por data de modificação
  const sortedKeys = [...keys].sort((a, b) => {
    const dateA = new Date(a.headers.get('Date') || '').getTime();
    const dateB = new Date(b.headers.get('Date') || '').getTime();
    return dateB - dateA;
  });

  const entriesToDelete = sortedKeys.slice(maxEntries);
  await Promise.all(
    entriesToDelete.map(key => cache.delete(key))
  );
};

// Função para verificar se o cache está expirado
const isCacheExpired = (cacheName: string, timestamp: number): boolean => {
  const strategy = CACHE_STRATEGIES[cacheName as keyof typeof CACHE_STRATEGIES];
  if (!strategy?.maxAge) return false;
  return Date.now() - timestamp > strategy.maxAge;
};

// Função para limpar cache expirado
const cleanupExpiredCache = async (cacheName: string) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  await Promise.all(
    keys.map(async (key) => {
      const response = await cache.match(key);
      if (response && isCacheExpired(cacheName, Date.parse(response.headers.get('Date') || '0'))) {
        await cache.delete(key);
      }
    })
  );
};

// Instalação do service worker
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_CONFIG.static.cacheName).then(cache => {
      return cache.addAll(CACHE_CONFIG.static.urls);
    }).then(() => {
      // Ativar o service worker após a instalação
      return self.skipWaiting();
    })
  );
});

// Atualização do service worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith('cert-quest-')) {
            return Promise.resolve();
          }
          if (cacheName === CACHE_CONFIG.static.cacheName) {
            return Promise.resolve();
          }
          return caches.delete(cacheName);
        })
      ).then(() => {
        // Notificar clientes ativos sobre a atualização
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'UPDATE_AVAILABLE' });
          });
        });
      }).then(() => {
        // Ativar o service worker para os clientes existentes
        return self.clients.claim();
      });
    })
  );
});

// Evento fetch
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // Verificar tipo de recurso
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleNetworkFirst(event, CACHE_CONFIG.data.cacheName));
  } else if (url.pathname.startsWith('/assets/images/')) {
    event.respondWith(handleCacheFirst(event, CACHE_CONFIG.image.cacheName));
  } else if (url.pathname.startsWith('/assets/fonts/')) {
    event.respondWith(handleCacheFirst(event, CACHE_CONFIG.font.cacheName));
  } else {
    // Cache dinâmico para páginas
    event.respondWith(
      caches.match(event.request).then(async (response) => {
        if (response) {
          return response;
        }

        try {
          const networkResponse = await fetch(event.request);
          
          // Criar cache dinâmico para a página
          const dynamicCache = await caches.open(CACHE_CONFIG.dynamic.cacheName);
          dynamicCache.put(event.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          // Se estiver offline, tentar servir a página offline
          const offlineCache = await caches.open(CACHE_CONFIG.offline.cacheName);
          const offlineResponse = await offlineCache.match('/offline.html');
          
          if (offlineResponse) {
            return offlineResponse;
          }
          
          // Se não houver página offline, servir a página padrão offline
          return caches.match('/offline.html');
        }
      })
    );
  }
});

// Estratégia cache-first com limpeza
async function handleCacheFirst(event: FetchEvent, cacheName: string) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(event.request);

  if (response) {
    // Verificar se o cache está expirado
    if (isCacheExpired(cacheName, Date.parse(response.headers.get('Date') || '0'))) {
      await cache.delete(event.request);
      return fetch(event.request);
    }
    return response;
  }
  
  try {
    const networkResponse = await fetch(event.request);
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return caches.match('/offline.html');
  }
}

// Estratégia network-first com cache
async function handleNetworkFirst(event: FetchEvent, cacheName: string) {
  try {
    const networkResponse = await fetch(event.request);
    const cache = await caches.open(cacheName);
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(event.request);
    return cachedResponse || caches.match('/offline.html');
  }
}

// Suporte a notificações push
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nova Notificação', {
      body: data.body || 'Você tem uma nova notificação',
      icon: data.icon || '/icon-192x192.png',
      data: data.data,
      tag: data.tag || Date.now().toString()
    })
  );
});

// Suporte a background sync
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'retry-sync') {
    event.waitUntil(
      syncPendingAPIs().catch((error) => {
        console.error('Erro na sincronização:', error);
        // Tentar novamente em 5 minutos
        setTimeout(() => {
          self.registration.sync.register('retry-sync');
        }, 5 * 60 * 1000);
      })
    );
  }
});

// Suporte a APIs nativas
self.addEventListener('message', (event: MessageEvent) => {
  if (event.data.type === 'NATIVE_API') {
    switch (event.data.action) {
      case 'SHARE':
        if (navigator.share) {
          navigator.share(event.data.data).catch((error) => {
            console.error('Erro ao compartilhar:', error);
          });
        }
        break;
      case 'CAMERA':
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              // Processar o stream de vídeo
              event.source?.postMessage({
                type: 'CAMERA_RESPONSE',
                data: { success: true, stream: stream }
              });
            })
            .catch((error) => {
              console.error('Erro ao acessar câmera:', error);
              event.source?.postMessage({
                type: 'CAMERA_RESPONSE',
                data: { success: false, error: error.message }
              });
            });
        }
        break;
      case 'VIBRATE':
        if (navigator.vibrate) {
          navigator.vibrate(event.data.data.pattern || 1000);
        }
        break;
    }
  }
});

// Suporte a sincronização
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'retry-sync') {
    event.waitUntil(
      syncPendingAPIs()
    );
  }
});

// Queue para chamadas API pendentes
let pendingAPIs: Array<{ url: string; method: string; body?: any }> = [];

// Função para adicionar chamadas pendentes
function addToPendingAPIs(url: string, method: string, body?: any) {
  const pendingAPIs = JSON.parse(localStorage.getItem('pendingAPIs') || '[]');
  pendingAPIs.push({ url, method, body });
  localStorage.setItem('pendingAPIs', JSON.stringify(pendingAPIs));
}

// Função para sincronizar chamadas pendentes
async function syncPendingAPIs() {
  const pendingAPIs = JSON.parse(localStorage.getItem('pendingAPIs') || '[]');
  if (pendingAPIs.length === 0) return;

  for (const api of pendingAPIs) {
    try {
      const response = await fetch(api.url, {
        method: api.method,
        body: api.body ? JSON.stringify(api.body) : undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao sincronizar API: ${response.statusText}`);
      }
      
      // Remover API sincronizada
      const index = pendingAPIs.indexOf(api);
      if (index > -1) {
        pendingAPIs.splice(index, 1);
      }
    } catch (error) {
      console.error('Erro ao sincronizar API:', error);
    }
  }
  
  // Atualizar localStorage
  localStorage.setItem('pendingAPIs', JSON.stringify(pendingAPIs));
}

// Evento de clique em notificação
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  if (event.notification.data?.url) {
    event.waitUntil(
      self.clients.matchAll({
        type: 'window'
      }).then(async (windowClients) => {
        let client = windowClients.find((client) => client.url === event.notification.data.url);
        
        if (client) {
          await client.focus();
        } else {
          await self.clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
