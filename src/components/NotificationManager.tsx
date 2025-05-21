import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAnalytics } from '../hooks/useAnalytics';

const NotificationManager: React.FC = () => {
  const { hasPermission, isSubscribed, requestPermission, showNotification } = useNotifications();
  const { trackEvent } = useAnalytics();

  const handlePermission = async () => {
    await requestPermission();
    trackEvent('notifications', 'permission_requested');
  };

  const handleTestNotification = () => {
    showNotification({
      title: 'Teste de Notificação',
      body: 'Esta é uma notificação de teste',
      icon: '/icon.png',
      tag: 'test'
    });
    trackEvent('notifications', 'test_sent');
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePermission}
        disabled={hasPermission}
      >
        {hasPermission ? 'Permissão concedida' : 'Solicitar Permissão'}
      </Button>

      <Button
        variant="outlined"
        color="primary"
        onClick={handleTestNotification}
        disabled={!hasPermission}
        sx={{ ml: 1 }}
      >
        Enviar Teste
      </Button>
    </Box>
  );
};

export default NotificationManager;
