import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="hero-gradient text-white py-20 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Prepare-se para suas certificações com confiança
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Simulados realistas, feedback detalhado e uma plataforma adaptada para o seu sucesso nas principais certificações do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/certifications')}
              className="bg-white text-cert-darkblue hover:bg-opacity-90"
              size="lg"
            >
              Iniciar simulado grátis
            </Button>
            <Button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-cert-orange hover:bg-cert-orange/90 text-white"
              size="lg"
            >
              Ver preços
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="absolute -top-3 -right-3">
              <span className="freemium-badge text-white text-xs font-bold px-3 py-1 rounded-full">
                GRÁTIS
              </span>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-cert-blue rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v1H7V5zm0 2h6v1H7V7zm0 2h6v1H7V9zm8 4h-4v1h4v-1zm-8 0h2v1H7v-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800">AWS Cloud Practitioner</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cert-green mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>10 questões de simulado</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cert-green mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Feedback ao final</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cert-green mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Até 3 tentativas por semana</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/exams/aws-cloud-practitioner')}
              className="w-full bg-cert-blue hover:bg-cert-darkblue"
            >
              Começar agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
