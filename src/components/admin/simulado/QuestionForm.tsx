import React, { useState } from 'react';
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
import type { Questao, Alternativa } from '@/types/simulado';

const questionTypes: { value: Questao['tipo']; label: string; description: string }[] = [
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
    description: 'Questão onde o usuário deve arrastar itens para categorias corretas'
  },
  {
    value: 'practical_scenario',
    label: 'Cenário Prático',
    description: 'Questão baseada em um cenário real com múltiplas etapas'
  },
  {
    value: 'fill_in_blank',
    label: 'Preencher Lacunas',
    description: 'Questão onde o usuário deve preencher espaços em branco'
  },
  {
    value: 'command_line',
    label: 'Linha de Comando',
    description: 'Questão onde o usuário deve fornecer comandos de terminal'
  },
  {
    value: 'network_topology',
    label: 'Topologia de Rede',
    description: 'Questão relacionada à configuração de redes'
  }
];

const formSchema = z.object({
  text: z.string().min(1, 'O texto da questão é obrigatório'),
  type: z.enum(['multiple_choice', 'single_choice', 'drag_and_drop', 'practical_scenario', 'fill_in_blank', 'command_line', 'network_topology']),
  explanation: z.string().optional(),
  url_referencia: z.string().url('Insira uma URL válida').optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  points: z.number().min(1).default(1),
  tags: z.array(z.string()).optional(),
});

interface QuestionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BaseQuestion) => void;
  question?: BaseQuestion | null;
  examId: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  open,
  onClose,
  onSubmit,
  question,
  examId,
}) => {
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>(
    question?.type === 'multiple_choice' || question?.type === 'single_choice'
      ? (question.type === 'multiple_choice'
          ? (question as any).options.map((option: string, index: number) => ({
              text: option,
              isCorrect: (question as any).correctOptions.includes(option)
            }))
          : (question as any).options.map((option: string, index: number) => ({
              text: option,
              isCorrect: option === (question as any).correctOption
            }))
        )
      : [{ text: '', isCorrect: false }]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: question?.text || '',
      type: question?.type || 'single_choice',
      explanation: question?.explanation || '',
      category: question?.category || '',
      difficulty: question?.difficulty || 'Médio',
      points: question?.points || 1,
      tags: question?.tags || [],
    }
  });

  const questionType = form.watch('type');

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index: number, isCorrect: boolean) => {
    const newOptions = [...options];
    
    if (questionType === 'single_choice') {
      // Para questões de escolha única, apenas uma opção pode estar correta
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index ? isCorrect : false;
      });
    } else {
      // Para questões de múltipla escolha, várias opções podem estar corretas
      newOptions[index].isCorrect = isCorrect;
    }
    
    setOptions(newOptions);
  };

  const onFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Preparar os dados da questão com base no tipo
    let questionData: BaseQuestion = {
      id: question?.id || '',
      examId: examId,
      type: data.type,
      text: data.text,
      explanation: data.explanation || '',
      url_referencia: data.url_referencia || '',
      category: data.category || '',
      difficulty: data.difficulty,
      points: data.points,
      tags: data.tags || []
    };

    // Adicionar dados específicos do tipo de questão
    if (data.type === 'multiple_choice') {
      (questionData as any).options = options.map(option => option.text);
      (questionData as any).correctOptions = options
        .filter(option => option.isCorrect)
        .map(option => option.text);
    } else if (data.type === 'single_choice') {
      (questionData as any).options = options.map(option => option.text);
      (questionData as any).correctOption = options.find(option => option.isCorrect)?.text || '';
    }

    onSubmit(questionData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Editar Questão' : 'Nova Questão'}</DialogTitle>
          <DialogDescription>
            {question
              ? 'Edite os detalhes da questão abaixo.'
              : 'Preencha os detalhes para criar uma nova questão.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Questão</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Resetar as opções quando o tipo de questão mudar
                      if (value === 'multiple_choice' || value === 'single_choice') {
                        setOptions([{ text: '', isCorrect: false }]);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de questão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {questionTypes.find(type => type.value === field.value)?.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto da Questão</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o texto da questão aqui..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(questionType === 'multiple_choice' || questionType === 'single_choice') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Opções</h3>
                  <Button type="button" variant="outline" onClick={handleAddOption}>
                    Adicionar Opção
                  </Button>
                </div>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type={questionType === 'single_choice' ? 'radio' : 'checkbox'}
                          checked={option.isCorrect}
                          onChange={(e) => handleCorrectOptionChange(index, e.target.checked)}
                          name={questionType === 'single_choice' ? 'correctOption' : `option-${index}`}
                        />
                        <span>Correta</span>
                      </label>
                      {options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(index)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Redes, Segurança, etc." {...field} />
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
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
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
                      placeholder="Explicação para a resposta correta..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Forneça uma explicação detalhada sobre a resposta correta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url_referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Referência</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira uma URL para documentação oficial ou material de referência sobre o tópico da questão.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

export default QuestionForm;
