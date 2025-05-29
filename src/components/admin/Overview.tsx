
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getExams } from '@/services/examService';
import { getUsers } from '@/services/userService';
import { Exam, Student } from '@/types/admin';
import { User } from '@/types/user';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';

export const Overview: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const examData = await getExams();
      // Convert service exams to admin exams with proper typing
      const adminExams: Exam[] = examData.map(exam => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        difficulty: (exam.difficulty === 'easy' ? 'Fácil' : 
                    exam.difficulty === 'medium' ? 'Médio' : 'Difícil') as 'Fácil' | 'Médio' | 'Difícil',
        category: exam.category,
        is_gratis: exam.is_free || false,
        created_at: exam.created_at,
        updated_at: exam.updated_at
      }));
      setExams(adminExams);

      const userData = await getUsers();
      // Convert users to students
      const studentData: Student[] = userData.map((user: User) => ({
        id: user.id,
        name: user.email || 'Usuário',
        email: user.email,
        plan_type: user.subscription_type || 'free',
        attempts_left: 5,
        progress: 0,
        last_access: user.updated_at || new Date().toISOString(),
        created_at: user.created_at,
        updated_at: user.updated_at
      }));
      setStudents(studentData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const normalizeCategory = (category: string): string => {
    if (!category) return 'Geral';
    return category.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/^./, str => str.toUpperCase());
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      'aws': 'bg-orange-500',
      'azure': 'bg-blue-500',
      'gcp': 'bg-green-500',
      'cisco': 'bg-blue-600',
      'microsoft': 'bg-purple-500',
      'comptia': 'bg-red-500',
      'default': 'bg-gray-500'
    };
    
    const normalizedCategory = normalizeCategory(category).toLowerCase();
    return colors[normalizedCategory as keyof typeof colors] || colors.default;
  };

  const stats = [
    {
      title: 'Total de Usuários',
      value: students.length,
      icon: <Users className="h-4 w-4" />,
      description: 'Usuários registrados'
    },
    {
      title: 'Simulados Ativos',
      value: exams.length,
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Simulados disponíveis'
    },
    {
      title: 'Conquistas',
      value: 0,
      icon: <Trophy className="h-4 w-4" />,
      description: 'Conquistas configuradas'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 0',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Receita do mês atual'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'João Silva',
      action: 'Completou simulado AWS SAA',
      time: '2 horas atrás',
      type: 'completion'
    },
    {
      id: 2,
      user: 'Maria Santos',
      action: 'Registrou-se na plataforma',
      time: '4 horas atrás',
      type: 'registration'
    },
    {
      id: 3,
      user: 'Pedro Costa',
      action: 'Obteve conquista "Primeira Certificação"',
      time: '6 horas atrás',
      type: 'achievement'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={loadData}>
          <Activity className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Simulados Recentes */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Simulados Recentes</CardTitle>
            <CardDescription>
              Últimos simulados criados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(exam.category)}`} />
                    <div>
                      <p className="text-sm font-medium">{exam.title}</p>
                      <p className="text-xs text-muted-foreground">{exam.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={exam.difficulty === 'Fácil' ? 'default' : 
                                  exam.difficulty === 'Médio' ? 'secondary' : 'destructive'}>
                      {exam.difficulty}
                    </Badge>
                    {exam.is_gratis && (
                      <Badge variant="outline">Grátis</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'completion' ? 'bg-green-500' :
                    activity.type === 'registration' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
