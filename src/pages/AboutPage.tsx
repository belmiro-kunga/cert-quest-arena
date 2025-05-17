import React, { useEffect, useState } from 'react';
import pageContentService, { PageContent } from '@/services/pageContentService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, BookOpen, Target, Shield, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const data = await pageContentService.getPageContent('about');
        setPageData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar conteúdo da página:', err);
        setError('Não foi possível carregar o conteúdo da página. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  // Função para renderizar as seções dinamicamente
  const renderSections = () => {
    if (!pageData || !pageData.sections || pageData.sections.length === 0) {
      return null;
    }

    // Ordenar seções por ordem
    const sortedSections = [...pageData.sections].sort((a, b) => a.order - b.order);

    return sortedSections.map((section) => {
      if (section.sectionKey === 'mission') {
        return (
          <section key={section.sectionKey} className="py-16 px-4 bg-white">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-gray-600">{section.content}</p>
              </div>
            </div>
          </section>
        );
      } else if (section.sectionKey === 'values') {
        // Renderização especial para a seção de valores
        return (
          <section key={section.sectionKey} className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.content.split(',').map((value, index) => {
                  const icons = [
                    <Award key="award" className="h-6 w-6 text-cert-blue" />,
                    <Users key="users" className="h-6 w-6 text-green-600" />,
                    <BookOpen key="book" className="h-6 w-6 text-purple-600" />,
                    <Target key="target" className="h-6 w-6 text-orange-600" />,
                    <Shield key="shield" className="h-6 w-6 text-red-600" />,
                    <Globe key="globe" className="h-6 w-6 text-teal-600" />
                  ];
                  const bgColors = [
                    'bg-blue-100', 'bg-green-100', 'bg-purple-100',
                    'bg-orange-100', 'bg-red-100', 'bg-teal-100'
                  ];
                  
                  return (
                    <Card key={index} className="border-none shadow-md">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 ${bgColors[index % bgColors.length]} rounded-full flex items-center justify-center mb-4`}>
                            {icons[index % icons.length]}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{value.trim()}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        );
      } else if (section.sectionKey === 'history') {
        return (
          <section key={section.sectionKey} className="py-16 px-4 bg-white">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
                <div className="space-y-8">
                  {section.content.split('\n').map((paragraph, index) => {
                    if (paragraph.trim() === '') return null;
                    
                    const years = ['2022', '2023', '2024', '2025'];
                    const yearMatch = years.find(year => paragraph.includes(year));
                    
                    if (yearMatch) {
                      const [title, ...contentParts] = paragraph.split(' - ');
                      const content = contentParts.join(' - ');
                      
                      return (
                        <div key={index}>
                          <h3 className="text-xl font-semibold mb-2">{title}</h3>
                          <p className="text-gray-600">{content}</p>
                        </div>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-gray-600">{paragraph}</p>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      } else {
        // Renderização padrão para outras seções
        return (
          <section key={section.sectionKey} className="py-16 px-4 bg-white">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
                <div className="prose prose-lg mx-auto">
                  {section.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() ? <p key={index} className="text-gray-600">{paragraph}</p> : null
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cert-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando informações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Ops! Algo deu errado</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-cert-blue text-white rounded hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-cert-blue text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{pageData?.title || 'Sobre o CertQuest Arena'}</h1>
            <p className="max-w-2xl mx-auto text-lg">
              {pageData?.subtitle || 'Ajudando profissionais a conquistarem suas certificações com confiança desde 2022'}
            </p>
          </div>
        </div>

        {/* Seções dinâmicas */}
        {renderSections()}
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
