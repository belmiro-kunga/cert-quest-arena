import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
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
      
      // Buscar configurações do Google
      const { data: googleData, error: googleError } = await supabase
        .from('auth_settings')
        .select('*')
        .eq('provider', 'google')
        .single();

      if (googleError && googleError.code !== 'PGRST116') { // PGRST116 é o código para "no rows returned"
        throw googleError;
      }

      // Buscar configurações do GitHub
      const { data: githubData, error: githubError } = await supabase
        .from('auth_settings')
        .select('*')
        .eq('provider', 'github')
        .single();

      if (githubError && githubError.code !== 'PGRST116') {
        throw githubError;
      }

      setConfig({
        google: {
          clientId: googleData?.client_id || '',
          clientSecret: googleData?.client_secret || '',
          callbackUrl: googleData?.callback_url || `${window.location.origin}/auth/google/callback`,
          enabled: googleData?.enabled || false
        },
        github: {
          clientId: githubData?.client_id || '',
          clientSecret: githubData?.client_secret || '',
          callbackUrl: githubData?.callback_url || `${window.location.origin}/auth/github/callback`,
          enabled: githubData?.enabled || false
        }
      });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
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
      
      const { error } = await supabase
        .from('auth_settings')
        .upsert({
          provider,
          client_id: config[provider].clientId,
          client_secret: config[provider].clientSecret,
          callback_url: config[provider].callbackUrl,
          enabled: config[provider].enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Configurações do ${provider === 'google' ? 'Google' : 'GitHub'} salvas com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
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
      const newEnabled = !config[provider].enabled;

      const { error } = await supabase
        .from('auth_settings')
        .upsert({
          provider,
          client_id: config[provider].clientId,
          client_secret: config[provider].clientSecret,
          callback_url: config[provider].callbackUrl,
          enabled: newEnabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setConfig({
        ...config,
        [provider]: {
          ...config[provider],
          enabled: newEnabled
        }
      });

      toast({
        title: 'Sucesso',
        description: `${provider === 'google' ? 'Google' : 'GitHub'} ${newEnabled ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status do provedor:', error);
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
