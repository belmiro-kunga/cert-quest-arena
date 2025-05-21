import React, { useState, useEffect } from 'react';
import { useOffline } from '../hooks/useOffline';
import { Box, Typography, Button, Paper, CircularProgress, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

interface OfflineData {
  path: string;
  title: string;
  timestamp: number;
}

const OfflineFallback: React.FC = () => {
  const { isOffline } = useOffline();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { trackEvent } = useAnalytics();
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Salvar dados de página offline
  useEffect(() => {
    if (isOffline) {
      const data = {
        path: location.pathname,
        title: document.title,
        timestamp: Date.now()
      };
      setOfflineData(prev => [...prev, data]);
      trackEvent('offline', 'page_view', location.pathname);
    }
  }, [isOffline, location, trackEvent]);

  // Tentar sincronizar dados quando online
  useEffect(() => {
    if (!isOffline && offlineData.length > 0) {
      setIsSyncing(true);
      // Aqui você pode implementar a lógica de sincronização
      // Por exemplo, enviar os dados para o servidor
      setTimeout(() => {
        setOfflineData([]);
        setIsSyncing(false);
        trackEvent('online', 'sync_complete');
      }, 2000); // Simulação de sincronização
    }
  }, [isOffline, offlineData, trackEvent]);

  if (!isOffline) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1000
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Offline Mode
        </Typography>
        
        {isSyncing ? (
          <Box sx={{ my: 4 }}>
            <CircularProgress />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Sincronizando dados...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Você está offline. Alguns recursos podem não estar disponíveis.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
                sx={{ mr: 2 }}
              >
                Tentar novamente
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/')}
              >
                Voltar para Home
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Páginas visitadas offline:
            </Typography>
            <Box sx={{ maxWidth: 600, width: '100%' }}>
              {offlineData.map((data, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="body2">
                    {data.title} ({format(new Date(data.timestamp), 'HH:mm')})
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate(data.path)}
                  >
                    Abrir
                  </Button>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default OfflineFallback;
