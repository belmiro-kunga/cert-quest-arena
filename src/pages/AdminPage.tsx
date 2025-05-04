// React e Hooks
import React from 'react';
import { useAdminPage } from '@/hooks/useAdminPage';

// Componentes de Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Componentes UI Base
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from "@/components/ui/separator";

// Ícones
import { Settings, Plus, Edit, Trash, Trophy, Book, Target, Users, TrendingUp, Award, Coins, Sword, Star, Calendar, Gift, Gamepad } from 'lucide-react';

// Componentes de Gráficos
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

// Componentes de Estudo
import { FlashCard } from '@/components/study/FlashCard';
import { StudyMaterials } from '@/components/study/StudyMaterials';

// Componentes de Conquistas
import { AchievementBadge } from '@/components/achievements/AchievementBadge';
import { AchievementHistory } from '@/components/achievements/AchievementHistory';
import { AchievementStats } from '@/components/achievements/AchievementStats';
import { AchievementMetrics } from '@/components/achievements/AchievementMetrics';
import { CompletionRate } from '@/components/achievements/CompletionRate';

// Componentes Admin
import { Overview } from '@/components/admin/Overview';
import { Students } from '@/components/admin/Students';
import { Exams } from '@/components/admin/Exams';
import { Coupons } from '@/components/admin/Coupons';

// Tipos
import { Student, Exam, AchievementType, Coupon } from '@/types/admin';

// Constantes
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const ACHIEVEMENT_TYPES: Record<string, AchievementType> = {
  CERTIFICATION: 'certification',
  STREAK: 'streak',
  MASTERY: 'mastery',
  SPECIAL: 'special'
};

const MOCK_DATA = {
  performance: [
    { name: 'Jan', aprovados: 65, total: 100 },
    { name: 'Fev', aprovados: 59, total: 80 },
    { name: 'Mar', aprovados: 80, total: 100 },
    { name: 'Abr', aprovados: 81, total: 90 },
    { name: 'Mai', aprovados: 56, total: 70 }
  ],
  achievements: [
    { name: 'AWS', value: 400 },
    { name: 'Azure', value: 300 },
    { name: 'GCP', value: 200 },
    { name: 'DevOps', value: 100 }
  ],
  students: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      progress: 75,
      achievements: 12,
      lastActive: '2025-05-03'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      progress: 90,
      achievements: 15,
      lastActive: '2025-05-03'
    }
  ],
  exams: [
    {
      id: '1',
      title: 'AWS Solutions Architect Associate',
      description: 'Complete practice exam with detailed explanations',
      price: 29.99,
      discountPrice: 19.99,
      discountPercentage: 33,
      discountExpiresAt: new Date('2025-06-01')
    },
    {
      id: '2',
      title: 'Azure Administrator AZ-104',
      description: 'Full practice exam with performance analytics',
      price: 24.99,
      discountPrice: 19.99,
      discountPercentage: 20,
      discountExpiresAt: new Date('2025-05-15')
    },
    {
      id: '3',
      title: 'Google Cloud Associate Engineer',
      description: 'Practice exam with domain-based scoring',
      price: 24.99,
      discountPrice: null,
      discountPercentage: null,
      discountExpiresAt: null
    }
  ],
  coupons: [
    {
      id: '1',
      code: 'WELCOME25',
      description: '25% off for new users',
      type: 'percentage',
      value: 25,
      maxDiscount: 20,
      minPurchase: 19.99,
      validFrom: new Date('2025-05-01'),
      validUntil: new Date('2025-06-01'),
      maxUses: 1000,
      currentUses: 450,
      isActive: true
    },
    {
      id: '2',
      code: 'AWS50OFF',
      description: '50% off AWS exams',
      type: 'percentage',
      value: 50,
      maxDiscount: 30,
      minPurchase: 24.99,
      validFrom: new Date('2025-05-01'),
      validUntil: new Date('2025-05-15'),
      maxUses: 500,
      currentUses: 320,
      isActive: true
    },
    {
      id: '3',
      code: 'FIXED10',
      description: '$10 off any exam',
      type: 'fixed',
      value: 10,
      maxDiscount: null,
      minPurchase: 19.99,
      validFrom: new Date('2025-05-01'),
      validUntil: new Date('2025-12-31'),
      maxUses: 2000,
      currentUses: 845,
      isActive: true
    }
  ]
};

// Dados Mockados
const performanceData = MOCK_DATA.performance;
const certificationsData = MOCK_DATA.achievements;

