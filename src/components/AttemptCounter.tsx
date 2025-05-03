
import React from 'react';

interface AttemptCounterProps {
  attemptsUsed: number;
  totalAttempts: number;
}

const AttemptCounter: React.FC<AttemptCounterProps> = ({ attemptsUsed, totalAttempts }) => {
  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{attemptsUsed}/{totalAttempts}</span> tentativas utilizadas nesta semana
    </div>
  );
};

export default AttemptCounter;
