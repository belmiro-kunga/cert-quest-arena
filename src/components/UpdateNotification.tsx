import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const UpdateNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkForUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setOpen(true);
        });
      }
    };

    // Verifica atualizações quando o componente é montado
    checkForUpdate();

    // Verifica atualizações quando o usuário volta do background
    window.addEventListener('visibilitychange', checkForUpdate);

    return () => {
      window.removeEventListener('visibilitychange', checkForUpdate);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Atualiza a página para aplicar as mudanças
    window.location.reload();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{ width: '100%' }}
      >
        Nova versão disponível! Atualize a página para ver as mudanças.
      </Alert>
    </Snackbar>
  );
};
