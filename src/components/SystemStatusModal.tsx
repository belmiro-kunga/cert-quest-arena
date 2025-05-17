import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import { checkAllEndpoints } from '@/services/healthService';
import { toggleAPIUrl } from '@/config';

interface SystemStatusProps {
  open: boolean;
  onClose: () => void;
}

interface EndpointStatus {
  name: string;
  status: 'online' | 'offline' | 'checking';
  description: string;
}

const SystemStatusModal: React.FC<SystemStatusProps> = ({ open, onClose }) => {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    { name: 'API Principal', status: 'checking', description: 'Servidor principal da aplicação' },
    { name: 'Simulados', status: 'checking', description: 'Serviço de simulados e exames' },
  ]);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    
    // Atualizar status para "checking"
    setEndpoints(prev => prev.map(endpoint => ({
      ...endpoint,
      status: 'checking'
    })));
    
    try {
      const status = await checkAllEndpoints();
      
      setEndpoints([
        { 
          name: 'API Principal', 
          status: status.health ? 'online' : 'offline', 
          description: 'Servidor principal da aplicação' 
        },
        { 
          name: 'Simulados', 
          status: status.simulados ? 'online' : 'offline', 
          description: 'Serviço de simulados e exames' 
        }
      ]);
    } catch (error) {
      console.error('Erro ao verificar status dos endpoints:', error);
      
      // Em caso de erro, marcar todos como offline
      setEndpoints(prev => prev.map(endpoint => ({
        ...endpoint,
        status: 'offline'
      })));
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar status quando o modal for aberto
  useEffect(() => {
    if (open) {
      checkStatus();
    }
  }, [open]);

  const handleToggleAPI = () => {
    toggleAPIUrl();
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon color="success" />;
      case 'offline':
        return <ErrorIcon color="error" />;
      case 'checking':
        return <CircularProgress size={20} />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getOverallStatus = (): 'online' | 'partial' | 'offline' => {
    const onlineCount = endpoints.filter(e => e.status === 'online').length;
    
    if (onlineCount === endpoints.length) return 'online';
    if (onlineCount === 0) return 'offline';
    return 'partial';
  };

  const getStatusChip = () => {
    const status = getOverallStatus();
    
    switch (status) {
      case 'online':
        return <Chip label="Todos serviços online" color="success" icon={<CheckCircleIcon />} />;
      case 'partial':
        return <Chip label="Serviços parcialmente disponíveis" color="warning" icon={<WarningIcon />} />;
      case 'offline':
        return <Chip label="Todos serviços offline" color="error" icon={<ErrorIcon />} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Status do Sistema</Typography>
          {getStatusChip()}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" paragraph>
          Esta página mostra o status atual de todos os serviços do CertQuest Arena.
          Quando um serviço está offline, a aplicação usa dados armazenados localmente.
        </Typography>
        
        <List>
          {endpoints.map((endpoint, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {getStatusIcon(endpoint.status)}
              </ListItemIcon>
              <ListItemText 
                primary={endpoint.name} 
                secondary={endpoint.description}
              />
              <Chip 
                label={endpoint.status === 'online' ? 'Online' : endpoint.status === 'checking' ? 'Verificando...' : 'Offline'} 
                color={endpoint.status === 'online' ? 'success' : endpoint.status === 'checking' ? 'default' : 'error'}
                size="small"
              />
            </ListItem>
          ))}
        </List>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Última verificação: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={checkStatus} 
          startIcon={<RefreshIcon />}
          disabled={isChecking}
        >
          Verificar novamente
        </Button>
        <Button onClick={handleToggleAPI} color="primary">
          Alternar API
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SystemStatusModal;
