import { useState, useEffect } from 'react';
import { PWAManifest } from '../types/pwa';
import { PWAService } from '../services/pwa';
import { useToast } from './useToast';

export const usePWAState = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [manifest, setManifest] = useState<PWAManifest | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const service = PWAService.getInstance();

  useEffect(() => {
    const checkPWA = () => {
      setIsSupported(
        'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window
      );
    };

    const loadManifest = async () => {
      try {
        const manifest = await service.getManifest();
        setManifest(manifest);
      } catch (error) {
        toast.error('Erro ao carregar manifest');
      }
    };

    checkPWA();
    loadManifest();

    // Evento para quando o usuário instala o PWA
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  return {
    isSupported,
    isInstalled,
    manifest,
    loading,
    setLoading
  };
};
