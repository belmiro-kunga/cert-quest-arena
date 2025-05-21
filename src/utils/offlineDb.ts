import { openDB } from 'idb';

export interface OfflineData {
  id: string;
  type: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
  retries: number;
  status: 'pending' | 'failed' | 'success';
}

const DB_NAME = 'cert-quest-offline-db';
const STORE_NAME = 'offline-requests';
const DB_VERSION = 1;

export const initOfflineDb = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('type', 'type');
        store.createIndex('status', 'status');
      }
    },
  });

  return db;
};

export const addOfflineRequest = async (data: Omit<OfflineData, 'id' | 'timestamp' | 'retries' | 'status'>) => {
  const db = await initOfflineDb();
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const request: OfflineData = {
    ...data,
    id,
    timestamp,
    retries: 0,
    status: 'pending',
  };

  await db.put(STORE_NAME, request);
  return request;
};

export const getPendingRequests = async () => {
  const db = await initOfflineDb();
  return await db.getAllFromIndex(STORE_NAME, 'status', 'pending');
};

export const updateRequestStatus = async (id: string, status: OfflineData['status']) => {
  const db = await initOfflineDb();
  const request = await db.get(STORE_NAME, id);
  if (!request) return;

  await db.put(STORE_NAME, { ...request, status });
};

export const incrementRetries = async (id: string) => {
  const db = await initOfflineDb();
  const request = await db.get(STORE_NAME, id);
  if (!request) return;

  await db.put(STORE_NAME, { ...request, retries: request.retries + 1 });
};

export const clearCompletedRequests = async () => {
  const db = await initOfflineDb();
  const requests = await db.getAllFromIndex(STORE_NAME, 'status', 'success');
  for (const request of requests) {
    await db.delete(STORE_NAME, request.id);
  }
};
