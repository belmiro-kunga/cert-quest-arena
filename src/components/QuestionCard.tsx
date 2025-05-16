import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// import { Question } from '@/types/exam'; // Arquivo removido
// Definição local temporária do tipo Question
type Question = {
  id: number;
  text: string;
  explanation?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
};

interface QuestionCardProps {
  question: Question & { type?: string };
  selectedOption: string | string[];
  onOptionSelect: (optionId: string | string[]) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  selectedOption, 
  onOptionSelect 
}) => {
  // Handler para múltipla escolha
  const handleCheckboxChange = (optionId: string) => {
    if (!Array.isArray(selectedOption)) return;
    if (selectedOption.includes(optionId)) {
      onOptionSelect(selectedOption.filter(id => id !== optionId));
    } else {
      onOptionSelect([...selectedOption, optionId]);
    }
  };

  // Handler para escolha única
  const handleRadioChange = (optionId: string) => {
    onOptionSelect(optionId);
  };

  // Verificar se é uma questão de múltipla escolha
  const isMultipleChoice = question.type === 'multiple_choice';

  return (
    <Card className="shadow-md">
      <CardContent className="pt-4 md:pt-6">
        <h2 
          className="text-base md:text-lg font-medium mb-3 md:mb-4"
          id={`question-${question.id}-heading`}
        >
          {question.text}
        </h2>
        
        {isMultipleChoice ? (
          <div 
            className="space-y-2 md:space-y-3"
            role="group"
            aria-labelledby={`question-${question.id}-heading`}
            aria-describedby={`question-${question.id}-description`}
          >
            <p 
              id={`question-${question.id}-description`}
              className="sr-only"
            >
              Esta é uma questão de múltipla escolha. Você pode selecionar mais de uma alternativa.
            </p>
            
            {question.options.map((option, index) => {
              const optionId = `option-checkbox-${option.id}`;
              const isSelected = Array.isArray(selectedOption) && selectedOption.includes(option.id);
              
              return (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 border border-gray-200 rounded-md p-2 md:p-3 hover:bg-gray-50"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleCheckboxChange(option.id)}
                    id={optionId}
                    aria-labelledby={`${optionId}-label`}
                    aria-checked={isSelected}
                  />
                  <Label 
                    className="flex-grow cursor-pointer text-sm md:text-base" 
                    htmlFor={optionId}
                    id={`${optionId}-label`}
                  >
                    <div className="flex">
                      <span className="font-medium mr-2" aria-hidden="true">{option.id.toUpperCase()}.</span>
                      <span>{option.text}</span>
                    </div>
                  </Label>
                  <span className="sr-only">
                    Opção {index + 1} de {question.options.length}. {isSelected ? 'Selecionada' : 'Não selecionada'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <RadioGroup 
            value={typeof selectedOption === 'string' ? selectedOption : ''} 
            onValueChange={handleRadioChange}
            className="space-y-2 md:space-y-3"
            aria-labelledby={`question-${question.id}-heading`}
          >
            {question.options.map((option, index) => {
              const optionId = `option-${option.id}`;
              const isSelected = selectedOption === option.id;
              
              return (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 border border-gray-200 rounded-md p-2 md:p-3 hover:bg-gray-50"
                >
                  <RadioGroupItem 
                    value={option.id} 
                    id={optionId}
                    aria-labelledby={`${optionId}-label`}
                  />
                  <Label 
                    className="flex-grow cursor-pointer text-sm md:text-base" 
                    htmlFor={optionId}
                    id={`${optionId}-label`}
                  >
                    <div className="flex">
                      <span className="font-medium mr-2" aria-hidden="true">{option.id.toUpperCase()}.</span>
                      <span>{option.text}</span>
                    </div>
                  </Label>
                  <span className="sr-only">
                    Opção {index + 1} de {question.options.length}. {isSelected ? 'Selecionada' : 'Não selecionada'}
                  </span>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
