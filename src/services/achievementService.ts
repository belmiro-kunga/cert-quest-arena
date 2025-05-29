export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  is_active: boolean;
  requirements: string;
  created_at: string;
  updated_at: string;
}

export const getAchievements = async (): Promise<Achievement[]> => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createAchievement = async (achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>): Promise<Achievement> => {
  // Mock implementation - replace with actual API call
  const now = new Date().toISOString();
  return {
    ...achievement,
    id: Date.now().toString(),
    created_at: now,
    updated_at: now
  };
};

export const updateAchievement = async (id: string, achievement: Partial<Achievement>): Promise<Achievement> => {
  // Mock implementation - replace with actual API call
  return {
    id,
    name: achievement.name || '',
    description: achievement.description || '',
    points: achievement.points || 0,
    category: achievement.category || '',
    is_active: achievement.is_active || true,
    requirements: achievement.requirements || '',
    created_at: achievement.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const deleteAchievement = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting achievement:', id);
};
