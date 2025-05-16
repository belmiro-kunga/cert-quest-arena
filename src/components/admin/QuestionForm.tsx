import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  baseQuestionSchema,
  multipleChoiceSchema,
  singleChoiceSchema,
  dragAndDropSchema,
  practicalScenarioSchema,
  fillInBlankSchema,
  commandLineSchema,
  networkTopologySchema,
  questionSchema
} from '@/schemas/questionSchemas';
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
import { toast } from "@/components/ui/use-toast";

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
  const getInitialFormValues = () => {
    if (question) {
      return {
        ...question,
        correctOptions: question.type === 'multiple_choice' ? (Array.isArray(question.correctOptions) ? question.correctOptions : []) : [],
      };
    }
    // Valores padrão para uma nova questão
    return {
      type: 'single_choice',
      text: '',
      explanation: '',
      category: '',
      difficulty: 'Médio',
      tags: [],
      points: 1,
      examId,
      options: [], // Inicializar options para nova questão
      correctOptions: [], // Inicializar correctOptions como array vazio
    };
  };

  const form = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues: getInitialFormValues(),
  });

  const questionType = form.watch('type');

  // Efeito para limpar/preparar campos ao mudar o tipo da questão
  React.useEffect(() => {
    // Se mudar para multiple_choice, garantir que correctOptions seja um array
    if (questionType === 'multiple_choice') {
      if (!Array.isArray(form.getValues('correctOptions'))) {
        form.setValue('correctOptions', [], { shouldValidate: true, shouldDirty: true });
      }
    } else {
      // Para outros tipos, podemos limpar correctOptions se não for relevante
      // form.setValue('correctOptions', undefined); // Ou deixar como está, Zod deve lidar com isso
    }
  }, [questionType, form]);

  const handleSubmit = (data: Question) => {
    // Validação adicional para questões de múltipla escolha
    if (data.type === 'multiple_choice') {
      const correctOptions = data.correctOptions || []; // Certificar que é um array
      if (correctOptions.length < 2) {
        toast({
          title: "Erro de validação",
          description: "Questões de múltipla escolha devem ter pelo menos 2 opções corretas.",
          variant: "destructive",
        });
        return;
      }
    }
    
    onSubmit(data);
    form.reset(); // Resetar o formulário após o envio bem-sucedido
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset(getInitialFormValues()); // Resetar ao fechar o dialog
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{question ? 'Editar Questão' : 'Nova Questão'}</DialogTitle>
          <DialogDescription>
            {question ? 'Atualize os dados da questão' : 'Crie uma nova questão para o simulado'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs 
              value={questionType} // Controlar o valor do Tabs
              onValueChange={(value) => {
                const newType = value as QuestionType;
                form.setValue('type', newType, { shouldValidate: true });
                if (newType === 'multiple_choice') {
                  // Se já não for um array (por exemplo, vindo de outro tipo), inicializa.
                  if (!Array.isArray(form.getValues('correctOptions'))) {
                     form.setValue('correctOptions', [], { shouldValidate: true, shouldDirty: true });
                  }
                  // Sempre garantir que options também seja um array para MCQs
                  if (!Array.isArray(form.getValues('options'))){
                    form.setValue('options', [], {shouldValidate: false});
                  }
                } else {
                  // Opcional: limpar correctOptions se mudar para um tipo que não o usa
                  // form.setValue('correctOptions', undefined, { shouldValidate: false }); 
                }
              }}
            >
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

              {questionTypes.map((typeInfo) => (
                <TabsContent key={typeInfo.value} value={typeInfo.value} forceMount>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-2 mb-4">
                        <Badge variant="outline">{typeInfo.label}</Badge>
                        <p className="text-sm text-muted-foreground">{typeInfo.description}</p>
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
                        {questionType === 'multiple_choice' && (
                          <MultipleChoiceFields form={form} />
                        )}
                        {questionType === 'single_choice' && (
                          <SingleChoiceFields form={form} />
                        )}
                        {questionType === 'drag_and_drop' && (
                          <DragAndDropFields form={form} />
                        )}
                        {questionType === 'practical_scenario' && (
                          <PracticalScenarioFields form={form} />
                        )}
                        {questionType === 'fill_in_blank' && (
                          <FillInBlankFields form={form} />
                        )}
                        {questionType === 'command_line' && (
                          <CommandLineFields form={form} />
                        )}
                        {questionType === 'network_topology' && (
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
                                    <SelectItem value="Avançado">Avançado</SelectItem>
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
              <Button type="button" variant="outline" onClick={() => {
                form.reset(getInitialFormValues()); // Resetar ao cancelar
                onClose();
              }}>
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
