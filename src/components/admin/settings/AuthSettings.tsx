import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { FcGoogle } from 'react-icons/fc';
import { Github } from 'lucide-react';

interface AuthConfig {
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    enabled: boolean;
  };
  github: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    enabled: boolean;
  };
}

export function AuthSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<AuthConfig>({
    google: {
      clientId: '',
      clientSecret: '',
      callbackUrl: `${window.location.origin}/auth/google/callback`,
      enabled: false
    },
    github: {
      clientId: '',
      clientSecret: '',
      callbackUrl: `${window.location.origin}/auth/github/callback`,
      enabled: false
    }
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/settings/auth');
      setConfig(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações de autenticação',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      await api.post('/admin/settings/auth', {
        provider,
        config: config[provider]
      });

      toast({
        title: 'Sucesso',
        description: `Configurações do ${provider === 'google' ? 'Google' : 'GitHub'} salvas com sucesso`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProvider = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const newConfig = {
        ...config,
        [provider]: {
          ...config[provider],
          enabled: !config[provider].enabled
        }
      };

      await api.post('/admin/settings/auth', {
        provider,
        config: newConfig[provider]
      });

      setConfig(newConfig);
      toast({
        title: 'Sucesso',
        description: `${provider === 'google' ? 'Google' : 'GitHub'} ${newConfig[provider].enabled ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do provedor',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Autenticação Social</CardTitle>
        <CardDescription>
          Configure as credenciais para permitir que os usuários façam login com suas contas sociais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <FcGoogle className="h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Configurações do Google</CardTitle>
                  <Button
                    variant={config.google.enabled ? "destructive" : "default"}
                    onClick={() => handleToggleProvider('google')}
                    disabled={isLoading}
                  >
                    {config.google.enabled ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
                <CardDescription>
                  Configure as credenciais do OAuth do Google
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    value={config.google.clientId}
                    onChange={(e) => setConfig({
                      ...config,
                      google: { ...config.google, clientId: e.target.value }
                    })}
                    disabled={!config.google.enabled || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    value={config.google.clientSecret}
                    onChange={(e) => setConfig({
                      ...config,
                      google: { ...config.google, clientSecret: e.target.value }
                    })}
                    disabled={!config.google.enabled || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-callback">URL de Callback</Label>
                  <Input
                    id="google-callback"
                    value={config.google.callbackUrl}
                    disabled={true}
                  />
                </div>
                <Button 
                  onClick={() => handleSave('google')}
                  disabled={!config.google.enabled || isLoading}
                  className="w-full"
                >
                  Salvar Configurações do Google
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Configurações do GitHub</CardTitle>
                  <Button
                    variant={config.github.enabled ? "destructive" : "default"}
                    onClick={() => handleToggleProvider('github')}
                    disabled={isLoading}
                  >
                    {config.github.enabled ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
                <CardDescription>
                  Configure as credenciais do OAuth do GitHub
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-client-id">Client ID</Label>
                  <Input
                    id="github-client-id"
                    value={config.github.clientId}
                    onChange={(e) => setConfig({
                      ...config,
                      github: { ...config.github, clientId: e.target.value }
                    })}
                    disabled={!config.github.enabled || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github-client-secret">Client Secret</Label>
                  <Input
                    id="github-client-secret"
                    type="password"
                    value={config.github.clientSecret}
                    onChange={(e) => setConfig({
                      ...config,
                      github: { ...config.github, clientSecret: e.target.value }
                    })}
                    disabled={!config.github.enabled || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github-callback">URL de Callback</Label>
                  <Input
                    id="github-callback"
                    value={config.github.callbackUrl}
                    disabled={true}
                  />
                </div>
                <Button 
                  onClick={() => handleSave('github')}
                  disabled={!config.github.enabled || isLoading}
                  className="w-full"
                >
                  Salvar Configurações do GitHub
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
