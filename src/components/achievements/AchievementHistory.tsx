import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: Date;
  type: 'certification' | 'mastery' | 'streak' | 'special';
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AchievementHistoryProps {
  student: Student;
  achievements: Achievement[];
}

const levelColors = {
  bronze: 'bg-orange-400 text-white',
  silver: 'bg-slate-400 text-white',
  gold: 'bg-yellow-400 text-white',
  platinum: 'bg-purple-400 text-white'
};

export const AchievementHistory: React.FC<AchievementHistoryProps> = ({
  student,
  achievements
}) => {
  // Agrupa conquistas por mês
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const date = achievement.earnedAt;
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Aluno */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow">
        <Avatar className="h-16 w-16">
          <AvatarImage src={student.avatar} />
          <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{achievements.length} Conquistas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                Última: {achievements[0]?.earnedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de Conquistas */}
      <div className="relative space-y-8">
        {Object.entries(groupedAchievements).map(([monthYear, monthAchievements]) => (
          <div key={monthYear} className="relative">
            <div className="sticky top-0 z-10 mb-4 flex items-center gap-2 bg-background/95 backdrop-blur p-2 rounded">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-semibold">{monthYear}</h4>
            </div>
            
            <div className="space-y-4 ml-4">
              {monthAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative pl-6 pb-4 border-l-2 border-muted last:border-l-transparent"
                >
                  <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{achievement.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            levelColors[achievement.level]
                          )}>
                            {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {achievement.earnedAt.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <Trophy className={cn(
                        "h-6 w-6",
                        achievement.level === 'gold' && "text-yellow-500",
                        achievement.level === 'silver' && "text-slate-400",
                        achievement.level === 'bronze' && "text-orange-400",
                        achievement.level === 'platinum' && "text-purple-400"
                      )} />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
