import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Verifica se o navegador suporta PWA
    const checkPWA = () => {
      setIsSupported(
        'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window
      );
    };

    // Evento para quando o usuário instala o PWA
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    // Evento para quando o navegador sugere instalação
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    });

    checkPWA();

    return () => {
      window.removeEventListener('appinstalled', () => {});
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const showInstallPrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      });
    }
  };

  return {
    isSupported,
    isInstalled,
    showInstallPrompt,
    deferredPrompt
  };
};
