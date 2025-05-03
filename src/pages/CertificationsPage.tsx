
import React from 'react';
import Header from '@/components/Header';
import Certifications from '@/components/Certifications';
import Footer from '@/components/Footer';

const CertificationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-cert-blue text-white py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Certificações Disponíveis</h1>
            <p className="max-w-2xl mx-auto">
              Escolha entre diversas certificações e prepare-se adequadamente para o exame real
              com nossos simulados personalizados.
            </p>
          </div>
        </div>
        <Certifications />
      </main>
      <Footer />
    </div>
  );
};

export default CertificationsPage;
