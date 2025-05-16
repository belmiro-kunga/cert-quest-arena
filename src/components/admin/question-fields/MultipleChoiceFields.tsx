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
import { Plus, Trash, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MultipleChoiceFieldsProps {
  form: UseFormReturn<Question>;
}

export const MultipleChoiceFields: React.FC<MultipleChoiceFieldsProps> = ({ form }) => {
  const options = form.watch('options') || [];
  const correctOptions = form.watch('correctOptions') || [];
  const [error, setError] = useState<string | null>(null);
  const MAX_OPTIONS = 6;
  const MIN_CORRECT_OPTIONS = 2;

  useEffect(() => {
    if (!Array.isArray(form.getValues('correctOptions'))) {
      form.setValue('correctOptions', [], { shouldValidate: true, shouldDirty: true });
    }
  }, [form]);

  useEffect(() => {
    const currentCorrectOptions = form.getValues('correctOptions') || [];
    if (options.length < 2) {
      setError('Adicione pelo menos duas opções de resposta.');
    } else if (options.some((opt: string) => !opt.trim())) {
      setError('Nenhuma opção pode estar em branco.');
    } else if (currentCorrectOptions.length < MIN_CORRECT_OPTIONS) {
      setError(`Atenção: Questões de múltipla escolha devem ter pelo menos ${MIN_CORRECT_OPTIONS} opções corretas para salvar.`);
    } else {
      setError(null);
    }
  }, [options, correctOptions, form]);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) {
      setError(`Limite máximo de ${MAX_OPTIONS} opções atingido.`);
      return;
    }
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [...currentOptions, '']);
  };

  const removeOption = (indexToRemove: number) => {
    const currentOptions = form.getValues('options') || [];
    const currentCorrectOptions = form.getValues('correctOptions') || [];

    form.setValue('options', currentOptions.filter((_, i) => i !== indexToRemove));

    const newCorrectOptions = currentCorrectOptions
      .map(Number)
      .filter((correctIndex: number) => correctIndex !== indexToRemove)
      .map((correctIndex: number) => (correctIndex > indexToRemove ? correctIndex - 1 : correctIndex))
      .map(String)
      .sort((a: string, b: string) => parseInt(a) - parseInt(b));
      
    form.setValue('correctOptions', newCorrectOptions, { shouldValidate: true });
  };

  const toggleCorrectOption = (index: number) => {
    const indexStr = String(index);
    let currentCorrectOptions = form.getValues('correctOptions') || [];

    if (!Array.isArray(currentCorrectOptions)) {
      currentCorrectOptions = [];
    }

    const newCorrectOptions = currentCorrectOptions.includes(indexStr)
      ? currentCorrectOptions.filter((optIdx: string) => optIdx !== indexStr)
      : [...currentCorrectOptions, indexStr];

    newCorrectOptions.sort((a: string, b: string) => parseInt(a) - parseInt(b));
    form.setValue('correctOptions', newCorrectOptions, { shouldValidate: true, shouldDirty: true });
  };
  
  const correctCount = Array.isArray(correctOptions) ? correctOptions.length : 0;

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
      
      <Alert variant="info" className="bg-blue-50 border-blue-200 mb-4">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Selecione pelo menos {MIN_CORRECT_OPTIONS} opções corretas para questões de múltipla escolha.
        </AlertDescription>
      </Alert>

      {options.map((_, index: number) => (
        <div key={index} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name={`correctOptions`}
            render={() => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={Array.isArray(correctOptions) && correctOptions.includes(String(index))}
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
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-muted-foreground">
          {options.length === 0 ? "Adicione pelo menos duas opções de resposta" : 
          `${options.length} opção(ões) adicionada(s)`}
        </p>
        <p className={`text-sm ${correctCount < MIN_CORRECT_OPTIONS ? 'text-red-500' : 'text-green-600'}`}>
          {correctCount} opção(ões) correta(s) selecionada(s)
        </p>
      </div>
    </div>
  );
};
