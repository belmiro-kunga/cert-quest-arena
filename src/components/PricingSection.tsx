
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Nossos Planos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha o plano que melhor atende às suas necessidades e comece a se preparar para 
            sua próxima certificação.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Freemium */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="freemium-badge p-6">
              <h3 className="text-xl font-bold text-white">Freemium</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-bold tracking-tight">Grátis</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-orange mr-2" />
                  <span className="text-gray-600">10 questões por simulado</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-orange mr-2" />
                  <span className="text-gray-600">Até 3 tentativas por semana</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-orange mr-2" />
                  <span className="text-gray-600">Feedback básico ao final</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-orange mr-2" />
                  <span className="text-gray-600">Acesso a todas as certificações</span>
                </li>
              </ul>
              
              <Button className="mt-8 w-full bg-cert-orange hover:bg-cert-orange/90">
                Começar gratuitamente
              </Button>
            </div>
          </div>
          
          {/* Plano Premium */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 px-3 py-1 bg-cert-darkblue text-white text-xs font-bold rounded-bl">
              RECOMENDADO
            </div>
            
            <div className="premium-badge p-6">
              <h3 className="text-xl font-bold text-white">Premium</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-bold tracking-tight">R$29,90</span>
                <span className="ml-1 text-lg">/mês</span>
              </div>
              <p className="text-xs text-white/80 mt-2">ou R$299,90/ano (economia de 17%)</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Simulados completos com 60 questões</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Tentativas ilimitadas</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Feedback detalhado com explicações</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Métricas de desempenho e progresso</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Banco de questões ilimitado</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-cert-purple mr-2" />
                  <span className="text-gray-600">Proctoring opcional (monitoramento)</span>
                </li>
              </ul>
              
              <Button className="mt-8 w-full bg-cert-purple hover:bg-cert-purple/90">
                Assinar Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
