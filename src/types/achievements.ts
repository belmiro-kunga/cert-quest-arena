
export interface Achievement {
  id: string;
  type: 'certification' | 'mastery' | 'streak' | 'special';
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: 'trophy' | 'star' | 'target' | 'award' | 'crown';
  requirement: number;
  progress?: number;
  unlocked?: boolean;
  xp: number; // Added xp to match with admin.Achievement
}

export interface AchievementStats {
  examsCompleted: number;
  flashcardsReviewed: number;
  perfectReviews: number;
  currentStreak: number;
  perfectScores: number;
  lastStudyDate?: Date;
}

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
} 
