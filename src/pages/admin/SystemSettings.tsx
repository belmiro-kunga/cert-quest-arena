import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/system-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações do sistema.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      setIsSaving(true);
      await api.put(`/system-settings/${key}`, { value });
      
      // Update local state
      setSettings(prev => 
        prev.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        )
      );
      
      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCurrencyChange = (value: string) => {
    updateSetting('default_currency', value);
  };

  const getSetting = (key: string): SystemSetting | undefined => {
    return settings.find(setting => setting.key === key);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações globais da plataforma.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Site</CardTitle>
                <CardDescription>
                  Configure as informações básicas do site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Nome do Site</Label>
                    <Input
                      id="site_name"
                      value={getSetting('site_name')?.value || ''}
                      onChange={(e) => {}}
                      onBlur={(e) => updateSetting('site_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Descrição do Site</Label>
                    <Input
                      id="site_description"
                      value={getSetting('site_description')?.value || ''}
                      onChange={(e) => {}}
                      onBlur={(e) => updateSetting('site_description', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Configure as opções de pagamento e moedas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default_currency">Moeda Padrão</Label>
                    <Select
                      value={getSetting('default_currency')?.value || 'USD'}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a moeda padrão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                        <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Esta será a moeda padrão exibida para todos os usuários.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subscription_default_duration">Duração Padrão de Assinatura (dias)</Label>
                    <Input
                      id="subscription_default_duration"
                      type="number"
                      min="1"
                      value={getSetting('subscription_default_duration')?.value || '365'}
                      onChange={(e) => {}}
                      onBlur={(e) => updateSetting('subscription_default_duration', e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Informação sobre Moedas</h3>
                  <p className="text-sm text-blue-700">
                    A moeda padrão será usada em toda a plataforma para exibir preços. Os usuários ainda poderão
                    alternar entre moedas disponíveis, mas esta será a opção padrão.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={loadSettings}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SystemSettings; 