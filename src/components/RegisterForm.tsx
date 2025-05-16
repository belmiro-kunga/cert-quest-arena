import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Lock, Mail, User, Github, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
