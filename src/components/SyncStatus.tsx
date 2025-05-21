import React from 'react';
import { useSync } from '../hooks/useSync';
import { Box, Typography, Badge, IconButton, Tooltip } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SyncStatus: React.FC = () => {
  const { isSyncing, pendingRequests, failedRequests, lastSync, clearRequests } = useSync();

  const renderIcon = () => {
    if (failedRequests > 0) {
      return (
        <Badge color="error" badgeContent={failedRequests}>
          <ErrorIcon color="error" />
        </Badge>
      );
    }
    if (pendingRequests > 0) {
      return (
        <Badge color="warning" badgeContent={pendingRequests}>
          <SyncIcon color="warning" />
        </Badge>
      );
    }
    return <CheckCircleIcon color="success" />;
  };

  const renderTooltip = () => {
    if (failedRequests > 0) {
      return `Falhas: ${failedRequests}`;
    }
    if (pendingRequests > 0) {
      return `Pendentes: ${pendingRequests}`;
    }
    return 'Sincronizado';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 1000,
      }}
    >
      <Tooltip title={renderTooltip()}>
        <IconButton
          onClick={clearRequests}
          sx={{
            bgcolor: isSyncing ? 'primary.light' : 'transparent',
            '&:hover': {
              bgcolor: 'primary.main',
            },
          }}
        >
          {renderIcon()}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SyncStatus;
