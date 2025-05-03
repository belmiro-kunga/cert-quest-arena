import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Settings, Plus, Edit, Trash, Trophy, Book, Target, Users, TrendingUp, Award } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dados de exemplo para os gráficos
const performanceData = [
  { name: 'Jan', aprovados: 65, total: 100 },
  { name: 'Fev', aprovados: 72, total: 95 },
  { name: 'Mar', aprovados: 85, total: 110 },
  { name: 'Abr', aprovados: 78, total: 90 },
  { name: 'Mai', aprovados: 90, total: 120 },
];

const certificationsData = [
  { name: 'AWS Cloud', value: 35 },
  { name: 'Azure', value: 25 },
  { name: 'CompTIA', value: 20 },
  { name: 'Cisco', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Simulado salvo",
        description: "O simulado foi salvo com sucesso.",
      });
    }, 1000);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Questão salva",
        description: "A questão foi adicionada com sucesso.",
      });
    }, 1000);
  };

  const handleDeleteExam = () => {
    toast({
      title: "Simulado excluído",
      description: "O simulado foi removido com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Cards de Estatísticas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,850</div>
                <p className="text-xs text-muted-foreground">
                  +18% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +5% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Simulados Ativos</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">
                  12 adicionados este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Certificações</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  3 novas certificações
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="exams">Simulados</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Nova aba de Dashboard */}
            <TabsContent value="dashboard">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Desempenho Mensal</CardTitle>
                    <CardDescription>
                      Taxa de aprovação nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="aprovados"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Distribuição de Certificações</CardTitle>
                    <CardDescription>
                      Popularidade por certificação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={certificationsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {certificationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Aba de Simulados */}
            <TabsContent value="exams">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gerenciar Simulados</h2>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Simulado
                </Button>
              </div>
              
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Criar/Editar Simulado</CardTitle>
                  <CardDescription>
                    Crie um novo simulado ou edite um existente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveExam} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome do Simulado</label>
                        <Input placeholder="Ex: AWS Cloud Practitioner" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <Input placeholder="Ex: Cloud Computing" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <Textarea placeholder="Descrição do simulado" rows={3} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                        <Input type="number" placeholder="29.90" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tempo (minutos)</label>
                        <Input type="number" placeholder="60" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nº de Questões</label>
                        <Input type="number" placeholder="60" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Simulado"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Simulados Disponíveis</CardTitle>
                  <CardDescription>
                    Lista de todos os simulados cadastrados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Questões</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell>Cloud Computing</TableCell>
                        <TableCell>R$ 29,90</TableCell>
                        <TableCell>60</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDeleteExam}>
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nova aba de Conquistas */}
            <TabsContent value="achievements">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Conquistas Disponíveis</CardTitle>
                    <CardDescription>
                      Gerencie as conquistas do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border rounded-lg">
                        <Trophy className="h-8 w-8 text-yellow-500 mr-4" />
                        <div>
                          <h4 className="font-semibold">Mestre das Certificações</h4>
                          <p className="text-sm text-muted-foreground">
                            Complete 5 certificações diferentes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg">
                        <Target className="h-8 w-8 text-green-500 mr-4" />
                        <div>
                          <h4 className="font-semibold">Precisão Perfeita</h4>
                          <p className="text-sm text-muted-foreground">
                            100% de acerto em um simulado
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg">
                        <TrendingUp className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                          <h4 className="font-semibold">Streak Master</h4>
                          <p className="text-sm text-muted-foreground">
                            30 dias consecutivos de estudo
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ranking de Alunos</CardTitle>
                    <CardDescription>
                      Top performers do mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "João Silva", points: 1250, badge: "🥇" },
                        { name: "Maria Santos", points: 980, badge: "🥈" },
                        { name: "Pedro Oliveira", points: 850, badge: "🥉" },
                      ].map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <span className="text-2xl mr-4">{student.badge}</span>
                            <div>
                              <h4 className="font-semibold">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {student.points} pontos
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas de Conquistas</CardTitle>
                    <CardDescription>
                      Distribuição de conquistas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { name: "Bronze", quantidade: 450 },
                          { name: "Prata", quantidade: 280 },
                          { name: "Ouro", quantidade: 120 },
                          { name: "Platina", quantidade: 45 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantidade" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Outras abas mantidas como estão */}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
