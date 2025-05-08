
import React from 'react';
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

  const addOption = () => {
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [...currentOptions, '']);
    
    // Set first option as correct if none selected
    if (!correctOption && currentOptions.length === 0) {
      form.setValue('correctOption', '0');
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || [];
    const currentCorrectOption = form.getValues('correctOption');
    
    form.setValue('options', currentOptions.filter((_, i) => i !== index));
    
    // Update correctOption if removed option was selected or if it affects indexes
    if (Number(currentCorrectOption) === index) {
      form.setValue('correctOption', '');
    } else if (Number(currentCorrectOption) > index) {
      form.setValue('correctOption', String(Number(currentCorrectOption) - 1));
    }
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

      <FormField
        control={form.control}
        name="correctOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione a resposta correta:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-2"
              >
                {options.map((option, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={String(index)} />
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
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Adicione pelo menos duas opções de resposta
        </p>
      )}
    </div>
  );
};
