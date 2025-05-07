
import { useState, useEffect } from 'react';
import { fetchExams } from '@/services/examService';
import { Exam } from '@/types/admin';

export interface AdminPageState {
  activeTab: string;
  selectedStudent: string | null;
  selectedExam: string | null;
  selectedCoupon: string | null;
  adminExams: Exam[];
  isLoading: boolean;
}

export interface AdminPageActions {
  handleTabChange: (value: string) => void;
  handleStudentSelect: (studentId: string) => void;
  handleExamSelect: (examId: string) => void;
  handleExamDelete: (examId: string) => void;
  handleExamCreated: (exam: Exam) => void;
  handleExamUpdated: (exam: Exam) => void;
  handleCouponSelect: (couponId: string) => void;
  handleCouponDelete: (couponId: string) => void;
  refreshExams: () => Promise<void>;
}

export const useAdminPage = (): { state: AdminPageState; actions: AdminPageActions } => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [adminExams, setAdminExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshExams = async () => {
    setIsLoading(true);
    try {
      const fetchedExams = await fetchExams();
      setAdminExams(fetchedExams);
    } catch (error) {
      console.error('Erro ao carregar simulados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshExams();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
  };

  const handleCouponSelect = (couponId: string) => {
    setSelectedCoupon(couponId);
  };

  const handleExamDelete = (examId: string) => {
    // Remover o exame da lista local após exclusão
    setAdminExams(adminExams.filter(exam => exam.id !== examId));
  };

  const handleExamCreated = (exam: Exam) => {
    // Adicionar novo exame à lista
    setAdminExams(prevExams => [...prevExams, exam]);
  };

  const handleExamUpdated = (updatedExam: Exam) => {
    // Atualizar exame na lista
    setAdminExams(prevExams => 
      prevExams.map(exam => 
        exam.id === updatedExam.id ? updatedExam : exam
      )
    );
  };

  const handleCouponDelete = (couponId: string) => {
    // Implementar lógica de exclusão
    console.log('Deletando cupom:', couponId);
  };

  return {
    state: {
      activeTab,
      selectedStudent,
      selectedExam,
      selectedCoupon,
      adminExams,
      isLoading
    },
    actions: {
      handleTabChange,
      handleStudentSelect,
      handleExamSelect,
      handleExamDelete,
      handleExamCreated,
      handleExamUpdated,
      handleCouponSelect,
      handleCouponDelete,
      refreshExams
    }
  };
};
