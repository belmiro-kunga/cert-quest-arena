import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Github, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import TwoFactorVerificationForm from './auth/TwoFactorVerificationForm';

interface LoginFormProps {
  onSuccess?: () => void;
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Estendendo o schema para incluir o campo rememberMe
interface FormValues extends LoginFormData {
  rememberMe: boolean;
}

// Interface para as configurações do reCAPTCHA
interface ReCaptchaConfig {
  siteKey: string;
  enabled: boolean;
  threshold: number;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  
  // Estado para armazenar as configurações do reCAPTCHA
  const [recaptchaConfig, setRecaptchaConfig] = useState<ReCaptchaConfig>({
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste padrão
    enabled: false,
    threshold: 3
  });
  
  // Buscar configurações do reCAPTCHA do backend
  useEffect(() => {
    const fetchRecaptchaConfig = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/recaptcha/config`
        );
        const config = response.data as ReCaptchaConfig;
        if (config && config.enabled) {
          setRecaptchaConfig(config);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do reCAPTCHA:', error);
        // Em caso de erro, manter as configurações padrão
      }
    };
    
    fetchRecaptchaConfig();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    // Verificar se precisamos do CAPTCHA (após o número configurado de tentativas)
    if (recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && !captchaValue) {
      setError('Por favor, complete o CAPTCHA para continuar');
      setIsLoading(false);
      return;
    }

    try {
      // Usar o contexto de autenticação com a opção rememberMe
      const result = await signIn(data.email, data.password, rememberMe);
      
      // Verificar se precisa de autenticação de dois fatores
      if (result && result.requiresTwoFactor) {
        setShowTwoFactorForm(true);
        setIsLoading(false);
        return;
      }
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      setCaptchaValue(null);
      
      // Log para debug
      console.log('Login successful with:', { ...data, rememberMe });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email ou senha incorretos');
      
      // Incrementar contagem de tentativas de login
      setLoginAttempts(prev => prev + 1);
      
      // Reset CAPTCHA após falha
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaValue(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para lidar com a alteração do CAPTCHA
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      setError('Erro ao fazer login com Google');
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer login com GitHub:', error);
      setError('Erro ao fazer login com GitHub');
    }
  };

  // Função para cancelar a verificação de dois fatores
  const handleCancelTwoFactor = () => {
    setShowTwoFactorForm(false);
  };

  // Renderizar o formulário de verificação de dois fatores se necessário
  if (showTwoFactorForm) {
    return <TwoFactorVerificationForm onCancel={handleCancelTwoFactor} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t('Email')}</Label>
        <Input
          type="email"
          id="email"
          {...register('email')}
          placeholder="seu@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('Senha')}</Label>
        <Input
          type="password"
          id="password"
          {...register('password')}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            disabled={isLoading}
          />
          <label 
            htmlFor="remember-me" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('login.rememberMe', 'Lembrar-me')}
          </label>
        </div>
        <div>
          <Button variant="link" className="p-0 h-auto text-sm text-cert-blue" asChild>
            <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          </Button>
        </div>
      </div>

      {/* Mostrar CAPTCHA após o número configurado de tentativas */}
      {recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && (
        <div className="my-4">
          <div className="mb-2 text-sm text-amber-600">
            {t('Detectamos múltiplas tentativas de login. Por favor, complete o CAPTCHA abaixo:')}
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaConfig.siteKey}
              onChange={handleCaptchaChange}
            />
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || (recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && !captchaValue)}
      >
        {isLoading ? t('Entrando...') : t('Entrar')}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/registro" className="text-cert-blue hover:underline">
            Criar conta
          </Link>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Ao entrar, você concorda com nossos{' '}
          <Link to="/termos" className="text-cert-blue hover:underline" target="_blank">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link to="/privacidade" className="text-cert-blue hover:underline" target="_blank">
            Política de Privacidade
          </Link>
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('Ou continue com')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          {t('Continuar com Google')}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <Github className="mr-2 h-5 w-5" />
          {t('Continuar com GitHub')}
        </Button>
      </div>
    </form>
  );
};
