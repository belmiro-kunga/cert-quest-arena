import React from 'react';
import { usePWAFeatures } from '../../hooks/usePWAFeatures';
import { Box, Button, Typography, Alert, Stack } from '@mui/material';

const PWADemo: React.FC = () => {
  const {
    features,
    ready,
    error,
    requestPermission,
    share,
    vibrate,
    useCamera
  } = usePWAFeatures();

  const handleShare = async () => {
    if (!features.share) {
      const granted = await requestPermission('share');
      if (!granted) return;
    }
    
    await share({
      title: 'Cert Quest Arena',
      text: 'Confira esta incrível plataforma de certificações!',
      url: window.location.href
    });
  };

  const handleVibrate = () => {
    if (!features.vibrate) {
      requestPermission('vibrate');
    }
    
    vibrate([1000, 500, 1000]);
  };

  const handleCamera = async () => {
    if (!features.camera) {
      const granted = await requestPermission('camera');
      if (!granted) return;
    }
    
    const stream = await useCamera();
    if (stream) {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      document.body.appendChild(video);
    }
  };

  if (!ready) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">Funcionalidades PWA Disponíveis</Typography>
      <Box>
        <Typography>Compartilhar: {features.share ? '✅' : '❌'}</Typography>
        <Typography>Câmera: {features.camera ? '✅' : '❌'}</Typography>
        <Typography>Vibração: {features.vibrate ? '✅' : '❌'}</Typography>
      </Box>
      <Button variant="contained" onClick={handleShare} disabled={!features.share}>
        Compartilhar
      </Button>
      <Button variant="contained" onClick={handleVibrate} disabled={!features.vibrate}>
        Vibração
      </Button>
      <Button variant="contained" onClick={handleCamera} disabled={!features.camera}>
        Câmera
      </Button>
    </Stack>
  );
};

export default PWADemo;
