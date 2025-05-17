import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar a lógica de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
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
            <CardHeader>
              <CardTitle className="text-center">Email Enviado</CardTitle>
              <CardDescription className="text-center">
                Enviamos um email com instruções para recuperar sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                Se não encontrar o email, verifique sua pasta de spam.
              </p>
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => window.location.href = '/login'}
              >
                Voltar para o Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
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
          <CardHeader>
            <CardTitle className="text-center">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              Digite seu email para receber instruções de recuperação de senha
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
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
