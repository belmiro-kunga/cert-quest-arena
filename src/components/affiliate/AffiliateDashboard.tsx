import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, Users, TrendingUp, Link as LinkIcon } from 'lucide-react';

const AffiliateDashboard = () => {
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = React.useState({
    earnings: {
      currentMonth: 1250.50,
      total: 4500.75,
      pending: 750.25,
      nextPayout: '2025-05-25',
    },
    referrals: {
      total: 45,
      active: 32,
      conversionRate: '71.11',
    },
    links: {
      default: 'https://certquest.com/?ref=AF123',
      custom: [] as string[],
    },
    recentSales: [
      { id: 1, product: 'AWS Certification', date: '2025-05-10', amount: 199.99, commission: 20.00, status: 'Confirmado' },
      { id: 2, product: 'Azure Fundamentals', date: '2025-05-09', amount: 149.99, commission: 15.00, status: 'Pendente' },
      { id: 3, product: 'Google Cloud', date: '2025-05-08', amount: 299.99, commission: 30.00, status: 'Confirmado' },
    ],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link copiado!',
      description: 'O link de afiliado foi copiado para sua área de transferência.',
    });
  };

  const generateCustomLink = () => {
    // TODO: Implementar geração de link personalizado
    toast({
      title: 'Link gerado',
      description: 'Seu link personalizado foi gerado com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$${affiliateData.earnings.currentMonth}</div>
            <p className="text-xs text-muted-foreground">
              Próximo pagamento em {new Date(affiliateData.earnings.nextPayout).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ganhos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$${affiliateData.earnings.total}</div>
            <p className="text-xs text-muted-foreground">
              Pendente: $${affiliateData.earnings.pending}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referências</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateData.referrals.total}</div>
            <p className="text-xs text-muted-foreground">
              {affiliateData.referrals.active} ativos ({affiliateData.referrals.conversionRate}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateData.referrals.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Média dos últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Vendas Recentes</TabsTrigger>
          <TabsTrigger value="links">Links de Afiliado</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>
                Lista das suas vendas mais recentes e status das comissões.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateData.recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>$${sale.amount}</TableCell>
                      <TableCell>$${sale.commission}</TableCell>
                      <TableCell>{sale.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Links de Afiliado</CardTitle>
              <CardDescription>
                Gerencie seus links de afiliado e crie links personalizados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Link Principal</Label>
                <div className="flex gap-2">
                  <Input value={affiliateData.links.default} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(affiliateData.links.default)}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gerar Link Personalizado</Label>
                <div className="flex gap-2">
                  <Input placeholder="Nome da campanha (opcional)" />
                  <Button onClick={generateCustomLink}>
                    Gerar Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliateDashboard;
