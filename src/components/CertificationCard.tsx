
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-40 overflow-hidden bg-gradient-to-r from-cert-blue to-cert-darkblue flex items-center justify-center p-4">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
          <img 
            src={certification.image || "/placeholder.svg"} 
            alt={certification.name} 
            className="h-12 w-12 object-contain"
          />
        </div>
      </div>
      <CardContent className="pt-6">
        <div className="mb-4">
          <span className="bg-cert-gray text-xs font-medium px-2.5 py-1 rounded">
            {certification.provider}
          </span>
          <span className="bg-cert-gray text-xs font-medium px-2.5 py-1 rounded ml-2">
            {certification.level}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2">{certification.name}</h3>
        <p className="text-gray-600 text-sm mb-6">{certification.description}</p>
        <div className="flex justify-between items-center">
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
