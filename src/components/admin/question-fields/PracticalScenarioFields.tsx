import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

interface PracticalScenarioFieldsProps {
  form: UseFormReturn<Question>;
}

export const PracticalScenarioFields: React.FC<PracticalScenarioFieldsProps> = ({ form }) => {
  const scenario = form.watch('scenario') || {
    description: '',
    initialState: {},
    expectedOutcome: {},
    validationSteps: [],
  };

  const addValidationStep = () => {
    const currentSteps = form.getValues('scenario.validationSteps') || [];
    form.setValue('scenario.validationSteps', [
      ...currentSteps,
      {
        description: '',
        validator: '',
      }
    ]);
  };

  const removeValidationStep = (index: number) => {
    const currentSteps = form.getValues('scenario.validationSteps') || [];
    form.setValue(
      'scenario.validationSteps',
      currentSteps.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="scenario.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Cenário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o cenário prático..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva detalhadamente o cenário e o que o aluno precisa fazer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scenario.initialState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Inicial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Estado inicial do ambiente em formato JSON..."
                      className="font-mono"
                      {...field}
                      value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                      onChange={e => {
                        try {
                          const value = JSON.parse(e.target.value);
                          field.onChange(value);
                        } catch {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Configure o estado inicial do ambiente em formato JSON
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scenario.expectedOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado Esperado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Resultado esperado em formato JSON..."
                      className="font-mono"
                      {...field}
                      value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                      onChange={e => {
                        try {
                          const value = JSON.parse(e.target.value);
                          field.onChange(value);
                        } catch {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Defina o estado final esperado em formato JSON
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Passos de Validação</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addValidationStep}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Passo
                </Button>
              </div>

              {scenario.validationSteps?.map((step, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Passo {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeValidationStep(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`scenario.validationSteps.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o que será validado neste passo..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`scenario.validationSteps.${index}.validator`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função de Validação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Função JavaScript para validar este passo..."
                            className="font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Escreva uma função JavaScript que retorna true se o passo foi concluído corretamente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {(!scenario.validationSteps || scenario.validationSteps.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Adicione passos para validar a solução do aluno
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
