import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Trophy, Zap, Target, Clock, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: 'certification' | 'mastery' | 'streak' | 'special';
  earnedAt: Date;
}

interface AchievementMetricsProps {
  achievements: Achievement[];
}

export const AchievementMetrics: React.FC<AchievementMetricsProps> = ({
  achievements
}) => {
  // Calcular velocidade de progresso (conquistas por mês)
  const progressRate = React.useMemo(() => {
    if (achievements.length < 2) return [];
    
    const monthlyProgress: Record<string, number> = {};
    achievements.forEach(achievement => {
      const monthYear = achievement.earnedAt.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      });
      monthlyProgress[monthYear] = (monthlyProgress[monthYear] || 0) + 1;
    });

    return Object.entries(monthlyProgress).map(([date, count]) => ({
      date,
      conquistas: count
    }));
  }, [achievements]);

  // Calcular pontuação por área
  const areaScores = React.useMemo(() => {
    const scores = {
      certificacoes: 0,
      maestria: 0,
      sequencias: 0,
      especiais: 0,
      total: achievements.length
    };

    achievements.forEach(achievement => {
      switch (achievement.type) {
        case 'certification':
          scores.certificacoes++;
          break;
        case 'mastery':
          scores.maestria++;
          break;
        case 'streak':
          scores.sequencias++;
          break;
        case 'special':
          scores.especiais++;
          break;
      }
    });

    return [
      { area: 'Certificações', valor: (scores.certificacoes / scores.total) * 100 },
      { area: 'Maestria', valor: (scores.maestria / scores.total) * 100 },
      { area: 'Sequências', valor: (scores.sequencias / scores.total) * 100 },
      { area: 'Especiais', valor: (scores.especiais / scores.total) * 100 }
    ];
  }, [achievements]);

  // Calcular estatísticas gerais
  const stats = React.useMemo(() => {
    const now = new Date();
    const firstAchievement = new Date(Math.min(...achievements.map(a => a.earnedAt.getTime())));
    const daysSinceFirst = Math.floor((now.getTime() - firstAchievement.getTime()) / (1000 * 60 * 60 * 24));
    const achievementsPerDay = achievements.length / (daysSinceFirst || 1);

    const levelPoints = {
      bronze: 1,
      silver: 2,
      gold: 3,
      platinum: 4
    };

    const totalPoints = achievements.reduce((sum, achievement) => 
      sum + levelPoints[achievement.level], 0);

    return {
      totalAchievements: achievements.length,
      achievementsPerDay: achievementsPerDay.toFixed(2),
      totalPoints,
      averageLevel: (totalPoints / achievements.length).toFixed(2),
      daysActive: daysSinceFirst
    };
  }, [achievements]);

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Trophy className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Conquistas
                </p>
                <h3 className="text-2xl font-bold">{stats.totalAchievements}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Conquistas por Dia
                </p>
                <h3 className="text-2xl font-bold">{stats.achievementsPerDay}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nível Médio
                </p>
                <h3 className="text-2xl font-bold">{stats.averageLevel}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dias Ativos
                </p>
                <h3 className="text-2xl font-bold">{stats.daysActive}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Velocidade de Progresso */}
        <Card>
          <CardHeader>
            <CardTitle>Velocidade de Progresso</CardTitle>
            <CardDescription>
              Conquistas obtidas por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="conquistas"
                    stroke="#4299E1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar de Habilidades */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Conquistas</CardTitle>
            <CardDescription>
              Porcentagem por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={areaScores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Área"
                    dataKey="valor"
                    stroke="#4299E1"
                    fill="#4299E1"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
