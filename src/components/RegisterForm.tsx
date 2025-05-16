import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Lock, Mail, User, Github, Globe, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface RegisterFormProps {
  onSuccess?: () => void;
}

// Enum para classificar a força da senha
enum PasswordStrength {
  Empty = 0,
  VeryWeak = 1,
  Weak = 2,
  Medium = 3,
  Strong = 4,
  VeryStrong = 5
}

// Interface para os critérios de senha
interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.Empty);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Função para calcular a força da senha
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return PasswordStrength.Empty;
    
    let strength = 0;
    
    // Verificar comprimento mínimo (8 caracteres)
    const hasMinLength = password.length >= 8;
    if (hasMinLength) strength++;
    
    // Verificar se contém letras maiúsculas
    const hasUppercase = /[A-Z]/.test(password);
    if (hasUppercase) strength++;
    
    // Verificar se contém letras minúsculas
    const hasLowercase = /[a-z]/.test(password);
    if (hasLowercase) strength++;
    
    // Verificar se contém números
    const hasNumber = /[0-9]/.test(password);
    if (hasNumber) strength++;
    
    // Verificar se contém caracteres especiais
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (hasSpecial) strength++;
    
    // Atualizar os critérios
    setPasswordCriteria({
      minLength: hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    });
    
    return strength as PasswordStrength;
  };
  
  // Atualizar a força da senha quando a senha mudar
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);
  
  // Função para obter a cor do indicador de força
  const getStrengthColor = (): string => {
    switch (passwordStrength) {
      case PasswordStrength.Empty:
        return 'bg-gray-200';
      case PasswordStrength.VeryWeak:
        return 'bg-red-500';
      case PasswordStrength.Weak:
        return 'bg-orange-500';
      case PasswordStrength.Medium:
        return 'bg-yellow-500';
      case PasswordStrength.Strong:
        return 'bg-lime-500';
      case PasswordStrength.VeryStrong:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  // Função para obter o texto do indicador de força
  const getStrengthText = (): string => {
    switch (passwordStrength) {
      case PasswordStrength.Empty:
        return 'Digite sua senha';
      case PasswordStrength.VeryWeak:
        return 'Muito fraca';
      case PasswordStrength.Weak:
        return 'Fraca';
      case PasswordStrength.Medium:
        return 'Média';
      case PasswordStrength.Strong:
        return 'Forte';
      case PasswordStrength.VeryStrong:
        return 'Muito forte';
      default:
        return 'Digite sua senha';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Use the signUp function from AuthContext
      await signUp(email, password, name);
      
      setSuccess('Cadastro realizado com sucesso!');
      toast({
        title: "Conta criada",
        description: "Sua conta foi criada com sucesso!",
      });
      
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || 'Erro ao cadastrar.');
      toast({
        title: "Erro no cadastro",
        description: err.message || 'Erro ao cadastrar.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
        <CardDescription>
          Junte-se à nossa comunidade de estudantes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  className="pl-10"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  className="pl-10"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha"
                  className="pl-10"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              
              {/* Indicador de força da senha */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Força da senha:</span>
                    <span className={`text-sm font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  
                  <Progress 
                    value={(passwordStrength / 5) * 100} 
                    className="h-2"
                    indicatorClassName={getStrengthColor()}
                  />
                  
                  {/* Critérios de senha */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="flex items-center space-x-1">
                      {passwordCriteria.minLength ? 
                        <Check className="h-3.5 w-3.5 text-green-500" /> : 
                        <X className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-xs">Mínimo 8 caracteres</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {passwordCriteria.hasUppercase ? 
                        <Check className="h-3.5 w-3.5 text-green-500" /> : 
                        <X className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-xs">Letra maiúscula</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {passwordCriteria.hasLowercase ? 
                        <Check className="h-3.5 w-3.5 text-green-500" /> : 
                        <X className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-xs">Letra minúscula</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {passwordCriteria.hasNumber ? 
                        <Check className="h-3.5 w-3.5 text-green-500" /> : 
                        <X className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-xs">Número</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {passwordCriteria.hasSpecial ? 
                        <Check className="h-3.5 w-3.5 text-green-500" /> : 
                        <X className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-xs">Caractere especial</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                Eu concordo com os{' '}
                <Button variant="link" className="text-cert-blue hover:text-cert-blue/90 p-0">
                  Termos de Serviço
                </Button>
                {' '}e{' '}
                <Button variant="link" className="text-cert-blue hover:text-cert-blue/90 p-0">
                  Política de Privacidade
                </Button>
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-cert-blue hover:bg-cert-blue/90" disabled={loading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm mt-2">{success}</div>}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou cadastre-se com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <div className="text-sm text-gray-600 w-full">
          Já tem uma conta?{' '}
          <Button 
            variant="link" 
            className="text-cert-blue hover:text-cert-blue/90 p-0"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
