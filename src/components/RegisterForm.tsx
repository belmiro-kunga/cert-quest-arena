
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Conta criada com sucesso",
        description: "Você já pode realizar o login.",
      });
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Seu nome"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input 
          id="register-email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="seu@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input 
          id="register-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-cert-blue hover:bg-cert-darkblue"
        disabled={isLoading}
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
};

export default RegisterForm;
