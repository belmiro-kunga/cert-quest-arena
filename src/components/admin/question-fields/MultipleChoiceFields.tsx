import React from 'react';
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

  const addOption = () => {
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
        .filter(optionIndex => optionIndex !== index)
        .map(optionIndex => optionIndex > index ? optionIndex - 1 : optionIndex)
    );
  };

  const toggleCorrectOption = (index: number) => {
    const currentCorrectOptions = form.getValues('correctOptions') || [];
    const isCorrect = currentCorrectOptions.includes(index);
    
    form.setValue(
      'correctOptions',
      isCorrect
        ? currentCorrectOptions.filter(i => i !== index)
        : [...currentCorrectOptions, index].sort()
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Opções</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Opção
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name={`correctOptions.${index}`}
            render={() => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={correctOptions.includes(index)}
                    onCheckedChange={() => toggleCorrectOption(index)}
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
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Adicione pelo menos duas opções de resposta
        </p>
      )}
    </div>
  );
};
