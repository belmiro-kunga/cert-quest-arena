import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LegalPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-cert-blue text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Informações Legais</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Documentos legais e políticas do CertQuest Arena para garantir transparência e conformidade.
            </p>
          </div>
        </div>

        {/* Legal Documents Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Terms of Service */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-cert-blue" />
                    </div>
                    <CardTitle>Termos de Uso</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                    Nossos termos de uso detalham as regras, diretrizes e obrigações para utilização da plataforma CertQuest Arena.
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to="/termos">Ver Termos de Uso</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Privacy Policy */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Política de Privacidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                    Nossa política de privacidade explica como coletamos, usamos e protegemos seus dados pessoais.
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to="/privacidade">Ver Política de Privacidade</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Cookie Policy */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Cookie className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Política de Cookies</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                    Nossa política de cookies detalha como utilizamos cookies e tecnologias similares para melhorar sua experiência.
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to="/cookies">Ver Política de Cookies</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-16 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes sobre Aspectos Legais</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Como posso solicitar a exclusão dos meus dados?</h3>
                  <p className="text-gray-600">
                    Para solicitar a exclusão dos seus dados, acesse sua conta, vá até a seção de Privacidade nas configurações 
                    do perfil e clique em "Solicitar exclusão de dados". Alternativamente, você pode entrar em contato conosco 
                    através da nossa página de contato.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">O CertQuest Arena está em conformidade com a LGPD?</h3>
                  <p className="text-gray-600">
                    Sim, o CertQuest Arena está em total conformidade com a Lei Geral de Proteção de Dados (LGPD). 
                    Implementamos medidas técnicas e organizacionais para garantir a proteção dos seus dados pessoais.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Como posso reportar uma violação dos termos de uso?</h3>
                  <p className="text-gray-600">
                    Se você identificar conteúdo ou comportamento que viole nossos termos de uso, por favor, entre em contato 
                    imediatamente através do email denuncias@certquestarena.com ou utilize o formulário disponível em nossa 
                    página de contato.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Tem alguma dúvida sobre nossos documentos legais ou políticas?
              </p>
              <Button asChild>
                <Link to="/contato">Entre em Contato</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
