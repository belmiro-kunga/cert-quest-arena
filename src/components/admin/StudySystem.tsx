import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Book, Target } from 'lucide-react';
import { Flashcards } from './Flashcards';

export const StudySystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flashcards');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Estudos</CardTitle>
          <CardDescription>
            Gerencie flashcards, materiais de estudo e objetivos de aprendizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Materiais</span>
              </TabsTrigger>
              <TabsTrigger value="objectives" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Objetivos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards" className="mt-6">
              <Flashcards />
            </TabsContent>

            <TabsContent value="materials" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Materiais de Estudo</CardTitle>
                  <CardDescription>
                    Em breve: Gerencie materiais complementares para estudo
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="objectives" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos de Aprendizado</CardTitle>
                  <CardDescription>
                    Em breve: Defina e acompanhe objetivos de aprendizado
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
