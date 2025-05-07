import React from 'react';
import { Question } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionAnswerProps {
  question: Question;
  answer: {
    isCorrect?: boolean;
    partialScore?: number;
    details?: string;
    command?: string;
    output?: string;
  } | string[] | string;
  showCorrect?: boolean;
}

export const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  question,
  answer,
  showCorrect = false,
}) => {
  const renderMultipleChoice = () => {
    if (question.type !== 'multiple_choice') return null;
    
    const options = question.options || [];
    const selectedOptions = new Set(Array.isArray(answer) ? answer.map(String) : []);
    const correctOptions = new Set(question.correctOptions || []);

    return (
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOptions.has(option);
          const isCorrect = correctOptions.has(option);
          const showAsCorrect = showCorrect && isCorrect;
          const showAsIncorrect = !showCorrect && isSelected && !isCorrect;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg",
                isSelected && "bg-muted",
                showAsCorrect && "text-green-500",
                showAsIncorrect && "text-red-500"
              )}
            >
              {showAsCorrect && <CheckCircle2 className="w-4 h-4" />}
              {showAsIncorrect && <XCircle className="w-4 h-4" />}
              <span>{option}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSingleChoice = () => {
    if (question.type !== 'single_choice') return null;
    
    const options = question.options || [];
    const selectedOption = typeof answer === 'string' ? String(answer) : '';
    const correctOption = question.correctOption;

    return (
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = correctOption === option;
          const showAsCorrect = showCorrect && isCorrect;
          const showAsIncorrect = !showCorrect && isSelected && !isCorrect;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg",
                isSelected && "bg-muted",
                showAsCorrect && "text-green-500",
                showAsIncorrect && "text-red-500"
              )}
            >
              {showAsCorrect && <CheckCircle2 className="w-4 h-4" />}
              {showAsIncorrect && <XCircle className="w-4 h-4" />}
              <span>{option}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDragAndDrop = () => {
    if (question.type !== 'drag_and_drop') return null;
    
    const items = question.items || [];
    const placements = typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
    const correctPlacements = question.correctPlacements || [];

    // Agrupa itens por categoria
    const itemsByCategory = items.reduce((acc, item) => {
      const category = placements[item.id] || 'Não categorizado';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    return (
      <div className="space-y-4">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium">{category}</h4>
            <div className="space-y-1">
              {categoryItems.map(item => {
                const correctPlacement = correctPlacements.find(p => p.itemId === item.id);
                const isCorrect = correctPlacement?.targetCategory === category;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg bg-muted",
                      showCorrect
                        ? isCorrect ? "text-green-500" : "text-red-500"
                        : undefined
                    )}
                  >
                    {showCorrect && (
                      isCorrect
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <XCircle className="w-4 h-4" />
                    )}
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFillInBlank = () => {
    if (question.type !== 'fill_in_blank') return null;
    
    const blanks = question.blanks || [];
    const answers = Array.isArray(answer) ? answer : [];

    return (
      <div className="space-y-2">
        {blanks.map((blank, index) => {
          const userAnswer = answers[index] || '';
          const isCorrect = blank.correctAnswers.some(correct =>
            blank.caseSensitive
              ? correct === userAnswer
              : correct.toLowerCase() === userAnswer.toLowerCase()
          );

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg bg-muted",
                showCorrect
                  ? isCorrect ? "text-green-500" : "text-red-500"
                  : undefined
              )}
            >
              {showCorrect && (
                isCorrect
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <XCircle className="w-4 h-4" />
              )}
              <span>Lacuna {index + 1}: {userAnswer}</span>
              {showCorrect && !isCorrect && (
                <span className="text-sm text-muted-foreground">
                  (Respostas aceitas: {blank.correctAnswers.join(', ')})
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPracticalScenario = () => {
    if (question.type !== 'practical_scenario') return null;
    
    if (typeof answer !== 'object' || Array.isArray(answer)) return null;
    const typedAnswer = answer as { isCorrect?: boolean; partialScore?: number; details?: string; };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={typedAnswer.isCorrect ? "success" : "destructive"}>
            {typedAnswer.isCorrect ? "Correto" : "Incorreto"}
          </Badge>
          {typedAnswer.partialScore && typedAnswer.partialScore < 1 && (
            <Badge variant="outline">
              Pontuação Parcial: {(typedAnswer.partialScore * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
        {typedAnswer.details && (
          <pre className="p-4 bg-muted rounded-lg text-sm">
            {typedAnswer.details}
          </pre>
        )}
      </div>
    );
  };

  const renderCommandLine = () => {
    if (question.type !== 'command_line') return null;
    
    if (typeof answer !== 'object' || Array.isArray(answer)) return null;
    const typedAnswer = answer as { isCorrect?: boolean; command?: string; output?: string; };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={typedAnswer.isCorrect ? "success" : "destructive"}>
            {typedAnswer.isCorrect ? "Correto" : "Incorreto"}
          </Badge>
        </div>
        {typedAnswer.command && (
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono">
            $ {typedAnswer.command}
          </pre>
        )}
        {typedAnswer.output && (
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono">
            {typedAnswer.output}
          </pre>
        )}
      </div>
    );
  };

  const renderNetworkTopology = () => {
    if (question.type !== 'network_topology') return null;
    
    if (typeof answer !== 'object' || Array.isArray(answer)) return null;
    const typedAnswer = answer as { isCorrect?: boolean; partialScore?: number; details?: string; };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={typedAnswer.isCorrect ? "success" : "destructive"}>
            {typedAnswer.isCorrect ? "Configuração Correta" : "Configuração Incorreta"}
          </Badge>
          {typedAnswer.partialScore && typedAnswer.partialScore < 1 && (
            <Badge variant="outline">
              Pontuação Parcial: {(typedAnswer.partialScore * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
        {typedAnswer.details && (
          <pre className="p-4 bg-muted rounded-lg text-sm">
            {typedAnswer.details}
          </pre>
        )}
      </div>
    );
  };

  switch (question.type) {
    case 'multiple_choice':
      return renderMultipleChoice();
    case 'single_choice':
      return renderSingleChoice();
    case 'drag_and_drop':
      return renderDragAndDrop();
    case 'fill_in_blank':
      return renderFillInBlank();
    case 'practical_scenario':
      return renderPracticalScenario();
    case 'command_line':
      return renderCommandLine();
    case 'network_topology':
      return renderNetworkTopology();
    default:
      return null;
  }
};
