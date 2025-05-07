import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from '@/types/admin';
import { Plus, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface CommandLineFieldsProps {
  form: UseFormReturn<Question>;
}

const environments = [
  {
    value: 'linux',
    label: 'Linux Terminal',
    description: 'Ambiente Linux com comandos bash',
  },
  {
    value: 'windows',
    label: 'Windows PowerShell',
    description: 'Ambiente Windows com PowerShell',
  },
  {
    value: 'cisco_ios',
    label: 'Cisco IOS',
    description: 'Terminal de configuração Cisco IOS',
  },
  {
    value: 'aws_cli',
    label: 'AWS CLI',
    description: 'Interface de linha de comando da AWS',
  },
];

export const CommandLineFields: React.FC<CommandLineFieldsProps> = ({ form }) => {
  const expectedCommands = form.watch('expectedCommands') || [];

  const addCommand = () => {
    const currentCommands = form.getValues('expectedCommands') || [];
    form.setValue('expectedCommands', [...currentCommands, '']);
  };

  const removeCommand = (index: number) => {
    const currentCommands = form.getValues('expectedCommands') || [];
    form.setValue(
      'expectedCommands',
      currentCommands.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambiente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {environments.map(env => (
                        <SelectItem key={env.value} value={env.value}>
                          <div className="space-y-1">
                            <div>{env.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {env.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha o ambiente onde os comandos serão executados
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Inicial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Configure o estado inicial do ambiente..."
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Defina o estado inicial do ambiente (ex: diretórios, arquivos, variáveis)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Comandos Esperados</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCommand}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Comando
                </Button>
              </div>

              {expectedCommands.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`expectedCommands.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Comando ${index + 1}`}
                            className="font-mono"
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
                    onClick={() => removeCommand(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {expectedCommands.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione os comandos que o aluno deve executar
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="validationScript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script de Validação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Script para validar a solução..."
                      className="font-mono min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Escreva um script que valida se o aluno executou os comandos corretamente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
