import { useState } from 'react';

export interface AdminPageState {
  activeTab: string;
  selectedStudent: string | null;
  selectedExam: string | null;
  selectedCoupon: string | null;
}

export interface AdminPageActions {
  handleTabChange: (value: string) => void;
  handleStudentSelect: (studentId: string) => void;
  handleExamSelect: (examId: string) => void;
  handleExamDelete: (examId: string) => void;
  handleCouponSelect: (couponId: string) => void;
  handleCouponDelete: (couponId: string) => void;
}

export const useAdminPage = (): { state: AdminPageState; actions: AdminPageActions } => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

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
    // Implementar lógica de exclusão
    console.log('Deletando simulado:', examId);
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
      selectedCoupon
    },
    actions: {
      handleTabChange,
      handleStudentSelect,
      handleExamSelect,
      handleExamDelete,
      handleCouponSelect,
      handleCouponDelete
    }
  };
};
