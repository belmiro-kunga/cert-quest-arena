import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-cert-gray px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="flex items-center text-cert-blue hover:text-cert-blue-dark transition-colors mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Voltar para a página inicial</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Política de Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>Última atualização: 17 de maio de 2025</p>
            
            <h2>1. O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou celular) 
              quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre-se de suas ações e 
              preferências ao longo do tempo.
            </p>
            
            <h2>2. Como Usamos Cookies</h2>
            <p>
              O CertQuest Arena utiliza cookies para diversos propósitos, incluindo:
            </p>
            <ul>
              <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site. Eles permitem recursos básicos como navegação e acesso a áreas seguras do site.</li>
              <li><strong>Cookies de Preferências:</strong> Permitem que o site lembre informações que mudam a aparência ou o comportamento do site, como seu idioma preferido ou a região em que você está.</li>
              <li><strong>Cookies de Estatísticas:</strong> Ajudam-nos a entender como os visitantes interagem com o site, coletando e relatando informações anonimamente.</li>
              <li><strong>Cookies de Marketing:</strong> Utilizados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes para o usuário individual.</li>
            </ul>
            
            <h2>3. Tipos de Cookies que Utilizamos</h2>
            <p>
              Nosso site utiliza os seguintes tipos de cookies:
            </p>
            <ul>
              <li><strong>Cookies de Sessão:</strong> Temporários e expiram quando você fecha o navegador.</li>
              <li><strong>Cookies Persistentes:</strong> Permanecem no seu dispositivo por um período específico ou até serem excluídos manualmente.</li>
              <li><strong>Cookies Próprios:</strong> Colocados pelo site que você está visitando.</li>
              <li><strong>Cookies de Terceiros:</strong> Colocados por domínios diferentes do site que você está visitando.</li>
            </ul>
            
            <h2>4. Cookies Específicos que Utilizamos</h2>
            <table className="w-full border-collapse border border-gray-300 my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Nome do Cookie</th>
                  <th className="border border-gray-300 p-2 text-left">Propósito</th>
                  <th className="border border-gray-300 p-2 text-left">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">auth_token</td>
                  <td className="border border-gray-300 p-2">Autenticação do usuário</td>
                  <td className="border border-gray-300 p-2">30 dias</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">session_id</td>
                  <td className="border border-gray-300 p-2">Gerenciamento de sessão</td>
                  <td className="border border-gray-300 p-2">Sessão</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">_ga</td>
                  <td className="border border-gray-300 p-2">Google Analytics (estatísticas de uso)</td>
                  <td className="border border-gray-300 p-2">2 anos</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">_gid</td>
                  <td className="border border-gray-300 p-2">Google Analytics (identificação de usuários)</td>
                  <td className="border border-gray-300 p-2">24 horas</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">preferences</td>
                  <td className="border border-gray-300 p-2">Armazena preferências do usuário</td>
                  <td className="border border-gray-300 p-2">1 ano</td>
                </tr>
              </tbody>
            </table>
            
            <h2>5. Como Gerenciar Cookies</h2>
            <p>
              A maioria dos navegadores permite que você controle cookies através das configurações de preferências. 
              Você pode:
            </p>
            <ul>
              <li>Bloquear todos os cookies</li>
              <li>Permitir apenas cookies próprios e bloquear cookies de terceiros</li>
              <li>Excluir cookies quando fechar o navegador</li>
              <li>Aceitar ou recusar cookies específicos</li>
            </ul>
            <p>
              Observe que restringir cookies pode impactar sua experiência em nosso site, pois algumas funcionalidades 
              podem não funcionar corretamente.
            </p>
            
            <h2>6. Como Desabilitar Cookies</h2>
            <p>
              Você pode desabilitar cookies através das configurações do seu navegador:
            </p>
            <ul>
              <li><strong>Google Chrome:</strong> Menu {'->'} Configurações {'->'} Avançado {'->'} Privacidade e segurança {'->'} Configurações de conteúdo {'->'} Cookies</li>
              <li><strong>Mozilla Firefox:</strong> Menu {'->'} Opções {'->'} Privacidade e Segurança {'->'} Cookies e dados do site</li>
              <li><strong>Safari:</strong> Preferências {'->'} Privacidade {'->'} Cookies e dados do site</li>
              <li><strong>Microsoft Edge:</strong> Menu {'->'} Configurações {'->'} Cookies e permissões do site {'->'} Cookies</li>
            </ul>
            
            <h2>7. Atualizações na Política de Cookies</h2>
            <p>
              Podemos atualizar nossa Política de Cookies periodicamente. Recomendamos que você revise esta página 
              regularmente para se manter informado sobre quaisquer alterações. Alterações significativas serão 
              notificadas através de um aviso em nosso site.
            </p>
            
            <h2>8. Contato</h2>
            <p>
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco:
            </p>
            <ul>
              <li>Email: privacidade@certquestarena.com</li>
              <li>Formulário de contato: <Link to="/contato" className="text-cert-blue hover:underline">Página de Contato</Link></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
