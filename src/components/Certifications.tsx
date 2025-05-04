
import React from 'react';
import CertificationCard, { Certification } from './CertificationCard';

const certifications: Certification[] = [
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'AWS',
    level: 'Fundamental',
    image: '/placeholder.svg',
    description: 'Validação dos conhecimentos básicos da AWS Cloud, independentemente de função ou especialidade técnica específica.'
  },
  {
    id: 'azure-fundamentals',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    provider: 'Microsoft',
    level: 'Fundamental',
    image: '/placeholder.svg',
    description: 'Conhecimentos fundamentais sobre conceitos de nuvem, serviços Azure e gerenciamento de serviços Azure.'
  },
  {
    id: 'comptia-a-plus',
    name: 'CompTIA A+',
    provider: 'CompTIA',
    level: 'Fundamental',
    image: '/placeholder.svg',
    description: 'Certificação básica para profissionais de TI, abrangendo hardware, software, redes e solução de problemas.'
  },
  {
    id: 'cisco-ccna',
    name: 'Cisco CCNA',
    provider: 'Cisco',
    level: 'Associado',
    image: '/placeholder.svg',
    description: 'Habilidades de instalação, configuração, operação e troubleshooting de redes de tamanho médio.'
  },
  {
    id: 'google-cloud-associate',
    name: 'Google Cloud Associate Engineer',
    provider: 'Google',
    level: 'Associado',
    image: '/placeholder.svg',
    description: 'Implantação de aplicativos, monitoramento de operações e manutenção de implantações no Google Cloud.'
  },
  {
    id: 'vmware-vcp',
    name: 'VMware VCP-DCV',
    provider: 'VMware',
    level: 'Profissional',
    image: '/placeholder.svg',
    description: 'Instalação, implementação e gerenciamento de infraestruturas virtuais usando o VMware vSphere.'
  }
];

const Certifications: React.FC = () => {
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
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
