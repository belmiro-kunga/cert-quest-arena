import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Pedro Santos',
    role: 'AWS Certified Solutions Architect',
    initials: 'PS',
    company: 'TechCloud Brasil',
    content: 'Os simulados são extremamente precisos! Fui aprovado na certificação AWS com mais de 90% de acertos graças ao CertQuest. A plataforma realmente simula o ambiente real da prova.',
    rating: 5
  },
  {
    id: 2,
    name: 'Ana Oliveira',
    role: 'Azure Administrator',
    initials: 'AO',
    company: 'DevOps Solutions',
    content: 'O que mais gostei foi o feedback detalhado após cada simulado. Ajudou-me a identificar meus pontos fracos e focar nos tópicos certos. Aprovada na primeira tentativa!',
    rating: 5
  },
  {
    id: 3,
    name: 'Lucas Mendes',
    role: 'GCP Cloud Engineer',
    initials: 'LM',
    company: 'CloudTech Services',
    content: 'Interface intuitiva e questões muito bem elaboradas. O sistema de ranking me motivou a estudar mais. Consegui minha certificação GCP em apenas 2 meses de preparação.',
    rating: 5
  },
  {
    id: 4,
    name: 'Mariana Costa',
    role: 'DevOps Engineer',
    initials: 'MC',
    company: 'Agile Systems',
    content: 'A qualidade das explicações é excepcional. Cada questão vem com uma análise profunda que realmente ajuda no aprendizado. Vale muito o investimento!',
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">O Que Dizem Nossos Alunos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Histórias reais de profissionais que conquistaram suas certificações com nossa plataforma.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 bg-cert-blue text-white">
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cert-blue">98%</div>
              <p className="text-sm text-gray-600">Taxa de Aprovação</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cert-blue">5.000+</div>
              <p className="text-sm text-gray-600">Alunos Certificados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cert-blue">4.9/5</div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
