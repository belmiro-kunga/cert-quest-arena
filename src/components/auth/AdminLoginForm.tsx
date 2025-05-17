import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

// Interface para as configurações do reCAPTCHA
interface ReCaptchaConfig {
  siteKey: string;
  enabled: boolean;
  threshold: number;
}

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { adminSignIn } = useAdminAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Estado para armazenar as configurações do reCAPTCHA
  const [recaptchaConfig, setRecaptchaConfig] = React.useState<ReCaptchaConfig>({
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste padrão
    enabled: false,
    threshold: 2 // Para admin, o padrão é mais restritivo
  });
  
  // Buscar configurações do reCAPTCHA do backend
  useEffect(() => {
    const fetchRecaptchaConfig = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/recaptcha/config`
        );
        if (response.data && response.data.enabled) {
          // Para administradores, usamos um threshold mais restritivo (metade do valor normal, mínimo 1)
          const adminThreshold = Math.max(1, Math.floor(response.data.threshold / 2));
          setRecaptchaConfig({
            ...response.data,
            threshold: adminThreshold
          });
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do reCAPTCHA:', error);
        // Em caso de erro, manter as configurações padrão
      }
    };
    
    fetchRecaptchaConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Verificar se precisamos do CAPTCHA (baseado nas configurações)
    if (recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && !captchaValue) {
      setError('Por favor, complete o CAPTCHA para continuar');
      setLoading(false);
      return;
    }

    try {
      // Usar o adminSignIn do contexto de administrador
      const success = await adminSignIn(formData.email, formData.password);
      
      if (success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        setCaptchaValue(null);
        navigate('/admin');
      } else {
        setError('Credenciais inválidas ou usuário sem permissão de administrador.');
        // Incrementar contagem de tentativas de login
        setLoginAttempts(prev => prev + 1);
        
        // Reset CAPTCHA após falha
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaValue(null);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Falha na autenticação');
      // Incrementar contagem de tentativas de login
      setLoginAttempts(prev => prev + 1);
      
      // Reset CAPTCHA após falha
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaValue(null);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Função para lidar com a alteração do CAPTCHA
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <ShieldAlert className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
        <CardDescription className="text-center">
          Acesso restrito a administradores do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="admin@certquest.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-10"
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mostrar CAPTCHA após o número configurado de tentativas */}
          {recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && (
            <div className="my-4">
              <div className="mb-2 text-sm text-amber-600">
                Detectamos múltiplas tentativas de login. Por favor, complete o CAPTCHA abaixo:
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
            disabled={loading || (recaptchaConfig.enabled && loginAttempts >= recaptchaConfig.threshold && !captchaValue)}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;
