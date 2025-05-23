import React, { useRef, useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { formatDuration } from '@/lib/utils';

interface AudioProgressProps {
  audioUrl: string;
  className?: string;
}

export const AudioProgress: React.FC<AudioProgressProps> = ({ audioUrl, className }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
      }
    };
  }, []);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Progress
        value={duration > 0 ? (currentTime / duration) * 100 : 0}
        className="flex-1"
      />
      <span className="text-sm text-muted-foreground">
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
    </div>
  );
};
