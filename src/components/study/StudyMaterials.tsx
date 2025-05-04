
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Video, Link, Book } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'article' | 'video' | 'document' | 'link';
  description: string;
  url: string;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface StudyMaterialsProps {
  materials: StudyMaterial[];
}

const typeIcons = {
  article: FileText,
  video: Video,
  document: Book,
  link: Link
};

const levelColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500'
};

export const StudyMaterials: React.FC<StudyMaterialsProps> = ({ materials }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((material) => {
        const Icon = typeIcons[material.type];
        
        return (
          <Card key={material.id}>
            <CardHeader className="pb-2 pt-4 px-4 md:px-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <CardTitle className="text-base md:text-lg">{material.title}</CardTitle>
                </div>
                <Badge className={`${levelColors[material.level]} text-xs`}>
                  {material.level.charAt(0).toUpperCase() + material.level.slice(1)}
                </Badge>
              </div>
              <CardDescription className="text-xs md:text-sm mt-1">{material.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-4 md:px-6 pb-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                {material.duration && (
                  <Badge variant="outline" className="text-xs">Duração: {material.duration}</Badge>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm" 
                  onClick={() => window.open(material.url, '_blank')}
                >
                  Acessar Material
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
