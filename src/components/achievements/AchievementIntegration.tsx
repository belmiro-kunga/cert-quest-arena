
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementBadge } from './AchievementBadge';
import { useUser } from '@/lib/hooks/useUser';
import { useToast } from "@/components/ui/use-toast";
import { getAllAchievements, getAchievementsByType, ACHIEVEMENT_TYPES } from '@/lib/achievements';
import { Achievement, AchievementStats } from '@/types/achievements';

export const AchievementIntegration: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState<AchievementStats>({
    examsCompleted: 0,
    flashcardsReviewed: 0,
    perfectReviews: 0,
    currentStreak: 0,
    perfectScores: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  const fetchUserStats = async () => {
    try {
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
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'all') return true;
    return achievement.type === activeTab;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value={ACHIEVEMENT_TYPES.CERTIFICATION}>Certificações</TabsTrigger>
              <TabsTrigger value={ACHIEVEMENT_TYPES.MASTERY}>Domínio</TabsTrigger>
              <TabsTrigger value={ACHIEVEMENT_TYPES.STREAK}>Sequências</TabsTrigger>
              <TabsTrigger value={ACHIEVEMENT_TYPES.SPECIAL}>Especiais</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    type={achievement.type}
                    title={achievement.title}
                    description={achievement.description}
                    level={achievement.level}
                    icon={achievement.icon}
                    progress={achievement.progress || 0}
                    unlocked={achievement.unlocked || false}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 
