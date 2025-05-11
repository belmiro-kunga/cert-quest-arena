import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Users, Link as LinkIcon, TrendingUp } from 'lucide-react';

interface AffiliateTabProps {
  user: any;
}

const AffiliateTab: React.FC<AffiliateTabProps> = ({ user }) => {
  const [isAffiliate, setIsAffiliate] = React.useState(false);
  const [applicationStatus, setApplicationStatus] = React.useState<'pending' | 'approved' | 'rejected' | null>(null);

  const handleApplyForAffiliate = () => {
    setApplicationStatus('pending');
  };

  // Dados simulados de afiliado
  const affiliateStats = {
    totalEarnings: 0,
    pendingPayments: 0,
    totalReferrals: 0,
    conversionRate: '0%',
    affiliateLink: 'https://certquest.com/ref/user123',
  };

  if (!isAffiliate && !applicationStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programa de Afiliados</CardTitle>
          <CardDescription>
            Ganhe dinheiro indicando a CertQuest para outras pessoas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Por que se tornar um afiliado?</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ganhe comissão por cada venda realizada</li>
                <li>Ajude outros a alcançarem suas certificações</li>
                <li>Receba pagamentos mensais</li>
                <li>Acesso a materiais exclusivos de marketing</li>
              </ul>
            </div>
            <Button onClick={handleApplyForAffiliate} className="w-full">
              Solicitar Participação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applicationStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitação em Análise</CardTitle>
          <CardDescription>
            Sua solicitação para o programa de afiliados está sendo analisada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Aguarde enquanto nossa equipe analisa sua solicitação. 
              Você receberá uma resposta em até 48 horas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Afiliado</CardTitle>
          <CardDescription>
            Acompanhe seus ganhos e desempenho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ganhos Totais
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {affiliateStats.totalEarnings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Indicações
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{affiliateStats.totalReferrals}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seu Link de Afiliado</CardTitle>
          <CardDescription>
            Compartilhe este link para ganhar comissões
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={affiliateStats.affiliateLink}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={() => navigator.clipboard.writeText(affiliateStats.affiliateLink)}
              variant="outline"
            >
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Materiais de Marketing</CardTitle>
          <CardDescription>
            Recursos para ajudar na sua divulgação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start">
                <LinkIcon className="mr-2 h-4 w-4" />
                Banner Principal (PNG)
              </Button>
              <Button variant="outline" className="justify-start">
                <LinkIcon className="mr-2 h-4 w-4" />
                Logo CertQuest (SVG)
              </Button>
              <Button variant="outline" className="justify-start">
                <LinkIcon className="mr-2 h-4 w-4" />
                Kit de Email Marketing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateTab;
