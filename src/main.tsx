import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { toast } from 'sonner';

const rootElement = document.getElementById("root");

if (!rootElement) {
  toast.error("Elemento raiz não encontrado. Certifique-se de que existe uma div com id 'root' no HTML.");
  throw new Error("Elemento raiz não encontrado. Certifique-se de que existe uma div com id 'root' no HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
