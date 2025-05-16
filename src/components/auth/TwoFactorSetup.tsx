import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TwoFactorSetupProps {
  onComplete?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete }) => {
  const { user, setupTwoFactor, verifyAndEnableTwoFactor, disableTwoFactor } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'qrcode' | 'verify' | 'complete'>(
    user?.twoFactorAuth?.enabled ? 'complete' : 'initial'
  );
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  // Iniciar configuração de 2FA
  const startSetup = async () => {
    setIsLoading(true);
    try {
      const result = await setupTwoFactor();
      setSecret(result.secret);
      setQrCodeUrl(result.qrCodeUrl);
      setStep('qrcode');
    } catch (error) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível iniciar a configuração de 2FA.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código e ativar 2FA
  const verifyAndEnable = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Código necessário",
        description: "Por favor, insira o código de verificação.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await verifyAndEnableTwoFactor(verificationCode);
      if (success) {
        setStep('complete');
        setVerificationCode('');
        if (onComplete) onComplete();
      } else {
        setVerificationCode('');
      }
    } catch (error) {
      toast({
        title: "Falha na verificação",
        description: "Ocorreu um erro durante a verificação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Desativar 2FA
  const handleDisable = async () => {
    setIsLoading(true);
    try {
      await disableTwoFactor();
      setStep('initial');
      setSecret('');
      setQrCodeUrl('');
      if (onComplete) onComplete();
    } catch (error) {
      toast({
        title: "Erro ao desativar",
        description: "Não foi possível desativar a autenticação de dois fatores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar configuração
  const cancelSetup = () => {
    setStep('initial');
    setSecret('');
    setQrCodeUrl('');
    setVerificationCode('');
  };

  // Tela inicial
  if (step === 'initial') {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Melhore a segurança da sua conta</AlertTitle>
          <AlertDescription>
            A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta, exigindo um código de verificação além da sua senha.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={startSetup} 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Configurando...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Configurar Autenticação de Dois Fatores
            </>
          )}
        </Button>
      </div>
    );
  }

  // Tela de QR Code
  if (step === 'qrcode') {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Escaneie o código QR com um aplicativo autenticador como Google Authenticator, Authy ou Microsoft Authenticator.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
          <QRCodeSVG value={qrCodeUrl} size={200} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Ou insira este código manualmente no seu aplicativo:</p>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-100 p-2 rounded text-sm font-mono">
                {showSecret ? secret : secret.replace(/./g, '•')}
              </code>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="verification-code">Código de Verificação</Label>
          <Input 
            id="verification-code" 
            placeholder="Insira o código de 6 dígitos" 
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={cancelSetup}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={verifyAndEnable}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando
              </>
            ) : (
              'Verificar e Ativar'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Tela de 2FA ativado
  if (step === 'complete') {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">2FA está Ativado</AlertTitle>
          <AlertDescription>
            Sua conta agora está protegida com autenticação de dois fatores.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-gray-500">Sua conta está protegida com um aplicativo autenticador</p>
          </div>
          <Button 
            onClick={handleDisable} 
            variant="destructive" 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Desativando
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Desativar 2FA
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default TwoFactorSetup;
