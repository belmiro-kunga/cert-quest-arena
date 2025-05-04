
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
  price: number; // Changed from optional to required
  discountPrice?: number | null;
  discountPercentage?: number | null;
  discountExpiresAt?: Date | null;
  questionsCount: number; // Changed from optional to required
  difficulty: 'Fácil' | 'Médio' | 'Difícil'; // Changed from optional to required
  purchases: number; // Changed from optional to required
  rating: number; // Changed from optional to required
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

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableExams: string[]; // Changed from optional to required
  active: boolean;
}
