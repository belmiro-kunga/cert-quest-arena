import React from 'react';
import { useOffline } from '../hooks/useOffline';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncIcon from '@mui/icons-material/Sync';

const OfflineStatus: React.FC = () => {
  const { isOffline, lastOnline, addToRetryQueue } = useOffline();

  const handleRetry = () => {
    // Aqui você pode implementar lógica específica para retry
    // Por exemplo, tentar sincronizar dados pendentes
    window.location.reload();
  };

  if (!isOffline) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Badge
        badgeContent={lastOnline ? Math.floor((Date.now() - lastOnline.getTime()) / 1000) : 0}
        color="error"
        sx={{
          '& .MuiBadge-badge': {
            top: 8,
            right: 8,
            fontSize: '0.75rem',
          },
        }}
      >
        <IconButton
          color="error"
          onClick={handleRetry}
          sx={{
            bgcolor: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <WifiOffIcon />
        </IconButton>
      </Badge>
      <Typography variant="caption" color="error" align="center">
        Você está offline
      </Typography>
    </Box>
  );
};

export default OfflineStatus;
