
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    id: 1,
    title: 'Simulados Realistas',
    description: 'Questões cuidadosamente selecionadas que simulam o ambiente real das provas de certificação.'
  },
  {
    id: 2,
    title: 'Feedback Detalhado',
    description: 'Explicações completas para cada questão, ajudando você a entender por que uma resposta é correta ou incorreta.'
  },
  {
    id: 3,
    title: 'Algoritmo Inteligente',
    description: 'Sistema que evita repetição imediata de questões, garantindo uma experiência de aprendizado abrangente.'
  },
  {
    id: 4,
    title: 'Diferentes Modalidades',
    description: 'Versão gratuita para experimentar e versão premium com recursos avançados para uma preparação completa.'
  },
  {
    id: 5,
    title: 'Pool de Questões Categorizado',
    description: 'Questões organizadas por tópicos, permitindo foco nas áreas que precisam de mais atenção.'
  },
  {
    id: 6,
    title: 'Monitoramento Opcional',
    description: 'Sistema de proctoring disponível para simulações ainda mais próximas do exame real (Premium).'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Por que escolher nossa plataforma?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desenvolvida por especialistas em certificações para oferecer a melhor experiência de preparação.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-full bg-cert-blue/10 flex items-center justify-center mb-4">
                  <span className="text-cert-blue font-bold">{feature.id}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
