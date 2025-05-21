import { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';
import { useSync } from './useSync';

interface OfflineState {
  isOffline: boolean;
  lastOnline: Date | null;
  retryQueue: Array<{ url: string; method: string; body?: any }>;
  retryCount: number;
  isSyncing: boolean;
}

export const useOffline = () => {
  const [state, setState] = useState<OfflineState>({
    isOffline: !navigator.onLine,
    lastOnline: null,
    retryQueue: [],
    retryCount: 0,
    isSyncing: false,
  });
  const { trackEvent } = useAnalytics();
  const { syncRequests } = useSync();

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOffline: false,
        lastOnline: new Date(),
      }));
      trackEvent('connection', 'online');
      syncRequests();
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOffline: true,
      }));
      trackEvent('connection', 'offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [trackEvent, syncRequests]);

  const retry = async () => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      isSyncing: true,
    }));
    
    try {
      await syncRequests();
      setState(prev => ({
        ...prev,
        isOffline: false,
        isSyncing: false,
      }));
      trackEvent('connection', 'retry_success');
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({
        ...prev,
        isSyncing: false,
      }));
      trackEvent('connection', 'retry_failed');
    }
  };

  const addToRetryQueue = (url: string, method: string, body?: any) => {
    setState(prev => ({
      ...prev,
      retryQueue: [...prev.retryQueue, { url, method, body }],
    }));
  };

  const getOfflineData = async () => {
    try {
      const data = await window.indexedDB.open('offline-data', 1);
      const transaction = data.transaction('pages', 'readonly');
      const store = transaction.objectStore('pages');
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error fetching offline data:', error);
      return [];
    }
  };

  const syncPendingData = async () => {
    const { retryQueue } = state;
    if (retryQueue.length === 0) return;

    for (const request of retryQueue) {
      try {
        await fetch(request.url, {
          method: request.method,
          body: request.body ? JSON.stringify(request.body) : undefined,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Falha ao sincronizar dados:', error);
      }
    }

    setState(prev => ({
      ...prev,
      retryQueue: [],
    }));
  };

  return {
    isOffline: state.isOffline,
    lastOnline: state.lastOnline,
    addToRetryQueue,
  };
};
