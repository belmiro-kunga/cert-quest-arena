
import React, { useEffect, useState } from 'react';
import CertificationCard, { Certification } from './CertificationCard';
import { getActiveExams, Exam } from '@/services/simuladoService';

const Certifications: React.FC = () => {
  const [simulados, setSimulados] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimulados = async () => {
      try {
        setIsLoading(true);
        const exams = await getActiveExams();
        setSimulados(exams);
      } catch (error) {
        setSimulados([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSimulados();
  }, []);

  // Adaptar Exam para CertificationCard
  const mapExamToCertification = (exam: Exam): Certification => ({
    id: exam.id,
    name: exam.title,
    provider: exam.difficulty || 'Simulado',
    level: exam.duration ? `${exam.duration} min` : '',
    image: '/placeholder.svg',
    description: exam.description || '',
  });

  return (
    <section id="certifications" className="py-10 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Certificações Disponíveis</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Escolha entre diversas certificações e prepare-se adequadamente para o exame real
            com nossos simulados personalizados.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center">Carregando simulados...</div>
          ) : simulados.length === 0 ? (
            <div className="col-span-full text-center">Nenhum simulado disponível.</div>
          ) : (
            simulados.map((exam) => (
              <CertificationCard key={exam.id} certification={mapExamToCertification(exam)} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
