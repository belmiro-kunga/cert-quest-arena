import { useState, useEffect } from 'react';
import { SyncService } from '../services/syncService';

interface SyncState {
  isSyncing: boolean;
  pendingRequests: number;
  failedRequests: number;
  lastSync: Date | null;
}

export const useSync = () => {
  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    pendingRequests: 0,
    failedRequests: 0,
    lastSync: null,
  });

  const syncService = SyncService.getInstance();

  useEffect(() => {
    // Iniciar serviço de sincronização
    syncService.startSync();

    // Atualizar estado
    const updateState = async () => {
      const pending = await syncService.getPendingRequests();
      const failed = pending.filter(r => r.status === 'failed').length;
      setState(prev => ({
        ...prev,
        pendingRequests: pending.length,
        failedRequests: failed,
        lastSync: new Date(),
      }));
    };

    // Atualizar estado periodicamente
    const interval = setInterval(updateState, 5000);

    return () => {
      syncService.stopSync();
      clearInterval(interval);
    };
  }, []);

  // Função para adicionar requisição
  const addRequest = async (
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ) => {
    await syncService.addRequest(url, method, headers, body);
    setState(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests + 1,
    }));
  };

  // Função para limpar requisições
  const clearRequests = async () => {
    await syncService.clearRequests();
    setState(prev => ({
      ...prev,
      pendingRequests: 0,
      failedRequests: 0,
    }));
  };

  return {
    ...state,
    addRequest,
    clearRequests,
  };
};
