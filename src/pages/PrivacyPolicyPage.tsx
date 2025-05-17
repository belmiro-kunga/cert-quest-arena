import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolicies } from '@/hooks/usePolicies';
import ReactMarkdown from 'react-markdown';

const PrivacyPolicyPage = () => {
  const { privacyPolicy, loading, error } = usePolicies();
  const [lastUpdated, setLastUpdated] = useState<string>('17 de maio de 2025');

  useEffect(() => {
    if (privacyPolicy?.lastUpdated) {
      try {
        const date = new Date(privacyPolicy.lastUpdated);
        setLastUpdated(date.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }));
      } catch (e) {
        console.error('Erro ao formatar data:', e);
      }
    }
  }, [privacyPolicy]);

  // Conteúdo padrão caso não haja conteúdo gerenciado pelo administrador
  const defaultContent = (
    <>
      <h2>1. Introdução</h2>
      <p>
        Esta Política de Privacidade descreve como o CertQuest Arena coleta, usa, processa e compartilha seus dados pessoais 
        quando você usa nossos serviços. Valorizamos sua privacidade e estamos comprometidos em proteger seus dados pessoais.
      </p>
      
      <h2>2. Informações que Coletamos</h2>
      <p>
        Podemos coletar os seguintes tipos de informações:
      </p>
      <ul>
        <li><strong>Informações de Conta:</strong> nome, endereço de e-mail, senha e outras informações de registro.</li>
        <li><strong>Informações de Perfil:</strong> foto de perfil, biografia, preferências e configurações.</li>
        <li><strong>Informações de Uso:</strong> como você interage com nossos serviços, incluindo o tempo gasto, páginas visitadas e recursos utilizados.</li>
        <li><strong>Informações do Dispositivo:</strong> tipo de dispositivo, sistema operacional, navegador, endereço IP e identificadores de dispositivo.</li>
        <li><strong>Informações de Localização:</strong> localização geográfica aproximada com base no endereço IP.</li>
        <li><strong>Informações de Pagamento:</strong> detalhes de cartão de crédito ou outras informações financeiras necessárias para processamento de pagamentos.</li>
      </ul>
      
      <h2>3. Como Usamos Suas Informações</h2>
      <p>
        Usamos suas informações para:
      </p>
      <ul>
        <li>Fornecer, manter e melhorar nossos serviços</li>
        <li>Processar transações e enviar notificações relacionadas</li>
        <li>Personalizar sua experiência e fornecer conteúdo relevante</li>
        <li>Monitorar e analisar tendências, uso e atividades em nossos serviços</li>
        <li>Detectar, prevenir e resolver problemas técnicos, fraudes ou atividades ilegais</li>
        <li>Comunicar-se com você sobre atualizações, ofertas e eventos</li>
      </ul>
      
      <h2>4. Compartilhamento de Informações</h2>
      <p>
        Podemos compartilhar suas informações com:
      </p>
      <ul>
        <li><strong>Prestadores de Serviços:</strong> empresas que prestam serviços em nosso nome, como processamento de pagamentos, análise de dados, entrega de e-mail, hospedagem e serviços de atendimento ao cliente.</li>
        <li><strong>Parceiros de Negócios:</strong> terceiros com quem podemos oferecer produtos ou serviços em conjunto.</li>
        <li><strong>Afiliadas:</strong> empresas relacionadas ao CertQuest Arena para fins consistentes com esta Política de Privacidade.</li>
        <li><strong>Conformidade Legal:</strong> quando acreditamos de boa-fé que a divulgação é necessária para cumprir a lei, proteger nossos direitos ou a segurança de outros.</li>
      </ul>
      
      <h2>5. Seus Direitos e Escolhas</h2>
      <p>
        Dependendo da sua localização, você pode ter os seguintes direitos:
      </p>
      <ul>
        <li>Acessar, corrigir ou excluir seus dados pessoais</li>
        <li>Restringir ou se opor ao processamento de seus dados</li>
        <li>Solicitar a portabilidade de seus dados</li>
        <li>Retirar o consentimento a qualquer momento</li>
        <li>Optar por não receber comunicações de marketing</li>
      </ul>
      <p>
        Para exercer esses direitos, entre em contato conosco através das informações fornecidas na seção "Contato" abaixo.
      </p>
      
      <h2>6. Segurança de Dados</h2>
      <p>
        Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, 
        perda acidental ou alteração. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 
        100% seguro, e não podemos garantir sua segurança absoluta.
      </p>
      
      <h2>7. Retenção de Dados</h2>
      <p>
        Mantemos seus dados pessoais pelo tempo necessário para fornecer os serviços solicitados, cumprir nossas obrigações legais, 
        resolver disputas e fazer cumprir nossos acordos. Os critérios usados para determinar nossos períodos de retenção incluem 
        a natureza dos dados, o propósito do processamento e requisitos legais.
      </p>
      
      <h2>8. Transferências Internacionais</h2>
      <p>
        Seus dados pessoais podem ser transferidos e processados em países diferentes daquele em que você reside. 
        Esses países podem ter leis de proteção de dados diferentes das leis do seu país. Quando transferimos seus dados 
        para outros países, tomamos medidas para garantir que eles recebam um nível adequado de proteção.
      </p>
      
      <h2>9. Crianças</h2>
      <p>
        Nossos serviços não são direcionados a pessoas com menos de 18 anos, e não coletamos intencionalmente dados pessoais 
        de crianças. Se soubermos que coletamos dados pessoais de uma criança, tomaremos medidas para excluir essas informações 
        o mais rápido possível.
      </p>
      
      <h2>10. Alterações a Esta Política</h2>
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por outros 
        motivos operacionais, legais ou regulatórios. Notificaremos você sobre quaisquer alterações materiais através de um 
        aviso em nosso site ou por outros meios.
      </p>
      
      <h2>11. Contato</h2>
      <p>
        Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco:
      </p>
      <ul>
        <li>Email: privacidade@certquestarena.com</li>
        <li>Endereço: Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100</li>
        <li>Telefone: +55 (11) 3456-7890</li>
      </ul>
      
      <h2>12. Consentimento</h2>
      <p>
        Ao usar nossos serviços, você consente com a coleta, uso e processamento de seus dados pessoais conforme descrito nesta 
        Política de Privacidade. Se você não concordar com esta política, por favor, não use nossos serviços.
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
            <CardTitle className="text-2xl font-bold">Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cert-blue" />
                <span className="ml-2">Carregando política de privacidade...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">
                <p>Ocorreu um erro ao carregar a política de privacidade. Por favor, tente novamente mais tarde.</p>
              </div>
            ) : (
              <>
                <p>Última atualização: {lastUpdated}</p>
                
                {privacyPolicy?.content ? (
                  <ReactMarkdown>{privacyPolicy.content}</ReactMarkdown>
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

export default PrivacyPolicyPage;
