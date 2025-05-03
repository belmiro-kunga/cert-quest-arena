export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  achievements: number;
  lastActive: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  xp: number;
  icon: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type AchievementType = 'certification' | 'streak' | 'mastery' | 'special';

export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PerformanceData {
  name: string;
  aprovados: number;
  total: number;
}

export interface AchievementData {
  name: string;
  value: number;
}

export interface AdminPageState {
  activeTab: string;
  selectedStudent: string | null;
  selectedAchievement: string | null;
}

export interface AdminPageActions {
  handleTabChange: (value: string) => void;
  handleStudentSelect: (studentId: string) => void;
  handleAchievementSelect: (achievementId: string) => void;
  handleCreateAchievement: () => void;
  handleUpdateAchievement: () => void;
  handleDeleteAchievement: () => void;
}
