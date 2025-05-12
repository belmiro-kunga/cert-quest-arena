import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimuladosList from '@/components/simulado/SimuladosList';
import { getActiveExams, Exam } from '@/services/simuladoService';

const SimuladosPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-cert-blue text-white py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Simulados Disponíveis</h1>
            <p className="max-w-2xl mx-auto">
              Escolha entre diversos simulados e prepare-se adequadamente para o exame real
              com nossos simulados personalizados.
            </p>
          </div>
        </div>
        <SimuladosList />
      </main>
      <Footer />
    </div>
  );
};

export default SimuladosPage;
