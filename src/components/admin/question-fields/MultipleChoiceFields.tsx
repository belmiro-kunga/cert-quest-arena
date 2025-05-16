import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question } from '@/types/admin';
import { Plus, Trash } from 'lucide-react';

interface MultipleChoiceFieldsProps {
  form: UseFormReturn<Question>;
}

export const MultipleChoiceFields: React.FC<MultipleChoiceFieldsProps> = ({ form }) => {
  const options = form.watch('options') || [];
  const correctOptions = form.watch('correctOptions') || [];
  const [error, setError] = useState<string | null>(null);
  const MAX_OPTIONS = 6;

  // Validação ao tentar submeter
  useEffect(() => {
    if (options.length < 2) {
      setError('Adicione pelo menos duas opções de resposta.');
    } else if (options.some((opt: string) => !opt.trim())) {
      setError('Nenhuma opção pode estar em branco.');
    } else if (!correctOptions || correctOptions.length === 0) {
      setError('Selecione pelo menos uma opção correta.');
    } else {
      setError(null);
    }
  }, [options, correctOptions]);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) {
      setError(`Limite máximo de ${MAX_OPTIONS} opções atingido.`);
      return;
    }
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [...currentOptions, '']);
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || [];
    const currentCorrectOptions = form.getValues('correctOptions') || [];
    form.setValue('options', currentOptions.filter((_, i) => i !== index));
    form.setValue(
      'correctOptions',
      currentCorrectOptions
        .filter((optionIndex: string) => optionIndex !== String(index))
        .map((optionIndex: string) => {
          const numIndex = parseInt(optionIndex, 10);
          return numIndex > index ? String(numIndex - 1) : optionIndex;
        })
    );
  };

  const toggleCorrectOption = (index: number) => {
    const currentCorrectOptions = form.getValues('correctOptions') || [];
    const indexStr = String(index);
    const isCorrect = currentCorrectOptions.includes(indexStr);
    form.setValue(
      'correctOptions',
      isCorrect
        ? currentCorrectOptions.filter(i => i !== indexStr)
        : [...currentCorrectOptions, indexStr].sort()
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel id="options-label">Opções</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          disabled={options.length >= MAX_OPTIONS}
          aria-label="Adicionar opção de resposta"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Opção
        </Button>
      </div>

      {options.map((option: string, index: number) => (
        <div key={index} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name={`correctOptions.${index}`}
            render={() => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={correctOptions.includes(String(index))}
                    onCheckedChange={() => toggleCorrectOption(index)}
                    aria-label={`Marcar opção ${index + 1} como correta`}
                    id={`option-checkbox-${index}`}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`options.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder={`Opção ${index + 1}`}
                    aria-label={`Texto da opção ${index + 1}`}
                    id={`option-input-${index}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeOption(index)}
            disabled={options.length <= 2}
            aria-label={`Remover opção ${index + 1}`}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-500" role="alert">{error}</p>
      )}
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Adicione pelo menos duas opções de resposta
        </p>
      )}
    </div>
  );
};
