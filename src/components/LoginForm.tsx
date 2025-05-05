import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AuthError } from '@supabase/supabase-js';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/profile');
      }
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Button 
            variant="link" 
            className="px-0 font-normal text-sm text-cert-blue"
            onClick={() => navigate('/reset-password')}
            type="button"
          >
            Esqueceu a senha?
          </Button>
        </div>
        <Input 
          id="password"
          type="password" 
          placeholder="********" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm font-normal">
          Lembrar de mim
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
          {error}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        <span>Não tem uma conta? </span>
        <Button 
          variant="link" 
          className="px-0 font-medium text-cert-blue"
          onClick={() => navigate('/signup')}
          type="button"
        >
          Cadastre-se
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
