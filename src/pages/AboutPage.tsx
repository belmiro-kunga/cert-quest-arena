import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, BookOpen, Target, Shield, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  // Remover o estado e efeito relacionados a pageContentService

  // Função para renderizar as seções dinamicamente
  const renderSections = () => {
    // Substituir o conteúdo dinâmico por conteúdo estático ou mensagem padrão
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-cert-blue text-white py-16 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Sobre o CertQuest Arena</h1>
              <p className="max-w-2xl mx-auto text-lg">
                Ajudando profissionais a conquistarem suas certificações com confiança desde 2022
              </p>
            </div>
          </div>

          {/* Seções dinâmicas */}
          {/* Renderização padrão para outras seções */}
          <section className="py-16 px-4 bg-white">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Seção 1</h2>
                <div className="prose prose-lg mx-auto">
                  {/* Renderização padrão para outras seções */}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-cert-blue text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre o CertQuest Arena</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Ajudando profissionais a conquistarem suas certificações com confiança desde 2022
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
