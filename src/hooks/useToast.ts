import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const defaultConfig = {
  duration: 5000,
  position: 'bottom-right' as const,
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'], duration = defaultConfig.duration) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.duration === undefined));
    }, 1000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return {
    success: (message: string, duration = defaultConfig.duration) => addToast(message, 'success', duration),
    error: (message: string, duration = defaultConfig.duration) => addToast(message, 'error', duration),
    warning: (message: string, duration = defaultConfig.duration) => addToast(message, 'warning', duration),
    info: (message: string, duration = defaultConfig.duration) => addToast(message, 'info', duration),
    remove: removeToast
  };
};
