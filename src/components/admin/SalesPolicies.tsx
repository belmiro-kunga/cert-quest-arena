import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SalesPolicies = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = React.useState({
    refundPolicy: {
      timeLimit: '14',
      automaticRefunds: true,
      refundReason: true,
      policy: 'Nossa política de reembolso garante a satisfação do cliente. Você tem 14 dias após a compra para solicitar um reembolso completo se não estiver satisfeito com o produto.',
    },
    termsOfSale: {
      lastUpdated: new Date().toISOString().split('T')[0],
      content: `1. Geral\n\nAo comprar em nossa plataforma, você concorda com estes termos.\n\n2. Preços e Pagamentos\n\nTodos os preços são em USD ou EUR.\nAceitamos principais cartões de crédito e métodos de pagamento online.\n\n3. Entrega Digital\n\nAcesso imediato após confirmação do pagamento.\nSem reembolso após acesso ao conteúdo digital.\n\n4. Propriedade Intelectual\n\nTodo o conteúdo é protegido por direitos autorais.\nLicença individual e intransferível de uso.`,
    },
    privacyPolicy: {
      dataRetention: '365',
      shareWithPartners: false,
      policy: 'Protegemos seus dados pessoais e informações de pagamento usando criptografia de ponta a ponta. Não compartilhamos suas informações com terceiros sem seu consentimento explícito.',
    },
    disputeResolution: {
      responseTime: '48',
      mediationType: 'internal',
      policy: 'Disputas são tratadas internamente primeiro. Nos comprometemos a responder em até 48 horas úteis. Se necessário, utilizamos mediação de terceiros.',
    }
  });

  const handleSave = () => {
    // TODO: Implementar chamada à API para salvar as políticas
    toast({
      title: 'Políticas atualizadas',
      description: 'As políticas de venda foram atualizadas com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Políticas de Venda</h2>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="refund" className="space-y-4">
        <TabsList>
          <TabsTrigger value="refund">Política de Reembolso</TabsTrigger>
          <TabsTrigger value="terms">Termos de Venda</TabsTrigger>
          <TabsTrigger value="privacy">Política de Privacidade</TabsTrigger>
          <TabsTrigger value="dispute">Resolução de Disputas</TabsTrigger>
        </TabsList>

        <TabsContent value="refund">
          <Card>
            <CardHeader>
              <CardTitle>Política de Reembolso</CardTitle>
              <CardDescription>Configure as regras de reembolso para suas vendas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Prazo para Reembolso (dias)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={policies.refundPolicy.timeLimit}
                  onChange={(e) => setPolicies({
                    ...policies,
                    refundPolicy: { ...policies.refundPolicy, timeLimit: e.target.value }
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="automaticRefunds"
                  checked={policies.refundPolicy.automaticRefunds}
                  onCheckedChange={(checked) => setPolicies({
                    ...policies,
                    refundPolicy: { ...policies.refundPolicy, automaticRefunds: checked }
                  })}
                />
                <Label htmlFor="automaticRefunds">Permitir reembolsos automáticos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="refundReason"
                  checked={policies.refundPolicy.refundReason}
                  onCheckedChange={(checked) => setPolicies({
                    ...policies,
                    refundPolicy: { ...policies.refundPolicy, refundReason: checked }
                  })}
                />
                <Label htmlFor="refundReason">Exigir motivo do reembolso</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundPolicy">Texto da Política de Reembolso</Label>
                <Textarea
                  id="refundPolicy"
                  value={policies.refundPolicy.policy}
                  onChange={(e) => setPolicies({
                    ...policies,
                    refundPolicy: { ...policies.refundPolicy, policy: e.target.value }
                  })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Termos de Venda</CardTitle>
              <CardDescription>Defina os termos e condições de venda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastUpdated">Última Atualização</Label>
                <Input
                  id="lastUpdated"
                  type="date"
                  value={policies.termsOfSale.lastUpdated}
                  onChange={(e) => setPolicies({
                    ...policies,
                    termsOfSale: { ...policies.termsOfSale, lastUpdated: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsContent">Termos de Venda</Label>
                <Textarea
                  id="termsContent"
                  value={policies.termsOfSale.content}
                  onChange={(e) => setPolicies({
                    ...policies,
                    termsOfSale: { ...policies.termsOfSale, content: e.target.value }
                  })}
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Política de Privacidade</CardTitle>
              <CardDescription>Configure as políticas de privacidade e proteção de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={policies.privacyPolicy.dataRetention}
                  onChange={(e) => setPolicies({
                    ...policies,
                    privacyPolicy: { ...policies.privacyPolicy, dataRetention: e.target.value }
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="shareWithPartners"
                  checked={policies.privacyPolicy.shareWithPartners}
                  onCheckedChange={(checked) => setPolicies({
                    ...policies,
                    privacyPolicy: { ...policies.privacyPolicy, shareWithPartners: checked }
                  })}
                />
                <Label htmlFor="shareWithPartners">Compartilhar dados com parceiros</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyPolicy">Texto da Política de Privacidade</Label>
                <Textarea
                  id="privacyPolicy"
                  value={policies.privacyPolicy.policy}
                  onChange={(e) => setPolicies({
                    ...policies,
                    privacyPolicy: { ...policies.privacyPolicy, policy: e.target.value }
                  })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute">
          <Card>
            <CardHeader>
              <CardTitle>Resolução de Disputas</CardTitle>
              <CardDescription>Configure como as disputas serão tratadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="responseTime">Tempo de Resposta (horas)</Label>
                <Input
                  id="responseTime"
                  type="number"
                  value={policies.disputeResolution.responseTime}
                  onChange={(e) => setPolicies({
                    ...policies,
                    disputeResolution: { ...policies.disputeResolution, responseTime: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediationType">Tipo de Mediação</Label>
                <Select
                  value={policies.disputeResolution.mediationType}
                  onValueChange={(value) => setPolicies({
                    ...policies,
                    disputeResolution: { ...policies.disputeResolution, mediationType: value }
                  })}
                >
                  <SelectTrigger id="mediationType">
                    <SelectValue placeholder="Selecione o tipo de mediação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Mediação Interna</SelectItem>
                    <SelectItem value="external">Mediação Externa</SelectItem>
                    <SelectItem value="hybrid">Mediação Híbrida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disputePolicy">Política de Resolução de Disputas</Label>
                <Textarea
                  id="disputePolicy"
                  value={policies.disputeResolution.policy}
                  onChange={(e) => setPolicies({
                    ...policies,
                    disputeResolution: { ...policies.disputeResolution, policy: e.target.value }
                  })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesPolicies;
