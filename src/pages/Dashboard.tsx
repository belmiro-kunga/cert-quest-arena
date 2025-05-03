import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Settings, Trophy, Star, Target, BookOpen, Clock, Award, TrendingUp, Zap, Calendar } from 'lucide-react';
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

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Simulando dados do usuário
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuário", "email": "user@example.com"}');
  
  // Dados de estatísticas simulados
  const stats = {
    simuladosRealizados: 5,
    questoesRespondidas: 50,
    taxaAcerto: 68,
    tentativasRestantes: 1,
    streak: 6,
    melhorStreak: 12,
    xpTotal: 2450,
    nivel: 12
  };
  
  // Dados de progresso simulados
  const progressData = [
    { date: '28/04', score: 75, hours: 2 },
    { date: '29/04', score: 82, hours: 3 },
    { date: '30/04', score: 78, hours: 2.5 },
    { date: '01/05', score: 85, hours: 4 },
    { date: '02/05', score: 88, hours: 3.5 },
    { date: '03/05', score: 90, hours: 3 },
  ];

  // Dados de habilidades simulados
  const skillsData = [
    { subject: 'Cloud Computing', score: 80 },
    { subject: 'Security', score: 70 },
    { subject: 'Networking', score: 65 },
    { subject: 'DevOps', score: 75 },
    { subject: 'Containers', score: 85 },
  ];

  // Dados de conquistas simulados
  const achievements = [
    {
      id: 1,
      title: 'Primeira Certificação',
      description: 'Complete sua primeira certificação',
      icon: Trophy,
      achieved: true,
      date: '01/05/2025',
    },
    {
      id: 2,
      title: 'Streak Master',
      description: '7 dias seguidos de estudo',
      icon: Zap,
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

  // Dados de recomendação simulados
  const recommendations = [
    { 
      id: 'aws-cloud-practitioner', 
      name: 'AWS Cloud Practitioner', 
      progress: 70,
      date: '10/05/2025',
      readiness: 85
    },
    { 
      id: 'azure-fundamentals', 
      name: 'Microsoft Azure Fundamentals', 
      progress: 45,
      date: '15/05/2025',
      readiness: 72
    },
    { 
      id: 'comptia-a-plus', 
      name: 'CompTIA A+', 
      progress: 65,
      date: '20/05/2025',
      readiness: 68
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          {/* Cabeçalho do Perfil */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Nível {stats.nivel}</Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{stats.xpTotal} XP</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                PLANO FREEMIUM
              </Badge>
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <User size={16} />
                Meu Perfil
              </Button>
              <Button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90"
                size="sm"
              >
                Atualizar para Premium
              </Button>
            </div>
          </div>
          
          {/* Cards de Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Streak Atual</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.streak} dias</div>
                <p className="text-xs text-muted-foreground">
                  Melhor: {stats.melhorStreak} dias
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.taxaAcerto}%</div>
                <Progress value={stats.taxaAcerto} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Simulados</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.simuladosRealizados}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.questoesRespondidas} questões respondidas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tentativas</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tentativasRestantes}</div>
                <p className="text-xs text-muted-foreground">
                  Restantes nesta semana
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
            {/* Gráfico de Progresso */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Progresso de Estudo</CardTitle>
                <CardDescription>
                  Últimos 7 dias de atividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
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

            {/* Mapa de Habilidades */}
            <Card className="lg:col-span-3">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Próximas Certificações */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Certificações</CardTitle>
                <CardDescription>
                  Certificações em andamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center p-4 border rounded-lg"
                    >
                      <Calendar className="h-8 w-8 text-blue-500 mr-4" />
                      <div className="flex-grow">
                        <h4 className="font-semibold">{cert.name}</h4>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-muted-foreground">
                            {cert.date}
                          </p>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <Progress value={cert.readiness} />
                              <span className="text-sm font-medium">
                                {cert.readiness}% pronto
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/exam/${cert.id}`)}>
                        Estudar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conquistas */}
            <Card>
              <CardHeader>
                <CardTitle>Conquistas</CardTitle>
                <CardDescription>
                  Seu progresso e recompensas
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          {!achievement.achieved && achievement.progress && (
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
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/achievements')}
                >
                  Ver Todas as Conquistas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
