
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
  price: number; 
  discountPrice?: number | null;
  discountPercentage?: number | null;
  discountExpiresAt?: Date | null;
  questionsCount: number; 
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  purchases: number; 
  rating: number; 
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
  applicableExams: string[];
  active: boolean;
}

// Novos tipos para o gestor de conteúdo
export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  status: 'published' | 'draft';
  slug: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  category: string;
  featured: boolean;
  image?: string;
}

export type ContentType = 'page' | 'post' | 'faq' | 'testimonial' | 'banner';

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
}
