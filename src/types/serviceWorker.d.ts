/// <reference lib="webworker" />

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response>): void;
}

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface NotificationEvent extends ExtendableEvent {
  notification: Notification;
}

interface SyncEvent extends ExtendableEvent {
  tag: string;
}

interface PushMessageData {
  json(): any;
  text(): string;
}

interface Notification {
  close(): void;
  data: any;
}

interface Clients {
  matchAll(options?: ClientQueryOptions): Promise<Array<Client>>;
  openWindow(url: string): Promise<Client | null>;
}

interface Client {
  focus(): Promise<void>;
  url: string;
}

interface ClientQueryOptions {
  includeUncontrolled?: boolean;
  type?: ClientType;
}

interface ServiceWorkerGlobalScope {
  registration: ServiceWorkerRegistration;
  clients: Clients;
}

declare const self: ServiceWorkerGlobalScope;
