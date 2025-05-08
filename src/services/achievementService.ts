import { supabase } from './supabaseClient';
import { Achievement, AchievementType } from '@/types/admin';
import { AchievementFormData } from '@/components/admin/AchievementForm'; // Assuming this path is correct

export interface DbAchievement {
  id: string; // UUID from Supabase
  title: string;
  description: string;
  type: AchievementType;
  xp: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

// Helper to convert DB representation to frontend type if needed (dates, etc.)
// For now, they are quite similar, but this can be useful for date objects or other transformations.
const fromDbAchievement = (dbAchievement: DbAchievement): Achievement => ({
  ...dbAchievement,
  // Ensure dates are Date objects if your Achievement type expects them
  // createdAt: new Date(dbAchievement.created_at),
  // updatedAt: new Date(dbAchievement.updated_at),
});

export const getAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
  // Assuming DbAchievement and Achievement are compatible for now, or use fromDbAchievement
  return data as Achievement[]; 
};

export const createAchievement = async (achievementData: AchievementFormData): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .insert([{
      title: achievementData.title,
      description: achievementData.description,
      type: achievementData.type,
      xp: achievementData.xp,
      icon: achievementData.icon,
      // created_at and updated_at will be set by Supabase defaults
    }])
    .select()
    .single(); // .single() ensures we get the created object back

  if (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
  // Assuming DbAchievement and Achievement are compatible for now, or use fromDbAchievement
  return data as Achievement;
};

export const updateAchievement = async (id: string, achievementData: Partial<AchievementFormData>): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .update({
      ...achievementData,
      updated_at: new Date().toISOString(), // Manually set updated_at
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
  return data as Achievement;
};

export const deleteAchievement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};
