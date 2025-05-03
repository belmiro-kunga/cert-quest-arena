import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface FlashCardProps {
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview?: Date;
}

export const FlashCard: React.FC<FlashCardProps> = ({ front, back, difficulty, nextReview }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  };

  return (
    <div className="perspective-1000 w-full h-[200px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="absolute w-full h-full p-4 backface-hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <Badge className={difficultyColors[difficulty]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
              {nextReview && (
                <Badge variant="outline">
                  Próxima revisão: {nextReview.toLocaleDateString()}
                </Badge>
              )}
            </div>
            <div className="flex-grow flex items-center justify-center text-lg">
              {front}
            </div>
          </div>
        </Card>

        <Card className="absolute w-full h-full p-4 backface-hidden rotate-y-180">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center text-lg">
              {back}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
