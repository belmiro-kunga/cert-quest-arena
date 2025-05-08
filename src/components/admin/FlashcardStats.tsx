
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, Clock, BarChart2 } from 'lucide-react';
import { Flashcard } from '@/types/admin';

interface FlashcardStatsProps {
  flashcards: Flashcard[];
}

export const FlashcardStats: React.FC<FlashcardStatsProps> = ({ flashcards }) => {
  const totalFlashcards = flashcards.length;
  const reviewedToday = flashcards.filter(f => {
    if (!f.lastReviewedAt) {
      return false; // Not reviewed if lastReviewedAt is not set
    }
    // Assuming f.lastReviewedAt is either a Date object or a string that can be parsed into a Date
    const lastReview = new Date(f.lastReviewedAt);
    // Check if lastReview is a valid date after attempting to parse
    if (isNaN(lastReview.getTime())) {
        return false; // Invalid date, so not reviewed today
    }
    const today = new Date();
    return lastReview.getFullYear() === today.getFullYear() &&
           lastReview.getMonth() === today.getMonth() &&
           lastReview.getDate() === today.getDate();
  }).length;
  const masteredCount = flashcards.filter(f => f.status === 'mastered').length;
  const averageInterval = flashcards.reduce((acc, f) => acc + (f.interval || 0), 0) / (totalFlashcards || 1);

  const stats = [
    {
      title: "Total de Flashcards",
      value: totalFlashcards,
      description: "Flashcards criados",
      icon: Brain,
      color: "text-blue-500"
    },
    {
      title: "Revisados Hoje",
      value: reviewedToday,
      description: "Cartões revisados hoje",
      icon: Clock,
      color: "text-green-500"
    },
    {
      title: "Dominados",
      value: masteredCount,
      description: "Cartões dominados",
      icon: CheckCircle,
      color: "text-purple-500"
    },
    {
      title: "Intervalo Médio",
      value: `${Math.round(averageInterval)} dias`,
      description: "Entre revisões",
      icon: BarChart2,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
