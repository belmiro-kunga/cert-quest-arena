import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Button, Collapse, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
// TODO: Replace with Supabase implementation
// import { isAPIAvailable, toggleAPIUrl } from '@/config';
import SystemStatusModal from './SystemStatusModal';

/**
 * Componente que exibe uma notificação quando a API não está disponível
 * e os dados de fallback estão sendo usados
 */
const APIStatusNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // Verificar o status da API quando o componente for montado
  useEffect(() => {
    const checkAPIStatus = async () => {
      // const status = await isAPIAvailable();
      const status = true; // Temporary until Supabase implementation
      setApiStatus(status);
      setOpen(!status); // Abrir a notificação se a API não estiver disponível
    };

    checkAPIStatus();

    // Verificar o status da API a cada 30 segundos
    const intervalId = setInterval(checkAPIStatus, 30000);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleRefresh = async () => {
    // Verificar o status da API novamente
    // const status = await isAPIAvailable();
    const status = true; // Temporary until Supabase implementation
    setApiStatus(status);
    
    if (status) {
      // Se a API estiver disponível, fechar a notificação
      setOpen(false);
      // Recarregar a página para buscar os dados atualizados
      window.location.reload();
    } else {
      // Se a API ainda não estiver disponível, manter a notificação aberta
      setOpen(true);
    }
  };

  // TODO: Replace with Supabase implementation
  const handleToggleAPI = () => {
    // toggleAPIUrl();
    console.log('Toggle API URL - To be implemented with Supabase');
  };

  const handleOpenStatusModal = () => {
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
  };

  // Não renderizar nada se o status da API ainda não foi verificado
  if (apiStatus === null) {
    return null;
  }

  // Não renderizar nada se a API estiver disponível
  if (apiStatus === true) {
    return null;
  }

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: '600px', width: '100%' }}
      >
        <Alert
          severity="warning"
          sx={{ width: '100%' }}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                size="small" 
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{ mr: 1 }}
              >
                Verificar novamente
              </Button>
              <Button 
                color="inherit" 
                size="small" 
                startIcon={<InfoIcon />}
                onClick={handleOpenStatusModal}
                sx={{ mr: 1 }}
              >
                Status do sistema
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          }
        >
          <AlertTitle>Servidor indisponível</AlertTitle>
          O servidor de dados está temporariamente indisponível. Estamos usando dados armazenados localmente.
          Algumas funcionalidades podem estar limitadas.
        </Alert>
      </Snackbar>

      {/* Modal de status do sistema */}
      <SystemStatusModal 
        open={statusModalOpen} 
        onClose={handleCloseStatusModal} 
      />
    </>
  );
};

export default APIStatusNotification;
