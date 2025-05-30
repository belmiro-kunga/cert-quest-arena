
export interface Student {
  id: string;
  name: string;
  email: string;
  provider?: 'email' | 'google' | 'github';
  plan_type: 'free' | 'basic' | 'premium';
  attempts_left: number;
  progress: number;
  achievements: number;
  lastActive: string;
  exams: string[];
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  xp: number;
  icon: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement?: number;
  progress?: number;
  unlocked?: boolean;
  name: string;
  points: number;
  category: string;
  is_active: boolean;
  requirements: string;
  created_at: string;
  updated_at: string;
}

export type ExamLanguage = 'pt' | 'en' | 'fr' | 'es';

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  questions_count: number;
  questionsCount?: number; // Add alias for compatibility
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  categoria?: string;
  is_gratis?: boolean;
  preco_usd?: number;
  discountPrice?: number;
  discountPercentage?: number;
  discountExpiresAt?: string;
  passingScore?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  isActive?: boolean;
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type QuestionType = 
  | 'multiple_choice'      // Múltipla escolha (várias respostas corretas)
  | 'single_choice'        // Escolha única
  | 'drag_and_drop'        // Arrastar e soltar
  | 'practical_scenario'   // Cenário prático
  | 'fill_in_blank'       // Preencher lacunas
  | 'command_line'        // Comandos de terminal
  | 'network_topology';    // Topologia de rede

export interface ExplanationLink {
  text: string;
  url: string;
  title?: string;
}

export interface BaseQuestion {
  id: string;
  examId: string;
  type: QuestionType;
  text: string;
  explanation: string;
  url_referencia?: string; // URL para documentação ou material de referência externo
  explanationLinks?: ExplanationLink[];
  audioExplanationUrl?: string; // Add this field
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  tags: string[];
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctOptions: string[];
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice';
  options: string[];
  correctOption: string;
}

export interface DragAndDropQuestion extends BaseQuestion {
  type: 'drag_and_drop';
  items: {
    id: string;
    text: string;
    category: string;
  }[];
  correctPlacements: {
    itemId: string;
    targetCategory: string;
  }[];
  dragAndDropItems?: {
    text: string;
    category?: string;
    hint?: string;
  }[];
  dragAndDropCategories?: {
    name: string;
    description?: string;
  }[];
}

export interface PracticalScenarioQuestion extends BaseQuestion {
  type: 'practical_scenario';
  scenario: {
    description: string;
    initialState: any;
    expectedOutcome: any;
    validationSteps: {
      description: string;
      validator: string; // Função de validação serializada
    }[];
  };
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill_in_blank';
  text: string;
  blanks: {
    id: string;
    correctAnswers: string[];
    caseSensitive: boolean;
  }[];
}

export interface CommandLineQuestion extends BaseQuestion {
  type: 'command_line';
  environment: 'linux' | 'windows' | 'cisco_ios' | 'aws_cli';
  initialState: string;
  expectedCommands: string[];
  validationScript: string;
}

export interface NetworkTopologyQuestion extends BaseQuestion {
  type: 'network_topology';
  topology: {
    nodes: {
      id: string;
      type: 'router' | 'switch' | 'host' | 'firewall' | 'cloud';
      config: any;
    }[];
    connections: {
      from: string;
      to: string;
      type: 'ethernet' | 'serial' | 'fiber' | 'wireless';
    }[];
  };
  tasks: {
    description: string;
    validator: string;
  }[];
}

export type Question =
  | MultipleChoiceQuestion
  | SingleChoiceQuestion
  | DragAndDropQuestion
  | PracticalScenarioQuestion
  | FillInBlankQuestion
  | CommandLineQuestion
  | NetworkTopologyQuestion;

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
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  applicableExams: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export type FlashcardDifficulty = 'easy' | 'medium' | 'hard';

export type FlashcardStatus = 'new' | 'learning' | 'review' | 'graduated' | 'mastered';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  tags?: string[];
  status: FlashcardStatus;
  lastReviewedAt: string | null;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date | string;
}

export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  user_id: string;
  quality: number;
  reviewed_at: string;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
}

export type PointActionKey =
  | 'review_flashcard'
  | 'complete_flashcard_session'
  | 'start_exam'
  | 'complete_exam'
  | 'daily_login';

export interface PointActionConfig {
  id: PointActionKey;
  name: string; // User-friendly name for the action
  points: number;
  description?: string; // Optional description of the action
}

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  transaction_id?: string;
  order_id?: string;
  user_id: string;
  userName?: string;
  created_at: string;
  updated_at?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  transactionId?: string;
  orderId?: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  revenueByDay: Array<{ date: string; revenue: number }>;
  paymentMethodDistribution: Array<{ method: string; count: number; percentage: number }>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  userId: string;
  userEmail: string;
  description: string;
  paymentDate: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  config: {
    apiKey?: string;
    merchantId?: string;
    stripeApiKey?: string;
    paypalEmail?: string;
    googlePayMerchantId?: string;
    [key: string]: any;
  };
}

export interface RefundPolicy {
  refundPeriod: number;
  refundPolicy: string;
  automaticRefunds: boolean;
  refundNotifications: boolean;
  additionalNotes: string;
  partialRefunds: boolean;
  refundReasons: string[];
  processingTime: number;
  refundMethod: 'original' | 'transfer';
  minAmount: number;
  maxAmount: number;
  refundFees: boolean;
  adminApprovalRequired: boolean;
  partialRefundsAllowed: boolean;
  refundProcessingTime: number;
  refundFeeDeduction: number;
  blacklistOnRefund: boolean;
}
