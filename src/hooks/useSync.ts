
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Mock sync service functionality
    const updateState = async () => {
      setState(prev => ({
        ...prev,
        pendingRequests: 0,
        failedRequests: 0,
        lastSync: new Date(),
      }));
    };

    // Atualizar estado periodicamente
    const interval = setInterval(updateState, 5000);

    return () => {
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
    setState(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests + 1,
    }));
  };

  // Função para limpar requisições
  const clearRequests = async () => {
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
