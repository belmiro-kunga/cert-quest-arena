import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Button, Alert } from '@mui/material';
import { Settings, Notifications, Storage, Share, Vibration, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { usePWAFeatures } from '../../hooks/usePWAFeatures';

const PWAManagement: React.FC = () => {
  const { features, ready, error, requestPermission } = usePWAFeatures();

  const handlePermissionRequest = async (feature: keyof typeof features) => {
    try {
      const granted = await requestPermission(feature);
      if (granted) {
        return (
          <Alert severity="success">
            Permissão concedida para {feature}
          </Alert>
        );
      }
      return (
        <Alert severity="error">
          Permissão negada para {feature}
        </Alert>
      );
    } catch (err) {
      return (
        <Alert severity="error">
          Erro ao solicitar permissão: {err instanceof Error ? err.message : 'Erro desconhecido'}
        </Alert>
      );
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gerenciamento PWA
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!ready ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Funcionalidades Disponíveis
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Configurações PWA"
                secondary={features.notifications ? 'Disponível' : 'Não disponível'}
              />
            </ListItem>
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Notificações"
                secondary={features.notifications ? 'Disponível' : 'Não disponível'}
              />
              {!features.notifications && (
                <Button
                  size="small"
                  onClick={() => handlePermissionRequest('notifications')}
                >
                  Solicitar Permissão
                </Button>
              )}
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <Storage />
              </ListItemIcon>
              <ListItemText
                primary="Armazenamento Offline"
                secondary={features.push ? 'Disponível' : 'Não disponível'}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <Share />
              </ListItemIcon>
              <ListItemText
                primary="Compartilhamento"
                secondary={features.share ? 'Disponível' : 'Não disponível'}
              />
              {!features.share && (
                <Button
                  size="small"
                  onClick={() => handlePermissionRequest('share')}
                >
                  Solicitar Permissão
                </Button>
              )}
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <Vibration />
              </ListItemIcon>
              <ListItemText
                primary="Vibração"
                secondary={features.vibrate ? 'Disponível' : 'Não disponível'}
              />
              {!features.vibrate && (
                <Button
                  size="small"
                  onClick={() => handlePermissionRequest('vibrate')}
                >
                  Solicitar Permissão
                </Button>
              )}
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Status do PWA
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                {ready ? <CheckCircle color="success" /> : <ErrorOutline color="error" />}
              </ListItemIcon>
              <ListItemText
                primary="Status PWA"
                secondary={ready ? 'Pronto e funcionando' : 'Ainda inicializando'}
              />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );
};

export default PWAManagement;
