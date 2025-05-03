import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AdminPageState {
  activeTab: string;
  selectedStudent: string | null;
  selectedAchievement: string | null;
}

export const useAdminPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const handleAchievementSelect = (achievementId: string) => {
    setSelectedAchievement(achievementId);
  };

  const handleCreateAchievement = () => {
    toast({
      title: "Conquista criada",
      description: "Nova conquista foi criada com sucesso!"
    });
  };

  const handleUpdateAchievement = () => {
    toast({
      title: "Conquista atualizada",
      description: "A conquista foi atualizada com sucesso!"
    });
  };

  const handleDeleteAchievement = () => {
    toast({
      title: "Conquista removida",
      description: "A conquista foi removida com sucesso!"
    });
  };

  return {
    state: {
      activeTab,
      selectedStudent,
      selectedAchievement
    },
    actions: {
      handleTabChange,
      handleStudentSelect,
      handleAchievementSelect,
      handleCreateAchievement,
      handleUpdateAchievement,
      handleDeleteAchievement
    }
  };
};
