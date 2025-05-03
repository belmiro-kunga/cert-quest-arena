import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  type: 'certification' | 'mastery' | 'streak' | 'special';
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon?: 'trophy' | 'star' | 'target' | 'award' | 'crown';
  progress?: number;
  unlocked?: boolean;
}

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

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  title,
  description,
  level,
  icon = 'trophy',
  progress = 0,
  unlocked = false
}) => {
  const Icon = icons[icon];
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      unlocked ? "bg-card" : "bg-muted/50",
      "hover:shadow-lg"
    )}>
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        levelColors[level]
      )} />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-full",
              unlocked ? levelColors[level] : "bg-muted",
              "transition-colors duration-300"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                unlocked ? "text-white" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge variant={unlocked ? "default" : "outline"}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        </div>
        
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                levelColors[level]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
