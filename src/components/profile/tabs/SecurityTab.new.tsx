import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';

// Interface para o estado de 2FA
interface TwoFactorState {
  enabled: boolean;
  secret: string;
  qrCodeUrl: string;
  verified: boolean;
  setupStep: 'initial' | 'qrcode' | 'verify' | 'complete';
}

const SecurityTab: React.FC = () => {
  const { toast } = useToast();
  const { user, setupTwoFactor, verifyAndEnableTwoFactor, disableTwoFactor } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para 2FA
  const [twoFactor, setTwoFactor] = useState<TwoFactorState>({
    enabled: false,
    secret: '',
    qrCodeUrl: '',
    verified: false,
    setupStep: 'initial'
  });
  
  // Estado para o código de verificação
  const [verificationCode, setVerificationCode] = useState('');
  
  // Estado para mostrar/esconder o código secreto
  const [showSecret, setShowSecret] = useState(false);
  
  // Inicializar o estado com base no usuário atual
  useEffect(() => {
    if (user?.twoFactorAuth) {
      setTwoFactor(prev => ({
        ...prev,
        enabled: user.twoFactorAuth?.enabled || false,
        secret: user.twoFactorAuth?.secret || '',
        verified: user.twoFactorAuth?.enabled || false,
        setupStep: user.twoFactorAuth?.enabled ? 'complete' : 'initial'
      }));
    }
  }, [user]);
  
  // Esquema de validação para o formulário de senha
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, {
      message: "Current password must have at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "New password must have at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must have at least 6 characters.",
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
  // Formulário para alteração de senha
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  // Função para atualizar a senha
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    passwordForm.reset();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  // Função para iniciar o processo de configuração de 2FA
  const startTwoFactorSetup = async () => {
    setIsLoading(true);
    try {
      const { secret, qrCodeUrl } = await setupTwoFactor();
      setTwoFactor({
        ...twoFactor,
        secret,
        qrCodeUrl,
        setupStep: 'qrcode'
      });
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
  
  // Função para verificar o código de 2FA
  const verifyTwoFactorCode = async () => {
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
        setTwoFactor({
          ...twoFactor,
          verified: true,
          enabled: true,
          setupStep: 'complete'
        });
        setVerificationCode('');
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
  
  // Função para desativar 2FA
  const handleDisableTwoFactor = async () => {
    setIsLoading(true);
    try {
      await disableTwoFactor();
      setTwoFactor({
        enabled: false,
        secret: '',
        qrCodeUrl: '',
        verified: false,
        setupStep: 'initial'
      });
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
  
  // Cancelar o processo de configuração
  const cancelSetup = () => {
    setTwoFactor({
      ...twoFactor,
      secret: '',
      qrCodeUrl: '',
      setupStep: 'initial'
    });
    setVerificationCode('');
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Account Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings.
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Seção de alteração de senha */}
        <div>
          <h3 className="text-lg font-medium mb-2">Change Password</h3>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Change Password</Button>
            </form>
          </Form>
        </div>
        
        {/* Seção de 2FA */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account by requiring a verification code.
              </p>
            </div>
            {twoFactor.enabled ? (
              <div className="flex items-center space-x-1 text-green-600">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
                <span className="text-sm font-medium">Disabled</span>
              </div>
            )}
          </div>
          
          {/* Conteúdo baseado no estado atual de 2FA */}
          {twoFactor.enabled ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>2FA is active</AlertTitle>
                <AlertDescription>
                  Your account is protected with two-factor authentication. You'll need to enter a verification code from your authenticator app when signing in.
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleDisableTwoFactor}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desativando...
                  </>
                ) : (
                  'Desativar Autenticação de Dois Fatores'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {twoFactor.setupStep === 'initial' && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Melhore a segurança da sua conta</AlertTitle>
                    <AlertDescription>
                      A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta, exigindo um código de verificação além da sua senha.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={startTwoFactorSetup} 
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
              )}
              
              {twoFactor.setupStep === 'qrcode' && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Importante</AlertTitle>
                    <AlertDescription>
                      Escaneie o código QR com um aplicativo autenticador como Google Authenticator, Authy ou Microsoft Authenticator.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <QRCode value={twoFactor.qrCodeUrl} size={200} />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 mb-2">Ou insira este código manualmente no seu aplicativo:</p>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 p-2 rounded text-sm font-mono">
                          {showSecret ? twoFactor.secret : twoFactor.secret.replace(/./g, '•')}
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
                      onClick={verifyTwoFactorCode}
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
              )}
              
              {twoFactor.setupStep === 'complete' && (
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
                      onClick={handleDisableTwoFactor} 
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
              )}
            </div>
          )}
        </div>
        
        {/* Seção de preferências de notificação */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-updates">Email updates</Label>
              <input
                id="email-updates"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing and promotions</Label>
              <input
                id="marketing"
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-certs">New certifications available</Label>
              <input
                id="new-certs"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Zona de perigo */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">
            These actions cannot be undone. Please be sure before proceeding.
          </p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Delete exam history
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
