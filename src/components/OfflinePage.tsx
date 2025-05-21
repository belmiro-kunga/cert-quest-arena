import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const OfflinePage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
          p: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Offline
        </Typography>
        <Typography variant="body1" paragraph>
          Você está offline no momento.
        </Typography>
        <Typography variant="body1" paragraph>
          Você pode:
        </Typography>
        <ul style={{ listStyleType: 'disc', paddingLeft: 20 }}>
          <li>Acessar conteúdo já baixado</li>
          <li>Ver seus progressos salvos</li>
          <li>Completar simulações iniciadas</li>
        </ul>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    </Container>
  );
};

export default OfflinePage;