const mockExams: Exam[] = MOCK_DATA.exams.map(exam => ({
  ...exam,
  questions: [],
  questionsCount: 65,
  duration: 120,
  difficulty: 'Médio' as 'Fácil' | 'Médio' | 'Difícil',
  purchases: 250,
  rating: 4.7,
  passingScore: 70
}));

const mockCoupons: Coupon[] = MOCK_DATA.coupons.map(coupon => ({
  ...coupon,
  discountType: coupon.type as 'percentage' | 'fixed',
  discountValue: coupon.value,
  usageLimit: coupon.maxUses,
  usageCount: coupon.currentUses,
  validFrom: coupon.validFrom.toISOString(),
  validUntil: coupon.validUntil.toISOString(),
  minPurchaseAmount: coupon.minPurchase,
  maxDiscountAmount: coupon.maxDiscount,
  active: coupon.isActive
}));

const AdminPage: React.FC = () => {
  const {
    state: { activeTab },
    actions: {
      handleTabChange,
      handleStudentSelect,
      handleExamSelect,
      handleExamDelete,
      handleCouponSelect,
      handleCouponDelete
    }
  } = useAdminPage();

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    // toast({
    //   title: "Simulado salvo",
    //   description: "O simulado foi salvo com sucesso.",
    // });
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    // toast({
    //   title: "Questão salva",
    //   description: "A questão foi adicionada com sucesso.",
    // });
  };

  const handleDeleteExam = () => {
    // toast({
    //   title: "Simulado excluído",
    //   description: "O simulado foi removido com sucesso.",
    //   variant: "destructive",
    // });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="students">Alunos</TabsTrigger>
              <TabsTrigger value="exams">Simulados</TabsTrigger>
              <TabsTrigger value="coupons">Cupons</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="study">Sistema de Estudos</TabsTrigger>
              <TabsTrigger value="gamification">Gamificação</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Overview
                performanceData={MOCK_DATA.performance}
                certificationsData={MOCK_DATA.achievements}
                colors={COLORS}
              />
            </TabsContent>

            <TabsContent value="students">
              <Students
                students={MOCK_DATA.students}
                onSelect={handleStudentSelect}
              />
            </TabsContent>

            {/* Aba de Simulados */}
            <TabsContent value="exams">
              <Exams
                exams={mockExams}
                onSelect={handleExamSelect}
                onDelete={handleExamDelete}
              />
            </TabsContent>

            <TabsContent value="coupons">
              <Coupons
                coupons={mockCoupons}
                onSelect={handleCouponSelect}
                onDelete={handleCouponDelete}
              />
            </TabsContent>

            {/* Nova aba de Sistema de Estudos */}
            <TabsContent value="study">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciar Flashcards</CardTitle>
                    <CardDescription>
                      Crie e edite flashcards para revisão com sistema de repetição espaçada
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Frente do Cartão</label>
                          <Textarea placeholder="Digite a pergunta ou conceito" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Verso do Cartão</label>
                          <Textarea placeholder="Digite a resposta ou explicação" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Dificuldade</label>
                        <select className="w-full p-2 border rounded">
                          <option value="easy">Fácil</option>
                          <option value="medium">Médio</option>
                          <option value="hard">Difícil</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Próxima Revisão</label>
                        <Input type="date" />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Adicionar Flashcard</Button>
                      </div>
                    </form>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FlashCard
                        front="O que é Cloud Computing?"
                        back="Entrega de recursos computacionais sob demanda através da internet"
                        difficulty="medium"
                        nextReview={new Date('2024-05-10')}
                      />
                      <FlashCard
                        front="O que é um Container?"
                        back="Unidade padronizada de software que empacota código e dependências"
                        difficulty="hard"
                        nextReview={new Date('2024-05-08')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Materiais Complementares</CardTitle>
                    <CardDescription>
                      Gerencie recursos adicionais de estudo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4 mb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Título</label>
                          <Input placeholder="Nome do material" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tipo</label>
                          <select className="w-full p-2 border rounded">
                            <option value="article">Artigo</option>
                            <option value="video">Vídeo</option>
                            <option value="document">Documento</option>
                            <option value="link">Link</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <Textarea placeholder="Breve descrição do material" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <Input placeholder="https://" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Duração</label>
                          <Input placeholder="Ex: 15 min" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Nível</label>
                          <select className="w-full p-2 border rounded">
                            <option value="beginner">Iniciante</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="advanced">Avançado</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Adicionar Material</Button>
                      </div>
                    </form>

                    <StudyMaterials
                      materials={[
                        {
                          id: '1',
                          title: 'Introdução ao Cloud Computing',
                          type: 'video',
                          description: 'Visão geral sobre computação em nuvem',
                          url: 'https://example.com/video1',
                          duration: '15 min',
                          level: 'beginner'
                        },
                        {
                          id: '2',
                          title: 'Containers e Docker',
                          type: 'article',
                          description: 'Guia completo sobre containerização',
                          url: 'https://example.com/article1',
                          duration: '10 min',
                          level: 'intermediate'
                        }
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nova aba de Gamificação */}
            <TabsContent value="gamification">
              <div className="grid gap-4">
                {/* Sistema de Moeda Virtual */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Sistema de Moeda Virtual</CardTitle>
                        <CardDescription>
                          Configure recompensas e sistema de descontos em simulados
                        </CardDescription>
                      </div>
                      <Coins className="h-6 w-6 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Sistema de Descontos */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Sistema de Descontos</h3>
                        <div className="bg-secondary/10 p-4 rounded-lg mb-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            Configure quantas moedas são necessárias para obter descontos em simulados.
                            O desconto máximo é limitado ao preço do simulado.
                          </p>
                        </div>
                        <form className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Moedas Necessárias</label>
                              <Input type="number" placeholder="500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Desconto (%)</label>
                              <Input type="number" placeholder="10" min="0" max="100" />
                            </div>
                            <div className="flex items-end">
                              <Button className="w-full">Adicionar Desconto</Button>
                            </div>
                          </div>
                        </form>

                        <div className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Moedas</TableHead>
                                <TableHead>Desconto</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>500</TableCell>
                                <TableCell>10%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>1000</TableCell>
                                <TableCell>25%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2000</TableCell>
                                <TableCell>50%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>3000</TableCell>
                                <TableCell>100%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <Separator />

                      {/* Ações e Recompensas */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Ações e Recompensas</h3>
                        <form className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Ação</label>
                              <Input placeholder="Ex: Completar simulado" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Moedas</label>
                              <Input type="number" placeholder="100" />
                            </div>
                          </div>
                          <Button>Adicionar Recompensa</Button>
                        </form>

                        <div className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ação</TableHead>
                                <TableHead>Moedas</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Completar simulado</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Acertar questão difícil</TableCell>
                                <TableCell>50</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Torneios */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Torneios e Competições</CardTitle>
                        <CardDescription>
                          Crie e gerencie torneios entre alunos
                        </CardDescription>
                      </div>
                      <Trophy className="h-6 w-6 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome do Torneio</label>
                          <Input placeholder="Ex: Desafio AWS" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tipo</label>
                          <select className="w-full p-2 border rounded">
                            <option value="individual">Individual</option>
                            <option value="team">Equipe</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Data Início</label>
                          <Input type="date" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Data Fim</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Prêmio (moedas)</label>
                        <Input type="number" placeholder="1000" />
                      </div>
                      <Button>Criar Torneio</Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Níveis e Missões */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Níveis de Dificuldade */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Níveis de Dificuldade</CardTitle>
                          <CardDescription>
                            Configure a progressão dos alunos
                          </CardDescription>
                        </div>
                        <Star className="h-6 w-6 text-yellow-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome do Nível</label>
                          <Input placeholder="Ex: Cloud Master" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">XP Necessário</label>
                          <Input type="number" placeholder="5000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Benefícios</label>
                          <Textarea placeholder="Descreva os benefícios deste nível" />
                        </div>
                        <Button>Adicionar Nível</Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Missões */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Missões</CardTitle>
                          <CardDescription>
                            Crie missões diárias e semanais
                          </CardDescription>
                        </div>
                        <Target className="h-6 w-6 text-yellow-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Título da Missão</label>
                          <Input placeholder="Ex: Maratona de Estudos" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tipo</label>
                          <select className="w-full p-2 border rounded">
                            <option value="daily">Diária</option>
                            <option value="weekly">Semanal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Objetivo</label>
                          <Input placeholder="Ex: Complete 5 simulados" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Recompensa (moedas)</label>
                          <Input type="number" placeholder="200" />
                        </div>
                        <Button>Criar Missão</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Nova aba de Conquistas */}
            <TabsContent value="achievements">
              <div className="space-y-6">
                {/* Criar Nova Conquista */}
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Conquista</CardTitle>
                    <CardDescription>
                      Configure conquistas e emblemas para diferentes certificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Título</label>
                          <Input placeholder="Ex: Mestre AWS" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tipo</label>
                          <select className="w-full p-2 border rounded">
                            <option value={ACHIEVEMENT_TYPES.CERTIFICATION}>Certificação</option>
                            <option value={ACHIEVEMENT_TYPES.MASTERY}>Maestria</option>
                            <option value={ACHIEVEMENT_TYPES.STREAK}>Sequência</option>
                            <option value={ACHIEVEMENT_TYPES.SPECIAL}>Especial</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <Textarea placeholder="Descreva os requisitos para conquistar este emblema" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nível</label>
                          <select className="w-full p-2 border rounded">
                            <option value="bronze">Bronze</option>
                            <option value="silver">Prata</option>
                            <option value="gold">Ouro</option>
                            <option value="platinum">Platina</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Ícone</label>
                          <select className="w-full p-2 border rounded">
                            <option value="trophy">Troféu</option>
                            <option value="star">Estrela</option>
                            <option value="target">Alvo</option>
                            <option value="award">Prêmio</option>
                            <option value="crown">Coroa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Certificação</label>
                          <select className="w-full p-2 border rounded">
                            <option value="aws">AWS</option>
                            <option value="azure">Azure</option>
                            <option value="gcp">GCP</option>
                            <option value="all">Todas</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Requisitos</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input placeholder="Ex: Complete 5 simulados" />
                            <Button variant="outline" size="icon">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>Criar Conquista</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Histórico de Conquistas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Conquistas</CardTitle>
                    <CardDescription>
                      Visualize o histórico de conquistas por aluno
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Seletor de Aluno */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">Aluno</label>
                          <select className="w-full p-2 border rounded">
                            <option value="1">João Silva</option>
                            <option value="2">Maria Santos</option>
                            <option value="3">Pedro Oliveira</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Período</label>
                          <select className="w-full p-2 border rounded">
                            <option value="all">Todo o período</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="90">��ltimos 90 dias</option>
                            <option value="365">Último ano</option>
                          </select>
                        </div>
                      </div>

                      {/* Taxa de Conclusão */}
                      <CompletionRate
                        achievements={[
                          {
                            id: "1",
                            title: "AWS Cloud Practitioner",
                            description: "Certificação inicial AWS conquistada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-05-01")
                          },
                          {
                            id: "2",
                            title: "Estudante Dedicado",
                            description: "30 dias consecutivos de estudo",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-04-15")
                          },
                          {
                            id: "3",
                            title: "Azure Administrator",
                            description: "Certificação Azure conquistada",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-04-01")
                          },
                          {
                            id: "4",
                            title: "Mentor Iniciante",
                            description: "Ajudou 10 alunos em sua jornada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.SPECIAL,
                            earnedAt: new Date("2025-03-20")
                          },
                          {
                            id: "5",
                            title: "GCP Associate",
                            description: "Certificação Google Cloud conquistada",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-03-01")
                          },
                          {
                            id: "6",
                            title: "Expert em Segurança",
                            description: "Domínio em práticas de segurança",
                            level: "platinum",
                            type: ACHIEVEMENT_TYPES.MASTERY,
                            earnedAt: new Date("2025-02-15")
                          },
                          {
                            id: "7",
                            title: "DevOps Master",
                            description: "Especialista em práticas DevOps",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.MASTERY,
                            earnedAt: new Date("2025-02-01")
                          },
                          {
                            id: "8",
                            title: "Streak 60 Dias",
                            description: "60 dias consecutivos de estudo",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-01-15")
                          }
                        ]}
                      />

                      {/* Métricas Detalhadas */}
                      <AchievementMetrics
                        achievements={[
                          {
                            id: "1",
                            title: "AWS Cloud Practitioner",
                            description: "Certificação inicial AWS conquistada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-05-01")
                          },
                          {
                            id: "2",
                            title: "Estudante Dedicado",
                            description: "30 dias consecutivos de estudo",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-04-15")
                          },
                          {
                            id: "3",
                            title: "Azure Administrator",
                            description: "Certificação Azure conquistada",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-04-01")
                          },
                          {
                            id: "4",
                            title: "Mentor Iniciante",
                            description: "Ajudou 10 alunos em sua jornada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.SPECIAL,
                            earnedAt: new Date("2025-03-20")
                          },
                          {
                            id: "5",
                            title: "GCP Associate",
                            description: "Certificação Google Cloud conquistada",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-03-01")
                          },
                          {
                            id: "6",
                            title: "Expert em Segurança",
                            description: "Domínio em práticas de segurança",
                            level: "platinum",
                            type: ACHIEVEMENT_TYPES.MASTERY,
                            earnedAt: new Date("2025-02-15")
                          },
                          {
                            id: "7",
                            title: "DevOps Master",
                            description: "Especialista em práticas DevOps",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.MASTERY,
                            earnedAt: new Date("2025-02-01")
                          },
                          {
                            id: "8",
                            title: "Streak 60 Dias",
                            description: "60 dias consecutivos de estudo",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-01-15")
                          }
                        ]}
                      />

                      {/* Estatísticas e Gráficos */}
                      <AchievementStats
                        achievements={[
                          {
                            id: "1",
                            title: "AWS Cloud Practitioner",
                            description: "Certificação inicial AWS conquistada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-05-01")
                          },
                          {
                            id: "2",
                            title: "Estudante Dedicado",
                            description: "30 dias consecutivos de estudo",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-04-15")
                          },
                          {
                            id: "3",
                            title: "Azure Administrator",
                            description: "Certificação Azure conquistada",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-04-01")
                          },
                          {
                            id: "4",
                            title: "Mentor Iniciante",
                            description: "Ajudou 10 alunos em sua jornada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.SPECIAL,
                            earnedAt: new Date("2025-03-20")
                          }
                        ]}
                      />

                      {/* Histórico do Aluno */}
                      <AchievementHistory
                        student={{
                          id: "1",
                          name: "João Silva",
                          email: "joao.silva@email.com",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao"
                        }}
                        achievements={[
                          {
                            id: "1",
                            title: "AWS Cloud Practitioner",
                            description: "Certificação inicial AWS conquistada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-05-01")
                          },
                          {
                            id: "2",
                            title: "Estudante Dedicado",
                            description: "30 dias consecutivos de estudo",
                            level: "silver",
                            type: ACHIEVEMENT_TYPES.STREAK,
                            earnedAt: new Date("2025-04-15")
                          },
                          {
                            id: "3",
                            title: "Azure Administrator",
                            description: "Certificação Azure conquistada",
                            level: "gold",
                            type: ACHIEVEMENT_TYPES.CERTIFICATION,
                            earnedAt: new Date("2025-04-01")
                          },
                          {
                            id: "4",
                            title: "Mentor Iniciante",
                            description: "Ajudou 10 alunos em sua jornada",
                            level: "bronze",
                            type: ACHIEVEMENT_TYPES.SPECIAL,
                            earnedAt: new Date("2025-03-20")
                          }
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Conquistas por Certificação */}
                <div className="grid gap-6">
                  {/* AWS */}
                  <Card>
                    <CardHeader>
                      <CardTitle>AWS Cloud</CardTitle>
                      <CardDescription>Conquistas específicas para certificações AWS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.CERTIFICATION}
                          title="Cloud Practitioner"
                          description="Complete sua primeira certificação AWS"
                          level="bronze"
                          icon="trophy"
                          progress={75}
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.MASTERY}
                          title="Solutions Architect"
                          description="Domine a arquitetura AWS"
                          level="silver"
                          icon="star"
                          unlocked={true}
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.STREAK}
                          title="AWS Expert"
                          description="Complete todas as certificações AWS"
                          level="gold"
                          icon="crown"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Azure */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Microsoft Azure</CardTitle>
                      <CardDescription>Conquistas específicas para certificações Azure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.CERTIFICATION}
                          title="Azure Fundamentals"
                          description="Complete sua primeira certificação Azure"
                          level="bronze"
                          icon="trophy"
                          unlocked={true}
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.MASTERY}
                          title="Azure Administrator"
                          description="Domine a administração Azure"
                          level="silver"
                          icon="star"
                          progress={30}
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.SPECIAL}
                          title="Azure Solutions Expert"
                          description="Torne-se um especialista Azure"
                          level="platinum"
                          icon="crown"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conquistas Especiais */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Conquistas Especiais</CardTitle>
                      <CardDescription>Conquistas por desempenho e dedicação</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.STREAK}
                          title="Estudante Dedicado"
                          description="30 dias consecutivos de estudo"
                          level="silver"
                          icon="target"
                          progress={60}
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.MASTERY}
                          title="Multi-Cloud Master"
                          description="Certificações em 3 provedores cloud"
                          level="platinum"
                          icon="crown"
                        />
                        <AchievementBadge
                          type={ACHIEVEMENT_TYPES.SPECIAL}
                          title="Mentor Cloud"
                          description="Ajude 50 alunos em sua jornada"
                          level="gold"
                          icon="award"
                          unlocked={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
