import { useState, useEffect } from 'react';
import { getFlashcardStats } from '@/lib/flashcards';
import { useUser } from './useUser';

interface FlashcardStats {
  totalReviews: number;
  averageQuality: number;
  statusCounts: {
    new: number;
    learning: number;
    review: number;
    graduated: number;
  };
}

export const useFlashcardProgress = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const data = await getFlashcardStats(user.id);
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return {
    stats,
    isLoading,
    error,
    refetch: () => {
      if (user?.id) {
        setIsLoading(true);
        getFlashcardStats(user.id)
          .then(data => {
            setStats(data);
            setError(null);
          })
          .catch(err => {
            setError(err);
            setStats(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };
};
