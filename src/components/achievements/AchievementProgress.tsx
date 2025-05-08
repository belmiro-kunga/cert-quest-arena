import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAchievements } from '@/lib/hooks/useAchievements';
import { Trophy, Star, Target, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const levelColors = {
  bronze: 'bg-orange-400',
  silver: 'bg-slate-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-purple-400'
};

const icons = {
  trophy: Trophy,
  star: Star,
  target: Target,
  award: Award,
  crown: Crown
};

export const AchievementProgress: React.FC = () => {
  const { achievements, stats, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Carregando progresso...</p>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;
  const progressPercentage = (unlockedAchievements.length / totalAchievements) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progresso das Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conquistas Desbloqueadas</span>
                <span>{unlockedAchievements.length} de {totalAchievements}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Simulados</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completados</span>
                      <span>{stats.examsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Notas Perfeitas</span>
                      <span>{stats.perfectScores}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Flashcards</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revisados</span>
                      <span>{stats.flashcardsReviewed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Revisões Perfeitas</span>
                      <span>{stats.perfectReviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dias Consecutivos</span>
                      <span>{stats.currentStreak}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Último Estudo</span>
                      <span>
                        {stats.lastStudyDate
                          ? new Date(stats.lastStudyDate).toLocaleDateString()
                          : 'Nunca'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Conquistas Recentes</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unlockedAchievements.slice(0, 3).map((achievement) => {
                  const Icon = icons[achievement.icon];
                  return (
                    <Card key={achievement.id} className="relative overflow-hidden">
                      <div className={cn(
                        "absolute top-0 left-0 w-1 h-full",
                        levelColors[achievement.level]
                      )} />
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "p-2 rounded-full",
                            levelColors[achievement.level]
                          )}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 