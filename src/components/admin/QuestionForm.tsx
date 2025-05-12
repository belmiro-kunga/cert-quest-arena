import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question, QuestionType } from '@/types/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const questionTypes: { value: QuestionType; label: string; description: string }[] = [
  {
    value: 'multiple_choice',
    label: 'Múltipla Escolha',
    description: 'Questão com várias opções onde mais de uma pode estar correta'
  },
  {
    value: 'single_choice',
    label: 'Escolha Única',
    description: 'Questão com várias opções onde apenas uma está correta'
  },
  {
    value: 'drag_and_drop',
    label: 'Arrastar e Soltar',
    description: 'Organize itens em categorias corretas'
  },
  {
    value: 'practical_scenario',
    label: 'Cenário Prático',
    description: 'Resolva um problema prático em um ambiente simulado'
  },
  {
    value: 'fill_in_blank',
    label: 'Preencher Lacunas',
    description: 'Complete os espaços em branco com as respostas corretas'
  },
  {
    value: 'command_line',
    label: 'Linha de Comando',
    description: 'Execute comandos específicos em um terminal'
  },
  {
    value: 'network_topology',
    label: 'Topologia de Rede',
    description: 'Configure e solucione problemas em uma topologia de rede'
  }
];

const baseQuestionSchema = z.object({
  text: z.string().min(1, 'O enunciado é obrigatório'),
  explanation: z.string().min(1, 'A explicação é obrigatória'),
  category: z.string().min(1, 'A categoria é obrigatória'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  tags: z.array(z.string()),
  points: z.number().min(1, 'A pontuação deve ser maior que 0'),
  url_referencia: z.string().optional(),
  referencia_ativa: z.boolean().optional().default(true),
});

const multipleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal('multiple_choice'),
  options: z.array(z.string()).min(2, 'Adicione pelo menos 2 opções'),
  correctOptions: z.array(z.number()).min(1, 'Selecione pelo menos uma opção correta'),
});

const singleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal('single_choice'),
  options: z.array(z.string()).min(2, 'Adicione pelo menos 2 opções'),
  correctOption: z.number(),
});

const dragAndDropSchema = baseQuestionSchema.extend({
  type: z.literal('drag_and_drop'),
  items: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, 'O texto do item é obrigatório'),
    category: z.string().min(1, 'A categoria é obrigatória'),
  })).min(2, 'Adicione pelo menos 2 itens'),
  correctPlacements: z.array(z.object({
    itemId: z.string(),
    targetCategory: z.string(),
  })).min(1, 'Defina pelo menos uma categoria para os itens'),
});

const practicalScenarioSchema = baseQuestionSchema.extend({
  type: z.literal('practical_scenario'),
  scenario: z.object({
    description: z.string(),
    initialState: z.any(),
    expectedOutcome: z.any(),
    validationSteps: z.array(z.object({
      description: z.string(),
      validator: z.string(),
    })),
  }),
});

const fillInBlankSchema = baseQuestionSchema.extend({
  type: z.literal('fill_in_blank'),
  blanks: z.array(z.object({
    id: z.string(),
    correctAnswers: z.array(z.string()),
    caseSensitive: z.boolean(),
  })),
});

const commandLineSchema = baseQuestionSchema.extend({
  type: z.literal('command_line'),
  environment: z.enum(['linux', 'windows', 'cisco_ios', 'aws_cli']),
  initialState: z.string(),
  expectedCommands: z.array(z.string()),
  validationScript: z.string(),
});

const networkTopologySchema = baseQuestionSchema.extend({
  type: z.literal('network_topology'),
  topology: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      type: z.enum(['router', 'switch', 'host', 'firewall', 'cloud']),
      config: z.any(),
    })),
    connections: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(['ethernet', 'serial', 'fiber', 'wireless']),
    })),
  }),
  tasks: z.array(z.object({
    description: z.string(),
    validator: z.string(),
  })),
});

