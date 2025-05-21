import { useState, useEffect } from 'react';
import { NATIVE_API_CONFIG, checkNativeAPIAvailability, requestNativeAPIPermissions } from '../config/native-api-config';

export interface PWAFeatures {
  share: boolean;
  camera: boolean;
  vibrate: boolean;
  notifications: boolean;
}

export const usePWAFeatures = () => {
  const [features, setFeatures] = useState<PWAFeatures>({
    share: false,
    camera: false,
    vibrate: false,
    notifications: false
  });

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkFeatures = async () => {
    try {
      const featureStatus: PWAFeatures = {
        share: await checkNativeAPIAvailability('SHARE'),
        camera: await checkNativeAPIAvailability('CAMERA'),
        vibrate: await checkNativeAPIAvailability('VIBRATE'),
        notifications: await checkNativeAPIAvailability('NOTIFICATIONS')
      };

      setFeatures(featureStatus);
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar funcionalidades PWA');
    }
  };

  useEffect(() => {
    checkFeatures();
  }, []);

  const requestPermission = async (feature: keyof PWAFeatures) => {
    try {
      const granted = await requestNativeAPIPermissions(feature as keyof typeof NATIVE_API_CONFIG);
      if (granted) {
        setFeatures(prev => ({
          ...prev,
          [feature]: true
        }));
      }
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar permissão');
      return false;
    }
  };

  const share = async (data: { title: string; text: string; url: string }) => {
    if (!features.share) return false;
    
    try {
      await navigator.share(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao compartilhar');
      return false;
    }
  };

  const vibrate = (pattern: number | number[]) => {
    if (!features.vibrate) return false;
    
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao vibrar');
      return false;
    }
  };

  const useCamera = async () => {
    if (!features.camera) return null;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return stream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao acessar câmera');
      return null;
    }
  };

  return {
    features,
    ready,
    error,
    requestPermission,
    share,
    vibrate,
    useCamera
  };
};
