
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  level: string;
  image: string;
  description: string;
}

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ certification }) => {
  const navigate = useNavigate();
  
  const handleStartExam = () => {
    navigate(`/exams/${certification.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="h-32 md:h-40 overflow-hidden bg-gradient-to-r from-cert-blue to-cert-darkblue flex items-center justify-center p-4">
        <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-full flex items-center justify-center">
          <img 
            src={certification.image || "/placeholder.svg"} 
            alt={certification.name} 
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
        </div>
      </div>
      <CardContent className="pt-4 md:pt-6 flex-grow flex flex-col">
        <div className="mb-3 flex flex-wrap gap-1">
          <span className="bg-cert-gray text-xs font-medium px-2 py-0.5 rounded">
            {certification.provider}
          </span>
          <span className="bg-cert-gray text-xs font-medium px-2 py-0.5 rounded">
            {certification.level}
          </span>
        </div>
        <h3 className="font-bold text-base md:text-lg mb-2">{certification.name}</h3>
        <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 flex-grow">{certification.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center space-x-2">
            <span className="freemium-badge text-white text-xs font-bold px-2 py-0.5 rounded">
              FREE
            </span>
            <span className="text-xs text-gray-500">10 questões</span>
          </div>
          <Button 
            onClick={handleStartExam} 
            className="bg-cert-blue hover:bg-cert-darkblue"
            size="sm"
          >
            Iniciar Simulado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationCard;
