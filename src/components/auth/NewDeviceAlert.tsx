import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';
import { getDeviceDescription, saveCurrentDevice } from '@/services/deviceDetection';

interface NewDeviceAlertProps {
  userId: string;
}

const NewDeviceAlert: React.FC<NewDeviceAlertProps> = ({ userId }) => {
  const [visible, setVisible] = useState(true);
  const [deviceDescription, setDeviceDescription] = useState('');

  useEffect(() => {
    setDeviceDescription(getDeviceDescription());
  }, []);

  const handleConfirm = () => {
    saveCurrentDevice(userId);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Alert className="mb-4 border-yellow-500 bg-yellow-50">
      <div className="flex items-start">
        <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
        <div className="flex-1">
          <AlertTitle className="text-yellow-800">Novo acesso detectado</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p className="mb-2">
              Detectamos um login a partir de um novo dispositivo ou navegador: 
              <strong className="block mt-1">{deviceDescription}</strong>
            </p>
            <p className="mb-3">
              Se foi você, confirme este dispositivo para não receber mais este alerta. 
              Caso contrário, recomendamos alterar sua senha imediatamente.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                onClick={handleConfirm}
              >
                Confirmar dispositivo
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-yellow-700 hover:bg-yellow-100"
                onClick={handleDismiss}
              >
                Fechar
              </Button>
            </div>
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-6 w-6 rounded-full text-yellow-700 hover:bg-yellow-100"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default NewDeviceAlert;
