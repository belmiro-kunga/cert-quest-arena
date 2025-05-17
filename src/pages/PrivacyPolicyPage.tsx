import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
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
            <p>Última atualização: 17 de maio de 2025</p>
            
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
              <li><strong>Provedores de Serviços:</strong> empresas que prestam serviços em nosso nome, como processamento de pagamentos e análise de dados.</li>
              <li><strong>Parceiros de Negócios:</strong> terceiros com quem podemos oferecer produtos ou serviços em conjunto.</li>
              <li><strong>Cumprimento Legal:</strong> quando exigido por lei, processo legal ou autoridades governamentais.</li>
              <li><strong>Proteção de Direitos:</strong> quando necessário para proteger nossos direitos, propriedade ou segurança.</li>
            </ul>
            
            <h2>5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
              perda ou alteração. Isso inclui criptografia, controles de acesso e monitoramento regular de segurança.
            </p>
            
            <h2>6. Seus Direitos</h2>
            <p>
              Dependendo da sua localização, você pode ter os seguintes direitos:
            </p>
            <ul>
              <li>Acessar e receber uma cópia de seus dados pessoais</li>
              <li>Retificar dados imprecisos ou incompletos</li>
              <li>Solicitar a exclusão de seus dados pessoais</li>
              <li>Restringir ou opor-se ao processamento de seus dados</li>
              <li>Portar seus dados para outro serviço</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>
            
            <h2>7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pessoais pelo tempo necessário para fornecer nossos serviços e cumprir nossas obrigações legais. 
              Quando não tivermos mais necessidade legítima de processar seus dados, iremos excluí-los ou anonimizá-los.
            </p>
            
            <h2>8. Transferências Internacionais</h2>
            <p>
              Seus dados podem ser transferidos e processados em países fora do seu país de residência, onde as leis de proteção de dados 
              podem ser diferentes. Implementamos salvaguardas apropriadas para proteger seus dados durante essas transferências.
            </p>
            
            <h2>9. Cookies e Tecnologias Semelhantes</h2>
            <p>
              Usamos cookies e tecnologias semelhantes para coletar informações sobre como você interage com nossos serviços. 
              Você pode configurar seu navegador para recusar alguns cookies, mas isso pode afetar a funcionalidade de nossos serviços.
            </p>
            
            <h2>10. Privacidade de Crianças</h2>
            <p>
              Nossos serviços não são destinados a pessoas menores de 16 anos. Não coletamos intencionalmente informações pessoais 
              de crianças. Se soubermos que coletamos informações pessoais de uma criança, tomaremos medidas para excluir essas informações.
            </p>
            
            <h2>11. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas 
              publicando a nova política em nosso site ou enviando uma notificação direta.
            </p>
            
            <h2>12. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco pelo e-mail: 
              privacidade@certquest.com
            </p>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
          <Link to="/termos" className="text-cert-blue hover:underline">
            Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
