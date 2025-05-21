import { useState, useEffect } from 'react';
import NotificationService from '../services/notificationService';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    // Verificar permissão existente
    if ('Notification' in window) {
      const permission = Notification.permission;
      setHasPermission(permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await NotificationService.getInstance().requestPermission();
      setHasPermission(granted);
      setIsSubscribed(granted);
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const showNotification = (options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    data?: any;
  }) => {
    NotificationService.getInstance().showNotification(options);
    setLastNotification(options);
  };

  const handleNotificationClick = (event: NotificationEvent) => {
    event.notification.close();
    if (event.notification.data?.url) {
      window.location.href = event.notification.data.url;
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notification') {
          showNotification(event.data.options);
        }
      });
    }

    // Adicionar listener para cliques em notificações
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Teste', {
            body: 'Esta é uma notificação de teste',
            icon: '/icon.png'
          });
          notification.onclick = handleNotificationClick;
        }
      });
    }
  }, []);

  const clearNotifications = () => {
    setLastNotification(null);
  };

  return {
    hasPermission,
    isSubscribed,
    lastNotification,
    requestPermission,
    showNotification,
    clearNotifications
  };
};
