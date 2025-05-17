import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ForgotPasswordPage = () => {
  // Estados para controlar as diferentes etapas do fluxo
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'verification' | 'newPassword' | 'success'>('email');
  
  // Estado para o temporizador
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos em segundos
  const [progress, setProgress] = useState(100);
  
  // Efeito para o temporizador quando estiver na etapa de verificação
  useEffect(() => {
    if (step !== 'verification') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Voltar para a etapa de email se o tempo acabar
          setStep('email');
          setError('Tempo esgotado. Por favor, solicite um novo código.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [step]);
  
  // Atualizar a barra de progresso com base no tempo restante
  useEffect(() => {
    setProgress((timeLeft / 300) * 100);
  }, [timeLeft]);
  
  // Formatar o tempo restante em minutos e segundos
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Função para enviar o email e solicitar o código de verificação
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar a lógica de envio do código de verificação
      // Simulação do envio do código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resetar o temporizador
      setTimeLeft(300);
      setProgress(100);
      
      // Avançar para a próxima etapa
      setStep('verification');
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar código de verificação');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para verificar o código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar a lógica de verificação do código
      // Simulação da verificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o código tem 6 dígitos
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        throw new Error('O código de verificação deve ter 6 dígitos numéricos');
      }
      
      // Código de exemplo para teste (123456)
      if (verificationCode !== '123456') {
        throw new Error('Código de verificação inválido');
      }
      
      // Avançar para a próxima etapa
      setStep('newPassword');
    } catch (error: any) {
      setError(error.message || 'Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para definir a nova senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar se as senhas coincidem
      if (newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      // Verificar se a senha tem pelo menos 6 caracteres
      if (newPassword.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      // TODO: Implementar a lógica de redefinição de senha
      // Simulação da redefinição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Avançar para a etapa de sucesso
      setStep('success');
    } catch (error: any) {
      setError(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  // Layout comum para todas as etapas
  const renderLayout = (content: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center bg-cert-gray px-4 relative">
      <Link to="/login" className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Voltar para o Login</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cert-blue flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CQ</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">CertQuest</h1>
          <p className="text-gray-600 mt-2">Recuperação de senha</p>
        </div>
        
        <Card className="border-none shadow-lg">
          {content}
        </Card>
      </div>
    </div>
  );
  
  // Etapa 1: Solicitar código de verificação
  if (step === 'email') {
    return renderLayout(
      <>
        <CardHeader>
          <CardTitle className="text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu email para receber um código de verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestCode} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Código de Verificação'
              )}
            </Button>
          </form>
        </CardContent>
      </>
    );
  }
  
  // Etapa 2: Verificar o código
  if (step === 'verification') {
    return renderLayout(
      <>
        <CardHeader>
          <CardTitle className="text-center">Verificar Código</CardTitle>
          <CardDescription className="text-center">
            Digite o código de 6 dígitos enviado para {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Código de Verificação</Label>
                <span className="text-sm text-muted-foreground">{formatTimeLeft()}</span>
              </div>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                disabled={loading}
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                className="text-center text-lg tracking-widest"
                required
              />
              <Progress value={progress} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                O código expira em {formatTimeLeft()}
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar Código'
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="text-sm" 
                disabled={loading}
                onClick={() => setStep('email')}
              >
                Não recebeu o código? Tentar novamente
              </Button>
            </div>
          </form>
        </CardContent>
      </>
    );
  }
  
  // Etapa 3: Definir nova senha
  if (step === 'newPassword') {
    return renderLayout(
      <>
        <CardHeader>
          <CardTitle className="text-center">Nova Senha</CardTitle>
          <CardDescription className="text-center">
            Defina uma nova senha para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </>
    );
  }
  
  // Etapa 4: Sucesso
  if (step === 'success') {
    return renderLayout(
      <>
        <CardHeader>
          <CardTitle className="text-center">Senha Redefinida</CardTitle>
          <CardDescription className="text-center">
            Sua senha foi redefinida com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Agora você pode fazer login com sua nova senha.
          </p>
          
          <Button 
            className="w-full mt-4" 
            onClick={() => window.location.href = '/login'}
          >
            Ir para o Login
          </Button>
        </CardContent>
      </>
    );
  }
  
  // Fallback (não deve acontecer)
  return null;
};

export default ForgotPasswordPage;
