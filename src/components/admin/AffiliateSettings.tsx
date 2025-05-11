import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AffiliateSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState({
    commissionRate: '10',
    minimumPayoutUSD: '100',
    minimumPayoutEUR: '90',
    payoutFrequency: '30',
    autoApproval: true,
    cookieLifetime: '30',
    defaultCurrency: 'USD'
  });

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      toast({
        title: 'Configurações salvas',
        description: 'As configurações de afiliados foram atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar as configurações.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações de Afiliados</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Configure as regras gerais do programa de afiliados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Moeda Padrão</Label>
              <Select 
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD (Dólar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumPayoutUSD">Pagamento Mínimo (USD)</Label>
              <Input
                id="minimumPayoutUSD"
                type="number"
                min="0"
                value={settings.minimumPayoutUSD}
                onChange={(e) => setSettings({ ...settings, minimumPayoutUSD: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumPayoutEUR">Pagamento Mínimo (EUR)</Label>
              <Input
                id="minimumPayoutEUR"
                type="number"
                min="0"
                value={settings.minimumPayoutEUR}
                onChange={(e) => setSettings({ ...settings, minimumPayoutEUR: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutFrequency">Frequência de Pagamento (dias)</Label>
              <Input
                id="payoutFrequency"
                type="number"
                min="1"
                value={settings.payoutFrequency}
                onChange={(e) => setSettings({ ...settings, payoutFrequency: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookieLifetime">Duração do Cookie (dias)</Label>
              <Input
                id="cookieLifetime"
                type="number"
                min="1"
                value={settings.cookieLifetime}
                onChange={(e) => setSettings({ ...settings, cookieLifetime: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoApproval"
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApproval: checked })}
              />
              <Label htmlFor="autoApproval">Aprovação Automática de Afiliados</Label>
            </div>

            <Button onClick={handleSave} className="w-full">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateSettings;
