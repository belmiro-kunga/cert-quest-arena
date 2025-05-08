
import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { useToast } from '@/components/ui/use-toast';
import { getAllAchievements, getAchievementsByType, ACHIEVEMENT_TYPES } from '@/lib/achievements';
import { Achievement, AchievementStats, AchievementProgress } from '@/types/achievements';

export const useAchievements = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    examsCompleted: 0,
    flashcardsReviewed: 0,
    perfectReviews: 0,
    currentStreak: 0,
    perfectScores: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      // TODO: Implementar chamada à API para buscar estatísticas do usuário
      // Por enquanto, usando dados mockados
      const mockStats: AchievementStats = {
        examsCompleted: 5,
        flashcardsReviewed: 75,
        perfectReviews: 15,
        currentStreak: 5,
        perfectScores: 1
      };
      setStats(mockStats);
      // Explicitly convert to the type expected by useState
      const allAchievements = getAllAchievements(mockStats);
      setAchievements(allAchievements);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as estatísticas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const updateAchievementProgress = useCallback(async (
    achievementId: string,
    progress: number,
    unlocked: boolean
  ) => {
    if (!user?.id) return;

    try {
      // TODO: Implementar chamada à API para atualizar o progresso da conquista
      const updatedAchievements = achievements.map(achievement => {
        if (achievement.id === achievementId) {
          return {
            ...achievement,
            progress,
            unlocked
          };
        }
        return achievement;
      });
      setAchievements(updatedAchievements);

      // Se a conquista foi desbloqueada, mostrar uma notificação
      if (unlocked) {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
          toast({
            title: 'Nova Conquista!',
            description: `${achievement.title} - ${achievement.description}`,
            variant: 'default',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso da conquista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o progresso da conquista',
        variant: 'destructive',
      });
    }
  }, [user?.id, achievements, toast]);

  const handleExamCompletion = useCallback(async (score: number) => {
    if (!user?.id) return;

    try {
      // Atualiza estatísticas
      const newStats = {
        ...stats,
        examsCompleted: stats.examsCompleted + 1,
        perfectScores: score === 100 ? stats.perfectScores + 1 : stats.perfectScores
      };
      setStats(newStats);

      // Atualiza conquistas relacionadas a simulados
      const examAchievements = getAchievementsByType('CERTIFICATION', newStats);
      for (const achievement of examAchievements) {
        const progress = achievement.progress || 0;
        const unlocked = achievement.unlocked || false;
        await updateAchievementProgress(achievement.id, progress, unlocked);
      }
    } catch (error) {
      console.error('Erro ao processar conclusão do simulado:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar a conclusão do simulado',
        variant: 'destructive',
      });
    }
  }, [user?.id, stats, updateAchievementProgress, toast]);

  const handleFlashcardReview = useCallback(async (isPerfect: boolean) => {
    if (!user?.id) return;

    try {
      // Atualiza estatísticas
      const newStats = {
        ...stats,
        flashcardsReviewed: stats.flashcardsReviewed + 1,
        perfectReviews: isPerfect ? stats.perfectReviews + 1 : stats.perfectReviews
      };
      setStats(newStats);

      // Atualiza conquistas relacionadas a flashcards
      const flashcardAchievements = getAchievementsByType('MASTERY', newStats);
      for (const achievement of flashcardAchievements) {
        const progress = achievement.progress || 0;
        const unlocked = achievement.unlocked || false;
        await updateAchievementProgress(achievement.id, progress, unlocked);
      }
    } catch (error) {
      console.error('Erro ao processar revisão de flashcard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar a revisão do flashcard',
        variant: 'destructive',
      });
    }
  }, [user?.id, stats, updateAchievementProgress, toast]);

  const updateStudyStreak = useCallback(async () => {
    if (!user?.id) return;

    try {
      const today = new Date();
      const lastStudyDate = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null;
      
      // Verifica se o último estudo foi ontem
      const isConsecutiveDay = lastStudyDate && 
        today.getDate() - lastStudyDate.getDate() === 1 &&
        today.getMonth() === lastStudyDate.getMonth() &&
        today.getFullYear() === lastStudyDate.getFullYear();

      // Atualiza estatísticas
      const newStats = {
        ...stats,
        currentStreak: isConsecutiveDay ? stats.currentStreak + 1 : 1,
        lastStudyDate: today
      };
      setStats(newStats);

      // Atualiza conquistas relacionadas a sequências
      const streakAchievements = getAchievementsByType('STREAK', newStats);
      for (const achievement of streakAchievements) {
        const progress = achievement.progress || 0;
        const unlocked = achievement.unlocked || false;
        await updateAchievementProgress(achievement.id, progress, unlocked);
      }
    } catch (error) {
      console.error('Erro ao atualizar sequência de estudo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a sequência de estudo',
        variant: 'destructive',
      });
    }
  }, [user?.id, stats, updateAchievementProgress, toast]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    achievements,
    stats,
    isLoading,
    handleExamCompletion,
    handleFlashcardReview,
    updateStudyStreak
  };
}; 
