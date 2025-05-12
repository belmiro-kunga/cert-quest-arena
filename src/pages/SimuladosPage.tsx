import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimuladosList from '@/components/simulado/SimuladosList';
import { getActiveExams, Exam } from '@/services/simuladoService';

const SimuladosPage: React.FC = () => {
  const [debug, setDebug] = useState<{ loading: boolean; data: Exam[] | null; error: string | null }>({ 
    loading: true, 
    data: null, 
    error: null 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDebug(prev => ({ ...prev, loading: true }));
        console.log('SimuladosPage: Buscando simulados ativos...');
        const exams = await getActiveExams();
        console.log('SimuladosPage: Simulados recebidos:', exams);
        setDebug({ loading: false, data: exams, error: null });
      } catch (error) {
        console.error('SimuladosPage: Erro ao buscar simulados:', error);
        setDebug({ loading: false, data: null, error: String(error) });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SimuladosList />
        
        {/* Componente de depuração - remover após resolver o problema */}
        <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Depuração</h2>
          <div className="text-sm">
            <p><strong>Status:</strong> {debug.loading ? 'Carregando...' : 'Concluído'}</p>
            <p><strong>Erro:</strong> {debug.error || 'Nenhum'}</p>
            <p><strong>Dados:</strong></p>
            <pre className="bg-gray-200 p-2 rounded mt-2 overflow-auto max-h-40">
              {debug.data ? JSON.stringify(debug.data, null, 2) : 'Nenhum dado'}
            </pre>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimuladosPage;
