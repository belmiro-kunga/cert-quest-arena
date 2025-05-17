import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolicies } from '@/hooks/usePolicies';
import ReactMarkdown from 'react-markdown';

const TermsOfServicePage = () => {
  const { termsOfUse, loading, error } = usePolicies();
  const [lastUpdated, setLastUpdated] = useState<string>('17 de maio de 2025');

  useEffect(() => {
    if (termsOfUse?.lastUpdated) {
      try {
        const date = new Date(termsOfUse.lastUpdated);
        setLastUpdated(date.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }));
      } catch (e) {
        console.error('Erro ao formatar data:', e);
      }
    }
  }, [termsOfUse]);

  // Conteúdo padrão caso não haja conteúdo gerenciado pelo administrador
  const defaultContent = (
    <>
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar ou usar o CertQuest Arena, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
        Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
      </p>
      
      <h2>2. Descrição do Serviço</h2>
      <p>
        O CertQuest Arena é uma plataforma educacional que oferece simulados e materiais de estudo para certificações profissionais.
        Nossos serviços incluem acesso a simulados, questões práticas, estatísticas de desempenho e materiais de estudo.
      </p>
      
      <h2>3. Contas de Usuário</h2>
      <p>
        Para acessar determinados recursos do nosso serviço, você precisará criar uma conta. Você é responsável por manter a confidencialidade 
        de sua conta e senha e por restringir o acesso ao seu computador. Você concorda em aceitar a responsabilidade por todas as atividades 
        que ocorrem em sua conta.
      </p>
      
      <h2>4. Conteúdo do Usuário</h2>
      <p>
        Nosso serviço permite que você publique, compartilhe e armazene conteúdo. Você mantém todos os direitos sobre o conteúdo que você envia, 
        publica ou exibe em ou através do serviço. Ao enviar conteúdo para o serviço, você concede a nós uma licença mundial, não exclusiva, 
        isenta de royalties para usar, reproduzir e distribuir seu conteúdo em conexão com o serviço.
      </p>
      
      <h2>5. Propriedade Intelectual</h2>
      <p>
        O serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do CertQuest Arena e seus licenciadores. 
        O serviço é protegido por direitos autorais, marcas registradas e outras leis.
      </p>
      
      <h2>6. Links para Outros Sites</h2>
      <p>
        Nosso serviço pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pelo CertQuest Arena.
        O CertQuest Arena não tem controle sobre, e não assume nenhuma responsabilidade pelo conteúdo, políticas de privacidade ou práticas 
        de quaisquer sites ou serviços de terceiros. Você reconhece e concorda que o CertQuest Arena não será responsável, direta ou indiretamente, 
        por qualquer dano ou perda causada ou alegadamente causada por ou em conexão com o uso ou confiança em qualquer conteúdo, bens ou serviços 
        disponíveis em ou através de tais sites ou serviços.
      </p>
      
      <h2>7. Rescisão</h2>
      <p>
        Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, 
        sem limitação, se você violar os Termos. Após a rescisão, seu direito de usar o serviço cessará imediatamente.
      </p>
      
      <h2>8. Limitação de Responsabilidade</h2>
      <p>
        Em nenhum caso o CertQuest Arena, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, 
        serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, 
        sem limitação, perda de lucros, dados, uso, boa vontade, ou outras perdas intangíveis, resultantes de (i) seu acesso 
        ou uso ou incapacidade de acessar ou usar o serviço; (ii) qualquer conduta ou conteúdo de terceiros no serviço; 
        (iii) qualquer conteúdo obtido do serviço; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo.
      </p>
      
      <h2>9. Isenção de Garantias</h2>
      <p>
        Seu uso do serviço é por sua conta e risco. O serviço é fornecido "como está" e "conforme disponível". O serviço é fornecido 
        sem garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não se limitando a, garantias implícitas de comercialização, 
        adequação a um propósito específico, não violação ou desempenho.
      </p>
      
      <h2>10. Lei Aplicável</h2>
      <p>
        Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem levar em conta suas disposições sobre conflitos de leis.
        Nossa falha em fazer valer qualquer direito ou disposição destes Termos não será considerada uma renúncia a esses direitos. 
        Se qualquer disposição destes Termos for considerada inválida ou inexequível por um tribunal, as disposições restantes destes 
        Termos permanecerão em vigor.
      </p>
      
      <h2>11. Alterações</h2>
      <p>
        Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. 
        Se uma revisão for material, tentaremos fornecer um aviso de pelo menos 30 dias antes que quaisquer novos termos entrem em vigor. 
        O que constitui uma alteração material será determinado a nosso exclusivo critério.
      </p>
      
      <h2>12. Contato</h2>
      <p>
        Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo email: termos@certquestarena.com
      </p>
    </>
  );

  return (
    <div className="min-h-screen bg-cert-gray px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="flex items-center text-cert-blue hover:text-cert-blue-dark transition-colors mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Voltar para a página inicial</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Termos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cert-blue" />
                <span className="ml-2">Carregando termos de uso...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">
                <p>Ocorreu um erro ao carregar os termos de uso. Por favor, tente novamente mais tarde.</p>
              </div>
            ) : (
              <>
                <p>Última atualização: {lastUpdated}</p>
                
                {termsOfUse?.content ? (
                  <ReactMarkdown>{termsOfUse.content}</ReactMarkdown>
                ) : (
                  defaultContent
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
