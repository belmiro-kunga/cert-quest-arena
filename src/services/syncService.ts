import { addOfflineRequest, getPendingRequests, updateRequestStatus, incrementRetries, clearCompletedRequests } from '../utils/offlineDb';

interface SyncConfig {
  maxRetries: number;
  retryDelay: number;
  retryBackoff: number;
}

const DEFAULT_CONFIG: SyncConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryBackoff: 2, // Multiplicador para backoff exponencial
};

export class SyncService {
  private static instance: SyncService;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor(config: SyncConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  public static getInstance(config?: SyncConfig): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService(config || DEFAULT_CONFIG);
    }
    return SyncService.instance;
  }

  // Adicionar requisição para sincronização offline
  public async addRequest(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ) {
    return addOfflineRequest({
      type: method.toLowerCase(),
      url,
      method,
      headers,
      body,
    });
  }

  // Iniciar serviço de sincronização
  public startSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.processPendingRequests();
    }, 5000); // Verificar a cada 5 segundos

    // Processar requisições pendentes imediatamente
    this.processPendingRequests();
  }

  // Processar requisições pendentes
  private async processPendingRequests() {
    try {
      const pending = await getPendingRequests();
      if (pending.length === 0) return;

      for (const request of pending) {
        if (request.retries >= this.config.maxRetries) {
          await updateRequestStatus(request.id, 'failed');
          continue;
        }

        try {
          const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
          });

          if (response.ok) {
            await updateRequestStatus(request.id, 'success');
          } else {
            await incrementRetries(request.id);
            await updateRequestStatus(request.id, 'pending');
          }
        } catch (error) {
          console.error('Erro ao processar requisição:', error);
          await incrementRetries(request.id);
          await updateRequestStatus(request.id, 'pending');
        }
      }

      // Limpar requisições completadas
      await clearCompletedRequests();
    } catch (error) {
      console.error('Erro ao processar requisições pendentes:', error);
    }
  }

  // Parar serviço de sincronização
  public stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Limpar todas as requisições
  public async clearRequests() {
    await clearCompletedRequests();
  }
}
