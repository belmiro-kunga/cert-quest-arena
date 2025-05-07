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
  const correctOption = form.watch('correctOption');

  const addOption = () => {
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [...currentOptions, '']);
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || [];
    const currentCorrectOption = form.getValues('correctOption');
    
    form.setValue('options', currentOptions.filter((_, i) => i !== index));
    
    if (currentCorrectOption === index) {
      form.setValue('correctOption', undefined);
    } else if (currentCorrectOption > index) {
      form.setValue('correctOption', currentCorrectOption - 1);
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
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                className="space-y-2"
              >
                {options.map((option, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <RadioGroupItem value={index.toString()} />

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
