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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: 'certification' | 'mastery' | 'streak' | 'special';
  earnedAt: Date;
}

interface AchievementStatsProps {
  achievements: Achievement[];
}

const COLORS = {
  bronze: '#ED8936',
  silver: '#A0AEC0',
  gold: '#ECC94B',
  platinum: '#9F7AEA'
};

const TYPE_COLORS = {
  certification: '#4299E1',
  mastery: '#48BB78',
  streak: '#F56565',
  special: '#9F7AEA'
};

export const AchievementStats: React.FC<AchievementStatsProps> = ({
  achievements
}) => {
  // Preparar dados para o gráfico de progresso ao longo do tempo
  const timelineData = React.useMemo(() => {
    const data: { date: string; total: number }[] = [];
    const sorted = [...achievements].sort((a, b) => 
      a.earnedAt.getTime() - b.earnedAt.getTime()
    );
    
    let total = 0;
    sorted.forEach(achievement => {
      total++;
      data.push({
        date: achievement.earnedAt.toLocaleDateString(),
        total
      });
    });
    
    return data;
  }, [achievements]);

  // Preparar dados para o gráfico de distribuição por nível
  const levelData = React.useMemo(() => {
    const counts: Record<string, number> = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    };
    
    achievements.forEach(achievement => {
      counts[achievement.level]++;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [achievements]);

  // Preparar dados para o gráfico de tipos de conquistas
  const typeData = React.useMemo(() => {
    const counts: Record<string, number> = {
      certification: 0,
      mastery: 0,
      streak: 0,
      special: 0
    };
    
    achievements.forEach(achievement => {
      counts[achievement.type]++;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [achievements]);

  return (
    <div className="space-y-6">
      {/* Gráfico de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso ao Longo do Tempo</CardTitle>
          <CardDescription>
            Total de conquistas acumuladas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4299E1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4299E1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4299E1"
                  fillOpacity={1}
                  fill="url(#progressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Nível */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível</CardTitle>
            <CardDescription>
              Conquistas por nível de dificuldade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {levelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Conquistas</CardTitle>
            <CardDescription>
              Distribuição por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {typeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={TYPE_COLORS[entry.name.toLowerCase() as keyof typeof TYPE_COLORS]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
