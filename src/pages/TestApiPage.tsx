import React, { useState, useEffect } from 'react';
import { testApiConnection, testRegister } from '@/utils/apiTest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

const TestApiPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Formulário de teste
  const [email, setEmail] = useState('teste@example.com');
  const [password, setPassword] = useState('Senha@123');
  const [name, setName] = useState('Usuário Teste');

  // Verificar status da API ao carregar a página
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setLoading(true);
    try {
      const status = await testApiConnection();
      setApiStatus(status);
    } catch (err) {
      setApiStatus(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegister = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      const result = await testRegister(email, password, name);
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Teste de API</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status da API */}
        <Card>
          <CardHeader>
            <CardTitle>Status da API</CardTitle>
            <CardDescription>Verifica se a API está disponível</CardDescription>
          </CardHeader>
          <CardContent>
            {apiStatus === null ? (
              <p>Verificando status da API...</p>
            ) : apiStatus ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle>API Disponível</AlertTitle>
                <AlertDescription>A API está funcionando corretamente.</AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertTitle>API Indisponível</AlertTitle>
                <AlertDescription>
                  Não foi possível conectar à API. Verifique se o servidor backend está rodando.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkApiStatus} disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar Novamente'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Teste de Registro */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Registro</CardTitle>
            <CardDescription>Testa a funcionalidade de registro de usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleTestRegister(); }}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Digite seu nome" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Digite seu email" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Digite sua senha" 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Testando...' : 'Testar Registro'}
              </Button>
            </form>
            
            {error && (
              <Alert className="mt-4 bg-red-50 border-red-200">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {testResult && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>
                  <p>Usuário registrado com sucesso!</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestApiPage;
