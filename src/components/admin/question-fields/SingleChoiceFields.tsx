import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question } from '@/types/admin';
import { Plus, Trash } from 'lucide-react';

interface SingleChoiceFieldsProps {
  form: UseFormReturn<Question>;
}

export const SingleChoiceFields: React.FC<SingleChoiceFieldsProps> = ({ form }) => {
  const options = form.watch('options') || [];
  const correctOption = form.watch('correctOption') || '';
  const [error, setError] = useState<string | null>(null);
  const MAX_OPTIONS = 6;

  // Validação ao tentar submeter
  useEffect(() => {
    if (options.length < 2) {
      setError('Adicione pelo menos duas opções de resposta.');
    } else if (options.some((opt: string) => !opt.trim())) {
      setError('Nenhuma opção pode estar em branco.');
    } else if (correctOption === '' || correctOption === undefined || correctOption === null) {
      setError('Selecione a opção correta.');
    } else {
      setError(null);
    }
  }, [options, correctOption]);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) {
      setError(`Limite máximo de ${MAX_OPTIONS} opções atingido.`);
      return;
    }
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [...currentOptions, '']);
    if (!correctOption && currentOptions.length === 0) {
      form.setValue('correctOption', '0');
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || [];
    const currentCorrectOption = form.getValues('correctOption');
    form.setValue('options', currentOptions.filter((_, i) => i !== index));
    if (correctOption === String(index)) {
      form.setValue('correctOption', '');
    } else if (parseInt(correctOption, 10) > index) {
      form.setValue('correctOption', String(parseInt(correctOption, 10) - 1));
    }
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

      <FormField
        control={form.control}
        name="correctOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel id="correct-option-label">Selecione a resposta correta:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-2"
                aria-labelledby="correct-option-label"
                role="radiogroup"
              >
                {options.map((option: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value={String(index)}
                          id={`option-radio-${index}`}
                          aria-label={`Selecionar opção ${index + 1}: ${option || 'em branco'}`}
                        />
                      </FormControl>
                    </FormItem>
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
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
