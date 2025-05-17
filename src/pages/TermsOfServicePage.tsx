import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage = () => {
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
            <p>Última atualização: 17 de maio de 2025</p>
            
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
            
            <h2>6. Uso Proibido</h2>
            <p>
              Você concorda em não usar o serviço para:
            </p>
            <ul>
              <li>Violar qualquer lei aplicável</li>
              <li>Enviar material ilegal, difamatório, ofensivo ou fraudulento</li>
              <li>Enviar material que infrinja direitos autorais ou outros direitos de propriedade</li>
              <li>Transmitir vírus ou código malicioso</li>
              <li>Interferir ou interromper a integridade ou o desempenho do serviço</li>
              <li>Tentar descompilar, fazer engenharia reversa ou desmontar qualquer parte do serviço</li>
            </ul>
            
            <h2>7. Limitação de Responsabilidade</h2>
            <p>
              Em nenhum caso o CertQuest Arena, seus diretores, funcionários ou agentes serão responsáveis por quaisquer danos indiretos, 
              incidentais, especiais, consequenciais ou punitivos decorrentes do uso do serviço.
            </p>
            
            <h2>8. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Se uma revisão for material, tentaremos 
              fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.
            </p>
            
            <h2>9. Rescisão</h2>
            <p>
              Podemos encerrar ou suspender sua conta e acesso ao serviço imediatamente, sem aviso prévio ou responsabilidade, por qualquer 
              motivo, incluindo, sem limitação, se você violar os Termos.
            </p>
            
            <h2>10. Lei Aplicável</h2>
            <p>
              Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração aos seus conflitos de princípios legais.
            </p>
            
            <h2>11. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail: contato@certquest.com
            </p>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
          <Link to="/privacidade" className="text-cert-blue hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
