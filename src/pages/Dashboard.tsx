
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Settings } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Simulando dados do usuário
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuário", "email": "user@example.com"}');
  
  // Dados de estatísticas simulados
  const stats = {
    simuladosRealizados: 5,
    questoesRespondidas: 50,
    taxaAcerto: 68,
    tentativasRestantes: 1
  };
  
  // Dados de atividades recentes simulados
  const recentActivities = [
    { id: 1, cert: 'AWS Cloud Practitioner', date: '25/04/2025', score: 70 },
    { id: 2, cert: 'CompTIA A+', date: '20/04/2025', score: 65 },
    { id: 3, cert: 'AWS Cloud Practitioner', date: '18/04/2025', score: 60 }
  ];
  
  // Dados de recomendação simulados
  const recommendations = [
    { id: 'aws-cloud-practitioner', name: 'AWS Cloud Practitioner', progress: 70 },
    { id: 'azure-fundamentals', name: 'Microsoft Azure Fundamentals', progress: 0 },
    { id: 'comptia-a-plus', name: 'CompTIA A+', progress: 65 }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="text-sm freemium-badge text-white px-3 py-1 rounded-full">
                PLANO FREEMIUM
              </span>
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
                className="bg-cert-purple hover:bg-cert-purple/90"
                size="sm"
              >
                Atualizar para Premium
              </Button>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.simuladosRealizados}</div>
                <p className="text-sm text-gray-500">Simulados realizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.questoesRespondidas}</div>
                <p className="text-sm text-gray-500">Questões respondidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.taxaAcerto}%</div>
                <p className="text-sm text-gray-500">Taxa de acerto</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.tentativasRestantes}</div>
                <p className="text-sm text-gray-500">Tentativas restantes nesta semana</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Simulados Recomendados */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Simulados Recomendados</CardTitle>
                <CardDescription>
                  Continue sua preparação com estes simulados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map(rec => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{rec.name}</h3>
                        <Button 
                          onClick={() => navigate(`/exams/${rec.id}`)}
                          size="sm"
                        >
                          Iniciar
                        </Button>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cert-blue"
                          style={{ width: `${rec.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Progresso</span>
                        <span>{rec.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/certifications')}
                  className="w-full"
                >
                  Ver todas as certificações
                </Button>
              </CardFooter>
            </Card>
            
            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Seus últimos simulados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <span className="font-medium">{activity.score}%</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{activity.cert}</h4>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-500 w-full text-center">
                  Você utilizou 2 de 3 tentativas gratuitas esta semana
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 bg-cert-gray rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Aumente seu potencial com o plano Premium</h3>
            <p className="text-gray-600 mb-4">
              Acesse simulados completos com 60 perguntas, feedback detalhado e tentativas ilimitadas.
            </p>
            <Button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-cert-purple hover:bg-cert-purple/90"
            >
              Upgrade para Premium
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
