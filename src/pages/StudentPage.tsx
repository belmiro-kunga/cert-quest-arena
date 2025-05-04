
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Star, Target, Book, Clock, Award, TrendingUp, Zap as Lightning, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Dados de exemplo
const studyProgress = [
  { date: '28/04', hours: 2, score: 75 },
  { date: '29/04', hours: 3, score: 82 },
  { date: '30/04', hours: 2.5, score: 78 },
  { date: '01/05', hours: 4, score: 85 },
  { date: '02/05', hours: 3.5, score: 88 },
  { date: '03/05', hours: 3, score: 90 },
];

const skillsData = [
  { subject: 'Cloud Computing', score: 80 },
  { subject: 'Security', score: 70 },
  { subject: 'Networking', score: 65 },
  { subject: 'DevOps', score: 75 },
  { subject: 'Containers', score: 85 },
];

const achievements = [
  {
    id: 1,
    title: 'Primeira Certificação',
    description: 'Complete sua primeira certificação',
    icon: Trophy,
    progress: 100,
    achieved: true,
    date: '01/05/2025',
  },
  {
    id: 2,
    title: 'Streak Master',
    description: '7 dias seguidos de estudo',
    icon: Lightning,
    progress: 85,
    achieved: false,
  },
  {
    id: 3,
    title: 'Expert em Cloud',
    description: 'Complete 5 certificações cloud',
    icon: Star,
    progress: 40,
    achieved: false,
  },
];

const upcomingExams = [
  {
    id: 1,
    title: 'AWS Cloud Practitioner',
    date: '10/05/2025',
    readiness: 85,
  },
  {
    id: 2,
    title: 'Azure Fundamentals',
    date: '15/05/2025',
    readiness: 72,
  },
];

const StudentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Cabeçalho do Perfil */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                JS
              </div>
              <div>
                <h1 className="text-3xl font-bold">João Silva</h1>
                <p className="text-muted-foreground">Nível 12 • Cloud Engineer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold">2,450</p>
              </div>
              <Button>Editar Perfil</Button>
            </div>
          </div>

          {/* Cards de Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Streak Atual
                </CardTitle>
                <Lightning className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6 dias</div>
                <p className="text-xs text-muted-foreground">
                  Melhor: 12 dias
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Certificações
                </CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 em andamento
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Simulados
                </CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">
                  Taxa de aprovação: 85%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Horas Estudadas
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64h</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="study">Área de Estudo</TabsTrigger>
              <TabsTrigger value="exams">Simulados</TabsTrigger>
              <TabsTrigger value="certificates">Certificações</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Gráfico de Progresso */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Progresso de Estudo</CardTitle>
                    <CardDescription>
                      Últimos 7 dias de atividade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={studyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#8884d8"
                          name="Pontuação"
                        />
                        <Line
                          type="monotone"
                          dataKey="hours"
                          stroke="#82ca9d"
                          name="Horas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Gráfico de Habilidades */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Mapa de Habilidades</CardTitle>
                    <CardDescription>
                      Domínio por área
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar
                          name="Habilidades"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Próximos Exames */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Próximos Exames</CardTitle>
                    <CardDescription>
                      Certificações agendadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="flex items-center p-4 border rounded-lg"
                        >
                          <Calendar className="h-8 w-8 text-blue-500 mr-4" />
                          <div className="flex-grow">
                            <h4 className="font-semibold">{exam.title}</h4>
                            <div className="flex items-center gap-4">
                              <p className="text-sm text-muted-foreground">
                                {exam.date}
                              </p>
                              <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                  <Progress value={exam.readiness} />
                                  <span className="text-sm font-medium">
                                    {exam.readiness}% pronto
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Conquistas Recentes */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Conquistas Recentes</CardTitle>
                    <CardDescription>
                      Últimas conquistas desbloqueadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {achievements.map((achievement) => {
                          const Icon = achievement.icon;
                          return (
                            <div
                              key={achievement.id}
                              className="flex items-center p-4 border rounded-lg"
                            >
                              <Icon className={`h-8 w-8 ${
                                achievement.achieved
                                  ? 'text-yellow-500'
                                  : 'text-gray-400'
                              } mr-4`} />
                              <div className="flex-grow">
                                <h4 className="font-semibold">
                                  {achievement.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {achievement.description}
                                </p>
                                {!achievement.achieved && (
                                  <Progress
                                    value={achievement.progress}
                                    className="mt-2"
                                  />
                                )}
                                {achievement.achieved && achievement.date && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Conquistado em {achievement.date}
                                  </p>
                                )}
                              </div>
                              {achievement.achieved && (
                                <Badge variant="success" className="ml-2">
                                  Concluído
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Outras abas serão implementadas posteriormente */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Conquistas</CardTitle>
                  <CardDescription>
                    Acompanhe seu progresso e desbloqueie recompensas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo será implementado posteriormente */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentPage;
