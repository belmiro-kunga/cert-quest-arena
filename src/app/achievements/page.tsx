import React from 'react';
import { AchievementIntegration } from '@/components/achievements/AchievementIntegration';
import { AchievementProgress } from '@/components/achievements/AchievementProgress';

export default function AchievementsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Conquistas</h1>
      <AchievementProgress />
      <AchievementIntegration />
    </div>
  );
} 