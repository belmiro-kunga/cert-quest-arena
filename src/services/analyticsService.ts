import { addOfflineRequest } from './offlineDb';

interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: string;
  data: Record<string, any>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly DB_NAME = 'analytics-db';
  private readonly STORE_NAME = 'events';
  private db: IDBDatabase | null = null;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = (event) => reject(event.target?.error);
      request.onsuccess = (event) => {
        this.db = (event.target as IDBRequest).result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  private async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.db) {
      await this.initDb();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(this.STORE_NAME, 'readwrite');
      if (!transaction) {
        reject(new Error('Database not initialized'));
        return;
      }

      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(event);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async trackPageView(path: string, title: string): Promise<void> {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'page_view',
      data: {
        path,
        title,
        timestamp: new Date().toISOString()
      }
    };

    await this.trackEvent(event);
    await this.syncEvents();
  }

  public async trackEventAction(
    category: string,
    action: string,
    label?: string,
    value?: number
  ): Promise<void> {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'event',
      data: {
        category,
        action,
        label,
        value,
        timestamp: new Date().toISOString()
      }
    };

    await this.trackEvent(event);
    await this.syncEvents();
  }

  private async syncEvents(): Promise<void> {
    if (!this.db) {
      await this.initDb();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(this.STORE_NAME, 'readonly');
      if (!transaction) {
        reject(new Error('Database not initialized'));
        return;
      }

      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = async () => {
        const events = request.result as AnalyticsEvent[];
        if (events.length === 0) {
          resolve();
          return;
        }

        try {
          await addOfflineRequest('/api/analytics', 'POST', {}, events);
          // Após adicionar à fila offline, limpamos os eventos locais
          const cleanup = this.db?.transaction(this.STORE_NAME, 'readwrite');
          if (cleanup) {
            const store = cleanup.objectStore(this.STORE_NAME);
            store.clear();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  public async getAnalyticsData(): Promise<AnalyticsEvent[]> {
    if (!this.db) {
      await this.initDb();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(this.STORE_NAME, 'readonly');
      if (!transaction) {
        reject(new Error('Database not initialized'));
        return;
      }

      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as AnalyticsEvent[]);
      request.onerror = () => reject(request.error);
    });
  }

  public async clearAnalyticsData(): Promise<void> {
    if (!this.db) {
      await this.initDb();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(this.STORE_NAME, 'readwrite');
      if (!transaction) {
        reject(new Error('Database not initialized'));
        return;
      }

      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
