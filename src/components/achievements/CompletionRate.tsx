import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CheckCircle2, Circle, Clock, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: 'certification' | 'mastery' | 'streak' | 'special';
  earnedAt: Date;
}

interface Objective {
  type: 'certification' | 'mastery' | 'streak' | 'special';
  total: number;
  completed: number;
}

interface CompletionRateProps {
  achievements: Achievement[];
}

export const CompletionRate: React.FC<CompletionRateProps> = ({
  achievements
}) => {
  // Objetivos por tipo (simulados para exemplo)
  const objectives: Objective[] = [
    { type: 'certification', total: 10, completed: achievements.filter(a => a.type === 'certification').length },
    { type: 'mastery', total: 8, completed: achievements.filter(a => a.type === 'mastery').length },
    { type: 'streak', total: 5, completed: achievements.filter(a => a.type === 'streak').length },
    { type: 'special', total: 6, completed: achievements.filter(a => a.type === 'special').length }
  ];

  // Calcular taxa de conclusão geral
  const totalObjectives = objectives.reduce((sum, obj) => sum + obj.total, 0);
  const totalCompleted = objectives.reduce((sum, obj) => sum + obj.completed, 0);
  const overallCompletionRate = (totalCompleted / totalObjectives) * 100;

  // Preparar dados para o gráfico de progresso por tipo
  const progressData = objectives.map(obj => ({
    tipo: obj.type.charAt(0).toUpperCase() + obj.type.slice(1),
    concluído: obj.completed,
    total: obj.total,
    taxa: Math.round((obj.completed / obj.total) * 100)
  }));

  // Calcular tendência de conclusão
  const completionTrend = achievements.reduce((acc, achievement) => {
    const month = achievement.earnedAt.toLocaleDateString('pt-BR', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(completionTrend).map(([month, count]) => ({
    mês: month,
    conquistas: count,
    metasMensais: Math.round(totalObjectives / 12) // Meta mensal aproximada
  }));

  return (
    <div className="space-y-6">
      {/* Taxa de Conclusão Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Taxa de Conclusão Geral</CardTitle>
              <CardDescription>Progresso total em todas as áreas</CardDescription>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{Math.round(overallCompletionRate)}%</span>
              <span className="text-sm text-muted-foreground">
                {totalCompleted} de {totalObjectives} objetivos
              </span>
            </div>
            <Progress value={overallCompletionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Tipo */}
      <div className="grid gap-4 md:grid-cols-2">
        {objectives.map((obj) => {
          const rate = (obj.completed / obj.total) * 100;
          return (
            <Card key={obj.type}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
                    </p>
                    <span className="text-2xl font-bold">
                      {Math.round(rate)}%
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {rate === 100 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </div>
                <Progress value={rate} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {obj.completed} de {obj.total} concluídos
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráfico de Progresso Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Área</CardTitle>
          <CardDescription>
            Comparação entre objetivos concluídos e totais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#E2E8F0" name="Total" yAxisId="left" />
                <Bar dataKey="concluído" fill="#4299E1" name="Concluído" yAxisId="left" />
                <Line
                  type="monotone"
                  dataKey="taxa"
                  stroke="#48BB78"
                  name="Taxa (%)"
                  yAxisId="right"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Conclusão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tendência de Conclusão</CardTitle>
              <CardDescription>
                Conquistas mensais vs. metas
              </CardDescription>
            </div>
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mês" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar dataKey="conquistas" fill="#4299E1" name="Conquistas" yAxisId="left" />
                <Line
                  type="monotone"
                  dataKey="metasMensais"
                  stroke="#F56565"
                  name="Meta Mensal"
                  strokeWidth={2}
                  dot={false}
                  yAxisId="right"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
