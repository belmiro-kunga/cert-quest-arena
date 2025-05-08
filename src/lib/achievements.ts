import { Achievement } from '@/types/achievements';

// Tipos de conquistas
export const ACHIEVEMENT_TYPES = {
  CERTIFICATION: 'certification',
  MASTERY: 'mastery',
  STREAK: 'streak',
  SPECIAL: 'special'
} as const;

// Níveis de conquistas
export const ACHIEVEMENT_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
} as const;

// Ícones de conquistas
export const ACHIEVEMENT_ICONS = {
  TROPHY: 'trophy',
  STAR: 'star',
  TARGET: 'target',
  AWARD: 'award',
  CROWN: 'crown'
} as const;

// Definições de conquistas
export const ACHIEVEMENT_DEFINITIONS = {
  // Conquistas de Certificação
  FIRST_EXAM: {
    id: 'first_exam',
    type: ACHIEVEMENT_TYPES.CERTIFICATION,
    title: 'Primeiro Simulado',
    description: 'Complete seu primeiro simulado',
    level: ACHIEVEMENT_LEVELS.BRONZE,
    icon: ACHIEVEMENT_ICONS.TROPHY,
    requirement: 1
  },
  EXAM_MASTER: {
    id: 'exam_master',
    type: ACHIEVEMENT_TYPES.CERTIFICATION,
    title: 'Mestre dos Simulados',
    description: 'Complete 10 simulados',
    level: ACHIEVEMENT_LEVELS.SILVER,
    icon: ACHIEVEMENT_ICONS.STAR,
    requirement: 10
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    type: ACHIEVEMENT_TYPES.CERTIFICATION,
    title: 'Nota Perfeita',
    description: 'Obtenha 100% em um simulado',
    level: ACHIEVEMENT_LEVELS.GOLD,
    icon: ACHIEVEMENT_ICONS.CROWN,
    requirement: 1
  },

  // Conquistas de Domínio (Flashcards)
  FLASHCARD_NOVICE: {
    id: 'flashcard_novice',
    type: ACHIEVEMENT_TYPES.MASTERY,
    title: 'Iniciante dos Flashcards',
    description: 'Revise 50 flashcards',
    level: ACHIEVEMENT_LEVELS.BRONZE,
    icon: ACHIEVEMENT_ICONS.TROPHY,
    requirement: 50
  },
  FLASHCARD_MASTER: {
    id: 'flashcard_master',
    type: ACHIEVEMENT_TYPES.MASTERY,
    title: 'Mestre dos Flashcards',
    description: 'Revise 100 flashcards',
    level: ACHIEVEMENT_LEVELS.SILVER,
    icon: ACHIEVEMENT_ICONS.STAR,
    requirement: 100
  },
  PERFECT_REVIEW: {
    id: 'perfect_review',
    type: ACHIEVEMENT_TYPES.MASTERY,
    title: 'Revisão Perfeita',
    description: 'Revise 20 flashcards consecutivos sem erros',
    level: ACHIEVEMENT_LEVELS.GOLD,
    icon: ACHIEVEMENT_ICONS.CROWN,
    requirement: 20
  },

  // Conquistas de Sequência
  THREE_DAY_STREAK: {
    id: 'three_day_streak',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: 'Estudante Regular',
    description: 'Mantenha uma sequência de 3 dias de estudo',
    level: ACHIEVEMENT_LEVELS.BRONZE,
    icon: ACHIEVEMENT_ICONS.TROPHY,
    requirement: 3
  },
  SEVEN_DAY_STREAK: {
    id: 'seven_day_streak',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: 'Estudante Dedicado',
    description: 'Mantenha uma sequência de 7 dias de estudo',
    level: ACHIEVEMENT_LEVELS.SILVER,
    icon: ACHIEVEMENT_ICONS.STAR,
    requirement: 7
  },
  THIRTY_DAY_STREAK: {
    id: 'thirty_day_streak',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: 'Estudante Exemplar',
    description: 'Mantenha uma sequência de 30 dias de estudo',
    level: ACHIEVEMENT_LEVELS.GOLD,
    icon: ACHIEVEMENT_ICONS.CROWN,
    requirement: 30
  }
} as const;

// Função para calcular o progresso de uma conquista
export const calculateAchievementProgress = (
  achievementId: string,
  stats: {
    examsCompleted?: number;
    flashcardsReviewed?: number;
    perfectReviews?: number;
    currentStreak?: number;
    perfectScores?: number;
  }
): number => {
  const achievement = ACHIEVEMENT_DEFINITIONS[achievementId as keyof typeof ACHIEVEMENT_DEFINITIONS];
  if (!achievement) return 0;

  switch (achievementId) {
    case 'first_exam':
    case 'exam_master':
      return Math.min((stats.examsCompleted || 0) / achievement.requirement * 100, 100);
    
    case 'perfect_score':
      return Math.min((stats.perfectScores || 0) / achievement.requirement * 100, 100);
    
    case 'flashcard_novice':
    case 'flashcard_master':
      return Math.min((stats.flashcardsReviewed || 0) / achievement.requirement * 100, 100);
    
    case 'perfect_review':
      return Math.min((stats.perfectReviews || 0) / achievement.requirement * 100, 100);
    
    case 'three_day_streak':
    case 'seven_day_streak':
    case 'thirty_day_streak':
      return Math.min((stats.currentStreak || 0) / achievement.requirement * 100, 100);
    
    default:
      return 0;
  }
};

// Função para verificar se uma conquista foi desbloqueada
export const isAchievementUnlocked = (progress: number): boolean => {
  return progress >= 100;
};

// Função para obter todas as conquistas com progresso
export const getAllAchievements = (stats: {
  examsCompleted?: number;
  flashcardsReviewed?: number;
  perfectReviews?: number;
  currentStreak?: number;
  perfectScores?: number;
}): Achievement[] => {
  return Object.values(ACHIEVEMENT_DEFINITIONS).map(achievement => {
    const progress = calculateAchievementProgress(achievement.id, stats);
    return {
      ...achievement,
      progress,
      unlocked: isAchievementUnlocked(progress)
    };
  });
};

// Função para obter conquistas por tipo
export const getAchievementsByType = (
  type: keyof typeof ACHIEVEMENT_TYPES,
  stats: {
    examsCompleted?: number;
    flashcardsReviewed?: number;
    perfectReviews?: number;
    currentStreak?: number;
    perfectScores?: number;
  }
): Achievement[] => {
  return getAllAchievements(stats).filter(achievement => achievement.type === type);
}; 