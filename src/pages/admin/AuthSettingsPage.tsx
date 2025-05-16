import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';
import { Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/layouts/AdminLayout';

interface AuthProvider {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  enabled: boolean;
}

interface AuthSettings {
  google: AuthProvider;
  github: AuthProvider;
}

const AuthSettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<AuthSettings>({
    google: {
      clientId: '',
      clientSecret: '',
      callbackUrl: '',
      enabled: false
    },
    github: {
      clientId: '',
      clientSecret: '',
      callbackUrl: '',
      enabled: false
    }
  });

  // Verificar se o usuário é administrador
  useEffect(() => {
    if (user && user.role !== 'admin' && user.email !== 'admin@certquest.com') {
      navigate('/');
    }
  }, [user, navigate]);

  // Carregar configurações
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/admin/settings/auth`);
        setSettings(response.data);
      } catch (err: any) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações de autenticação');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (provider: 'google' | 'github', field: keyof AuthProvider, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const saveProviderSettings = async (provider: 'google' | 'github') => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/admin/settings/auth/${provider}`,
        settings[provider]
      );
      setSuccess(`Configurações de ${provider === 'google' ? 'Google' : 'GitHub'} salvas com sucesso!`);
    } catch (err: any) {
      console.error(`Erro ao salvar configurações de ${provider}:`, err);
      setError(`Erro ao salvar configurações de ${provider === 'google' ? 'Google' : 'GitHub'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações de Autenticação Social</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="google" className="flex items-center">
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Google OAuth</CardTitle>
                <CardDescription>
                  Configure as credenciais para login com Google. Você precisa criar um projeto no 
                  <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                    Google Cloud Console
                  </a>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="google-enabled" className="text-base">Ativar login com Google</Label>
                  <Switch
                    id="google-enabled"
                    checked={settings.google.enabled}
                    onCheckedChange={(checked) => handleInputChange('google', 'enabled', checked)}
                    disabled={loading || saving}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    value={settings.google.clientId}
                    onChange={(e) => handleInputChange('google', 'clientId', e.target.value)}
                    disabled={loading || saving}
                    placeholder="Seu Google Client ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    value={settings.google.clientSecret}
                    onChange={(e) => handleInputChange('google', 'clientSecret', e.target.value)}
                    disabled={loading || saving}
                    placeholder="Seu Google Client Secret"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="google-callback-url">URL de Callback</Label>
                  <Input
                    id="google-callback-url"
                    value={settings.google.callbackUrl}
                    onChange={(e) => handleInputChange('google', 'callbackUrl', e.target.value)}
                    disabled={loading || saving}
                    placeholder="http://localhost:3001/auth/google/callback"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL para onde o Google redirecionará após a autenticação
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => saveProviderSettings('google')} 
                  disabled={loading || saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="github">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do GitHub OAuth</CardTitle>
                <CardDescription>
                  Configure as credenciais para login com GitHub. Você precisa criar um OAuth App no 
                  <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                    GitHub Developer Settings
                  </a>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="github-enabled" className="text-base">Ativar login com GitHub</Label>
                  <Switch
                    id="github-enabled"
                    checked={settings.github.enabled}
                    onCheckedChange={(checked) => handleInputChange('github', 'enabled', checked)}
                    disabled={loading || saving}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="github-client-id">Client ID</Label>
                  <Input
                    id="github-client-id"
                    value={settings.github.clientId}
                    onChange={(e) => handleInputChange('github', 'clientId', e.target.value)}
                    disabled={loading || saving}
                    placeholder="Seu GitHub Client ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github-client-secret">Client Secret</Label>
                  <Input
                    id="github-client-secret"
                    type="password"
                    value={settings.github.clientSecret}
                    onChange={(e) => handleInputChange('github', 'clientSecret', e.target.value)}
                    disabled={loading || saving}
                    placeholder="Seu GitHub Client Secret"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github-callback-url">URL de Callback</Label>
                  <Input
                    id="github-callback-url"
                    value={settings.github.callbackUrl}
                    onChange={(e) => handleInputChange('github', 'callbackUrl', e.target.value)}
                    disabled={loading || saving}
                    placeholder="http://localhost:3001/auth/github/callback"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL para onde o GitHub redirecionará após a autenticação
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => saveProviderSettings('github')} 
                  disabled={loading || saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AuthSettingsPage;
