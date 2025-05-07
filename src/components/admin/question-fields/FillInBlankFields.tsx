import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Question } from '@/types/admin';
import { Plus, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface FillInBlankFieldsProps {
  form: UseFormReturn<Question>;
}

export const FillInBlankFields: React.FC<FillInBlankFieldsProps> = ({ form }) => {
  const blanks = form.watch('blanks') || [];

  const addBlank = () => {
    const currentBlanks = form.getValues('blanks') || [];
    form.setValue('blanks', [
      ...currentBlanks,
      {
        id: crypto.randomUUID(),
        correctAnswers: [''],
        caseSensitive: false,
      }
    ]);
  };

  const removeBlank = (id: string) => {
    const currentBlanks = form.getValues('blanks') || [];
    form.setValue('blanks', currentBlanks.filter(blank => blank.id !== id));
  };

  const addAnswer = (blankId: string) => {
    const currentBlanks = form.getValues('blanks') || [];
    const blankIndex = currentBlanks.findIndex(blank => blank.id === blankId);
    
    if (blankIndex === -1) return;

    const currentAnswers = currentBlanks[blankIndex].correctAnswers || [];
    const updatedBlanks = [...currentBlanks];
    updatedBlanks[blankIndex] = {
      ...updatedBlanks[blankIndex],
      correctAnswers: [...currentAnswers, '']
    };
    
    form.setValue('blanks', updatedBlanks);
  };

  const removeAnswer = (blankId: string, answerIndex: number) => {
    const currentBlanks = form.getValues('blanks') || [];
    const blankIndex = currentBlanks.findIndex(blank => blank.id === blankId);
    
    if (blankIndex === -1) return;

    const currentAnswers = currentBlanks[blankIndex].correctAnswers || [];
    const updatedBlanks = [...currentBlanks];
    updatedBlanks[blankIndex] = {
      ...updatedBlanks[blankIndex],
      correctAnswers: currentAnswers.filter((_, i) => i !== answerIndex)
    };
    
    form.setValue('blanks', updatedBlanks);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto com Lacunas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Digite o texto com marcadores [blank-X] para as lacunas..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Use [blank-1], [blank-2], etc. para marcar as lacunas no texto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Lacunas</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBlank}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Lacuna
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {blanks.map((blank, blankIndex) => (
            <Card key={blank.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Lacuna {blankIndex + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlank(blank.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {blank.correctAnswers?.map((_, answerIndex) => (
                      <div key={answerIndex} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`blanks.${blankIndex}.correctAnswers.${answerIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={`Resposta ${answerIndex + 1}`}
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
                          onClick={() => removeAnswer(blank.id, answerIndex)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAnswer(blank.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Resposta
                  </Button>

                  <FormField
                    control={form.control}
                    name={`blanks.${blankIndex}.caseSensitive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Diferenciar Maiúsculas/Minúsculas</FormLabel>
                          <FormDescription>
                            Se ativado, "Resposta" e "resposta" serão consideradas diferentes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blanks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Adicione lacunas para o aluno preencher
          </p>
        )}
      </div>
    </div>
  );
};
