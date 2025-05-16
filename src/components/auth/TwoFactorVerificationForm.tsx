import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface TwoFactorVerificationFormProps {
  onCancel: () => void;
}

const TwoFactorVerificationForm: React.FC<TwoFactorVerificationFormProps> = ({ onCancel }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyTwoFactorCode } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Código necessário",
        description: "Por favor, insira o código de verificação.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await verifyTwoFactorCode(code);
      if (!success) {
        // O toast de erro já é exibido na função verifyTwoFactorCode
        setCode('');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o código. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verificação de Dois Fatores</CardTitle>
        <CardDescription>
          Insira o código de 6 dígitos do seu aplicativo autenticador para continuar.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                placeholder="Código de verificação"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-xl tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando
              </>
            ) : (
              'Verificar'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TwoFactorVerificationForm;
