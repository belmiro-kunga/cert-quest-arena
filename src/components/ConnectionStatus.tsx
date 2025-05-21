import React from 'react';
import { useOffline } from '../hooks/useOffline';
import { Box, Typography, Badge, IconButton, Tooltip } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useAnalytics } from '../hooks/useAnalytics';

const ConnectionStatus: React.FC = () => {
  const { isOffline } = useOffline();
  const { trackEvent } = useAnalytics();

  const renderIcon = () => {
    if (isOffline) {
      return (
        <Badge color="error" badgeContent={1}>
          <WifiOffIcon color="error" />
        </Badge>
      );
    }
    return <WifiIcon color="success" />;
  };

  const renderTooltip = () => {
    return isOffline ? 'Offline' : 'Online';
  };

  const handleRetry = () => {
    trackEvent('connection', 'retry', isOffline ? 'offline' : 'online');
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Tooltip title={renderTooltip()}>
        <IconButton
          onClick={handleRetry}
          sx={{
            bgcolor: isOffline ? 'error.light' : 'success.light',
            '&:hover': {
              bgcolor: isOffline ? 'error.main' : 'success.main',
            },
          }}
        >
          {renderIcon()}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ConnectionStatus;
