import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFlashcardProgress } from '@/lib/hooks/useFlashcardProgress';

export const FlashcardProgress: React.FC = () => {
  const { stats, isLoading } = useFlashcardProgress();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso</CardTitle>
          <CardDescription>Carregando estatísticas...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso</CardTitle>
          <CardDescription>Comece a revisar para ver suas estatísticas!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);
  const graduatedPercentage = total > 0 ? (stats.statusCounts.graduated / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Progresso</CardTitle>
        <CardDescription>
          {total} flashcards no total • {stats.totalReviews} revisões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso Geral</span>
              <span>{Math.round(graduatedPercentage)}% concluído</span>
            </div>
            <Progress value={graduatedPercentage} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status dos Cartões</p>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-blue-600">Novos</span>
                  <span>{stats.statusCounts.new}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-600">Aprendendo</span>
                  <span>{stats.statusCounts.learning}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-yellow-600">Revisão</span>
                  <span>{stats.statusCounts.review}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-green-600">Graduados</span>
                  <span>{stats.statusCounts.graduated}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Desempenho</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Qualidade Média</span>
                  <span>{stats.averageQuality.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Revisões</span>
                  <span>{stats.totalReviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
