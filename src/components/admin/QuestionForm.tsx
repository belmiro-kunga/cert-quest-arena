
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
import { toast } from "@/components/ui/use-toast";
import { r2Service } from '@/services/r2Service';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { transcriptionService } from '@/services/transcriptionService';
import { useToast } from '@/components/ui/use-toast';
import { QuestionAudioPlayer } from '@/components/QuestionAudioPlayer';

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

// Simplified schema for the form
const questionFormSchema = z.object({
  type: z.enum(['multiple_choice', 'single_choice', 'drag_and_drop', 'practical_scenario', 'fill_in_blank', 'command_line', 'network_topology']),
  text: z.string().min(1, 'O texto da questão é obrigatório'),
  explanation: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  tags: z.array(z.string()).optional(),
  points: z.number().min(1).default(1),
  url_referencia: z.string().optional(),
  audioExplanationUrl: z.string().optional(),
  options: z.array(z.string()).optional(),
  correctOptions: z.array(z.string()).optional(),
  correctOption: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

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
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(question?.audioExplanationUrl || '');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');

  const handleAudioUpload = async (file: File) => {
    try {
      setUploadingAudio(true);
      const audioUrl = await r2Service.uploadAudio(file);
      setAudioUrl(audioUrl);
      form.setValue('audioExplanationUrl', audioUrl);
      setAudioFile(file);
      
      // Carregar transcrição automaticamente
      const transcriptionResult = await transcriptionService.transcribeAudio(audioUrl);
      setTranscription(transcriptionResult.text);
      setSummary(await transcriptionService.generateSummary(transcriptionResult.text));
      
      toast({
        title: 'Sucesso',
        description: 'Áudio de explicação carregado e transcrição gerada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao carregar áudio:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar o áudio de explicação.',
        variant: 'destructive',
      });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleAudioRemove = async () => {
    if (!audioUrl) return;

    try {
      await r2Service.deleteAudio(audioUrl);
      setAudioUrl('');
      form.setValue('audioExplanationUrl', '');
      setAudioFile(null);
      setTranscription('');
      setSummary('');
      toast({
        title: 'Sucesso',
        description: 'Áudio de explicação removido com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao remover áudio:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover o áudio de explicação.',
        variant: 'destructive',
      });
    }
  };

  const getInitialFormValues = (): QuestionFormData => {
    if (question) {
      return {
        type: question.type,
        text: question.text,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        tags: question.tags || [],
        points: question.points,
        url_referencia: question.url_referencia,
        audioExplanationUrl: question.audioExplanationUrl,
        options: question.type === 'multiple_choice' || question.type === 'single_choice' 
          ? (question as any).options || [] 
          : [],
        correctOptions: question.type === 'multiple_choice' 
          ? (question as any).correctOptions || [] 
          : [],
        correctOption: question.type === 'single_choice' 
          ? (question as any).correctOption || '' 
          : '',
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
      options: [],
      correctOptions: [],
    };
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: getInitialFormValues(),
  });

  const questionType = form.watch('type');

  const handleSubmit = (data: QuestionFormData) => {
    // Convert form data to Question type
    let questionData: Question;
    
    const baseQuestion = {
      id: question?.id || '',
      examId: examId,
      text: data.text,
      explanation: data.explanation || '',
      category: data.category || '',
      difficulty: data.difficulty,
      tags: data.tags || [],
      points: data.points,
      url_referencia: data.url_referencia,
      audioExplanationUrl: data.audioExplanationUrl,
    };

    if (data.type === 'multiple_choice') {
      questionData = {
        ...baseQuestion,
        type: 'multiple_choice',
        options: data.options || [],
        correctOptions: data.correctOptions || [],
      } as Question;
    } else if (data.type === 'single_choice') {
      questionData = {
        ...baseQuestion,
        type: 'single_choice',
        options: data.options || [],
        correctOption: data.correctOption || '',
      } as Question;
    } else {
      // For other question types, create basic structure
      questionData = {
        ...baseQuestion,
        type: data.type,
      } as Question;
    }

    onSubmit(questionData);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset(getInitialFormValues());
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
              value={questionType}
              onValueChange={(value) => {
                const newType = value as QuestionType;
                form.setValue('type', newType, { shouldValidate: true });
              }}
            >
              <TabsList className="grid grid-cols-4 gap-4">
                {questionTypes.slice(0, 4).map((type) => (
                  <TabsTrigger
                    key={type.value}
                    value={type.value}
                    className="data-[state=active]:border-primary"
                  >
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {questionTypes.slice(0, 4).map((typeInfo) => (
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

                        <FormField
                          control={form.control}
                          name="explanation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Explicação</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Digite a explicação da questão..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Explicação detalhada da questão e resposta correta
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          name="points"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pontos</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
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
