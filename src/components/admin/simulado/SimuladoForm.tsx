import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Simulado } from '@/services/simuladoService';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Esquema de validação usando Zod
const simuladoSchema = z.object({
  titulo: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }).max(255),
  descricao: z.string().optional(),
  duracao_minutos: z.coerce.number().min(1, { message: 'A duração deve ser pelo menos 1 minuto' }),
  nivel_dificuldade: z.string().optional(),
  ativo: z.boolean().default(true),
});

type SimuladoFormValues = z.infer<typeof simuladoSchema>;

interface SimuladoFormProps {
  simulado?: Simulado;
  onSubmit: (data: SimuladoFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const SimuladoForm: React.FC<SimuladoFormProps> = ({
  simulado,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  // Inicializar o formulário com os valores do simulado, se existir
  const form = useForm<SimuladoFormValues>({
    resolver: zodResolver(simuladoSchema),
    defaultValues: {
      titulo: simulado?.titulo || '',
      descricao: simulado?.descricao || '',
      duracao_minutos: simulado?.duracao_minutos || 60,
      nivel_dificuldade: simulado?.nivel_dificuldade || 'Médio',
      ativo: simulado?.ativo !== undefined ? simulado.ativo : true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do simulado" {...field} />
              </FormControl>
              <FormDescription>
                O título deve ser descritivo e informativo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite uma descrição detalhada do simulado"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva o conteúdo e objetivo do simulado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duracao_minutos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Tempo em minutos para completar o simulado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivel_dificuldade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Dificuldade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de dificuldade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  O nível de dificuldade ajuda os estudantes a escolherem simulados adequados.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status do Simulado</FormLabel>
                <FormDescription>
                  Simulados ativos são visíveis para os estudantes.
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

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {simulado ? 'Atualizar Simulado' : 'Criar Simulado'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SimuladoForm;
