
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@/types/exam';

interface QuestionCardProps {
  question: Question;
  selectedOption: string;
  onOptionSelect: (optionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  selectedOption, 
  onOptionSelect 
}) => {
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">{question.text}</h2>
        
        <RadioGroup 
          value={selectedOption || ""} 
          onValueChange={onOptionSelect}
          className="space-y-3"
        >
          {question.options.map(option => (
            <div key={option.id} className="flex items-center space-x-2 border border-gray-200 rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
              <Label className="flex-grow cursor-pointer" htmlFor={`option-${option.id}`}>
                <div className="flex">
                  <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                  <span>{option.text}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
