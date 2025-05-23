import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { Clock } from 'lucide-react';

const AffiliateTab: React.FC = () => {
  const { user } = useAuth();
  const affiliateStatus = user?.affiliate?.status || null;
  const applicationDate = user?.affiliate?.applicationDate;

  if (!user) return null;

  if (affiliateStatus === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="success" className="bg-green-500">
              Afiliado Ativo
            </Badge>
          </CardTitle>
          <CardDescription>
            Você é um afiliado ativo da CertQuest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Ganhos Totais</h4>
                <p className="text-2xl font-bold text-green-600">R$ {user.affiliate.earnings.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Total de Indicações</h4>
                <p className="text-2xl font-bold text-blue-600">{user.affiliate.referrals}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seu Link de Afiliado</h3>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={user.affiliate.link}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(user.affiliate.link);
                    toast({
                      title: "Link copiado!",
                      description: "O link foi copiado para sua área de transferência",
                    });
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Materiais de Marketing</h3>
              <div className="grid gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Banners</h4>
                  <p className="text-sm text-gray-600 mb-2">Banners otimizados para diferentes plataformas</p>
                  <Button variant="outline" className="w-full">Download</Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Textos Prontos</h4>
                  <p className="text-sm text-gray-600 mb-2">Modelos de posts para redes sociais</p>
                  <Button variant="outline" className="w-full">Acessar</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (affiliateStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Solicitação em Análise
          </CardTitle>
          <CardDescription>
            Sua solicitação para o programa de afiliados está sendo analisada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-semibold text-yellow-800">Status da Solicitação</h4>
                <p className="text-yellow-700 mt-1">
                  Sua solicitação foi recebida em {applicationDate && format(new Date(applicationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800">Próximos Passos</h4>
                <ul className="list-disc list-inside text-yellow-700 mt-1 space-y-1">
                  <li>Nossa equipe está analisando sua solicitação</li>
                  <li>Você receberá uma resposta em até 48 horas</li>
                  <li>Fique atento ao seu email para atualizações</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Enquanto Isso...</h3>
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Prepare-se para o Sucesso</h4>
                <p className="text-sm text-gray-600">
                  Aproveite este tempo para conhecer mais sobre nossos produtos e planejar suas estratégias de divulgação.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Dicas para Afiliados</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Identifique seu público-alvo</li>
                  <li>Prepare conteúdo relevante</li>
                  <li>Planeje suas redes sociais</li>
                  <li>Estude as certificações mais procuradas</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se não for nem approved nem pending, mostra a tela inicial
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
          <Button 
            onClick={() => {
              // Simular envio da solicitação
              toast({
                title: "Solicitação enviada com sucesso",
                description: "Aguarde a análise da nossa equipe",
                variant: "default",
              });
              // Recarregar a página para mostrar o status pendente
              window.location.reload();
            }} 
            className="w-full"
          >
            Solicitar Participação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateTab;