const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceSchema,
  singleChoiceSchema,
  dragAndDropSchema,
  practicalScenarioSchema,
  fillInBlankSchema,
  commandLineSchema,
  networkTopologySchema,
]);

interface QuestionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Question) => void;
  question?: Question;
  examId: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  open,
  onClose,
  onSubmit,
  question,
  examId,
}) => {
  const form = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues: question || {
      type: 'single_choice',
      text: '',
      explanation: '',
      category: '',
      difficulty: 'Médio',
      tags: [],
      points: 1,
      examId,
    },
  });

  const questionType = form.watch('type');

  const handleSubmit = (data: Question) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{question ? 'Editar Questão' : 'Nova Questão'}</DialogTitle>
          <DialogDescription>
            {question ? 'Atualize os dados da questão' : 'Crie uma nova questão para o simulado'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue={questionType} onValueChange={(value) => form.setValue('type', value as QuestionType)}>
              <TabsList className="grid grid-cols-4 gap-4">
                {questionTypes.map((type) => (
                  <TabsTrigger
                    key={type.value}
                    value={type.value}
                    className="data-[state=active]:border-primary"
                  >
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {questionTypes.map((type) => (
                <TabsContent key={type.value} value={type.value}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-2 mb-4">
                        <Badge variant="outline">{type.label}</Badge>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enunciado</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Digite o enunciado da questão..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Campos específicos para cada tipo de questão */}
                        {type.value === 'multiple_choice' && (
                          <MultipleChoiceFields form={form} />
                        )}
                        {type.value === 'single_choice' && (
                          <SingleChoiceFields form={form} />
                        )}
                        {type.value === 'drag_and_drop' && (
                          <DragAndDropFields form={form} />
                        )}
                        {type.value === 'practical_scenario' && (
                          <PracticalScenarioFields form={form} />
                        )}
                        {type.value === 'fill_in_blank' && (
                          <FillInBlankFields form={form} />
                        )}
                        {type.value === 'command_line' && (
                          <CommandLineFields form={form} />
                        )}
                        {type.value === 'network_topology' && (
                          <NetworkTopologyFields form={form} />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Redes, Segurança..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dificuldade</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione a dificuldade" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Fácil">Fácil</SelectItem>
                                    <SelectItem value="Médio">Médio</SelectItem>
                                    <SelectItem value="Difícil">Difícil</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="explanation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Explicação</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explique a resposta correta..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Esta explicação será mostrada ao aluno após responder a questão
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="points"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pontuação</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Quantidade de pontos que esta questão vale
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Campo URL de Referência */}
                        <FormField
                          control={form.control}
                          name="url_referencia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL de Referência</FormLabel>
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder="https://exemplo.com/material-ou-documentacao"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Link para material de apoio ou documentação oficial. Caso não queira disponibilizar referência, deixe em branco ou desative abaixo.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Toggle para ativar/desativar botão de referência */}
                        <FormField
                          control={form.control}
                          name="referencia_ativa"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 mt-2">
                              <FormLabel>Ativar botão de referência</FormLabel>
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={e => field.onChange(e.target.checked)}
                                  className="ml-2 w-4 h-4"
                                />
                              </FormControl>
                              <FormDescription>
                                Se desativado, o botão de referência não aparecerá para o aluno, mesmo que o link esteja preenchido.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {question ? 'Atualizar' : 'Criar'} Questão
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Importação dos componentes específicos
import { MultipleChoiceFields } from './question-fields/MultipleChoiceFields';
import { SingleChoiceFields } from './question-fields/SingleChoiceFields';
import { DragAndDropFields } from './question-fields/DragAndDropFields';
import { PracticalScenarioFields } from './question-fields/PracticalScenarioFields';
import { FillInBlankFields } from './question-fields/FillInBlankFields';
import { CommandLineFields } from './question-fields/CommandLineFields';
import { NetworkTopologyFields } from './question-fields/NetworkTopologyFields';
