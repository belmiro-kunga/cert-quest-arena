// React e Hooks
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useAdminPage } from '@/hooks/useAdminPage';

// Componentes de Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Componentes UI Base
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

// Componentes Admin
import { Overview } from '@/components/admin/Overview';
import { Students } from '@/components/admin/Students';
import { Exams } from '@/components/admin/Exams';
import { Coupons } from '@/components/admin/Coupons';
import { StudySystem } from '@/components/admin/StudySystem';
import Payments from '@/components/admin/Payments';
import { GamificationAdmin } from '@/components/admin/GamificationAdmin';

// Ícones
import { Settings, Plus, Edit, Trash, Trophy, Book, Target, Users, TrendingUp, Award, Coins, Sword, Star, Calendar, Gift, Gamepad, CreditCard } from 'lucide-react';

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

// Componentes UI Base
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from "@/components/ui/separator";

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

// Update the mock data to match the required fields in the Exam type
const mockExamsData: Exam[] = MOCK_DATA.exams.map(exam => ({
  ...exam,
  questions: [],
  questionsCount: 65,
  duration: 120,
  difficulty: 'Médio' as 'Fácil' | 'Médio' | 'Difícil',
  purchases: 250,
  rating: 4.7,
  passingScore: 70,
  price: exam.price || 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  discountExpiresAt: exam.discountExpiresAt ? exam.discountExpiresAt.toISOString() : null
}));

// Update the mock data to match the required fields in the Coupon type
const mockCoupons: Coupon[] = MOCK_DATA.coupons.map(coupon => ({
  ...coupon,
  discountType: coupon.type as 'percentage' | 'fixed',
  discountValue: coupon.value,
  usageLimit: coupon.maxUses,
  usageCount: coupon.currentUses,
  validFrom: new Date(coupon.validFrom), // Ensure Date object
  validUntil: new Date(coupon.validUntil), // Ensure Date object
  minPurchaseAmount: coupon.minPurchase,
  maxDiscountAmount: coupon.maxDiscount,
  active: coupon.isActive,
  applicableExams: [], // Add the required field
  createdAt: new Date(), // Add createdAt
  updatedAt: new Date()  // Add updatedAt
}));

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const { toast } = useToast();

  // Buscar alunos e exames ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, examsData] = await Promise.all([
          api.get('/api/admin/students'),
          api.get('/api/admin/exams')
        ]);
        setStudents(studentsData.data);
        setExams(examsData.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, []);

  // Criar novo aluno
  const handleCreateStudent = async (data: Partial<Student>) => {
    try {
      const response = await api.post('/api/admin/students', data);
      setStudents(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      throw error;
    }
  };

  // Atualizar aluno
  const handleUpdateStudent = async (id: string, data: Partial<Student>) => {
    try {
      const response = await api.put(`/api/admin/students/${id}`, data);
      setStudents(prev =>
        prev.map(student =>
          student.id === id ? { ...student, ...response.data } : student
        )
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      throw error;
    }
  };

  // Excluir aluno
  const handleDeleteStudent = async (id: string) => {
    try {
      await api.delete(`/api/admin/students/${id}`);
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      throw error;
    }
  };

  // Inscrever aluno em simulado
  const handleEnrollExam = async (studentId: string, examId: string) => {
    try {
      await api.post(`/api/admin/students/${studentId}/exams/${examId}`);
      toast({
        title: 'Sucesso',
        description: 'Aluno inscrito no simulado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao inscrever aluno:', error);
      throw error;
    }
  };
  const navigate = useNavigate();
  const { signOut } = useSupabaseAuth();

  const handleLogout = () => {
    signOut();
    navigate('/auth/login');
  };

  const {
    state: { activeTab: adminTab, adminExams, isLoading /* other state props */ },
    actions: {
      handleTabChange,
      handleStudentSelect,
      handleExamSelect,
      handleCouponSelect,
      handleExamDelete,
      handleCouponDelete,
      handleExamCreated,
      handleExamUpdated,
      refreshExams
    },
    // adminCoupons, // Temporarily removed from destructuring
  } = useAdminPage();

  // Initialize adminCoupons locally for now to satisfy types
  const adminCoupons: Coupon[] = []; 

  // Transform adminCoupons to ensure Date objects and satisfy Coupon type
  const processedAdminCoupons: Coupon[] = (adminCoupons || []).map(coupon => ({
    ...coupon,
    createdAt: coupon.createdAt ? new Date(coupon.createdAt) : new Date(),
    updatedAt: coupon.updatedAt ? new Date(coupon.updatedAt) : new Date(),
    discountType: coupon.discountType || 'percentage',
    discountValue: coupon.discountValue || 0,
    usageLimit: coupon.usageLimit || 0,
    usageCount: coupon.usageCount || 0,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Painel Administrativo</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-cert-blue hover:text-cert-blue/90 hover:bg-cert-blue/10"
            >
              Ir para Home
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Sair do Admin
            </Button>
          </div>
        </div>
      </div>
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
          
          {/* Replaced the inline TabsList with our new AdminNavigation component */}
          <AdminNavigation activeTab={adminTab} onTabChange={handleTabChange} />
          
          <Tabs value={adminTab} className="space-y-4">
            <TabsContent value="overview">
              <Overview
                performanceData={MOCK_DATA.performance}
                certificationsData={MOCK_DATA.achievements}
                colors={COLORS}
              />
            </TabsContent>

            <TabsContent value="students">
              <Students
                students={students}
                onCreateStudent={handleCreateStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onEnrollExam={handleEnrollExam}
                availableExams={exams.map(exam => ({
                  id: exam.id,
                  title: exam.title
                }))}
              />
            </TabsContent>

            {/* Aba de Simulados */}
            <TabsContent value="exams">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <p>Carregando simulados...</p>
                </div>
              ) : (
                <Exams
                  exams={adminExams}
                  onSelect={handleExamSelect}
                  onDelete={async (examId: string) => {
                    await handleExamDelete(examId);
                  }}
                  onExamCreated={handleExamCreated}
                  onExamUpdated={handleExamUpdated}
                />
              )}
            </TabsContent>

            <TabsContent value="coupons">
              <Coupons
                coupons={processedAdminCoupons} // Use processed adminCoupons
                onSelect={async (couponId: string) => {
                  await handleCouponSelect(couponId);
                }}
                onDelete={async (couponId: string) => {
                  await handleCouponDelete(couponId);
                }}
              />
            </TabsContent>

            <TabsContent value="gamification">
              <GamificationAdmin />
            </TabsContent>

            <TabsContent value="study">
              <StudySystem />
            </TabsContent>

            <TabsContent value="payments">
              <Payments />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
