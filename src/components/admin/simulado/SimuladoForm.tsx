import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Simulado } from '@/services/simuladoService';

const simuladoFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.enum(['aws', 'azure', 'gcp', 'cisco', 'comptia']),
  language: z.enum(['pt', 'en', 'fr', 'es']).default('pt'),
  preco_usd: z.number().min(0, 'Preço deve ser maior ou igual a 0').default(0),
  is_gratis: z.boolean().default(true),
  duracao_minutos: z.number().min(1, 'Duração deve ser maior que 0').default(60),
  nivel_dificuldade: z.string().default('Médio'),
  ativo: z.boolean().default(true),
  numero_questoes: z.number().min(1, 'Número de questões deve ser maior que 0').default(10),
  pontuacao_minima: z.number().min(0).max(100, 'Pontuação deve estar entre 0 e 100').default(70),
  subscription_tier: z.enum(['free', 'basic', 'premium']).default('free'),
  subscription_currency: z.string().default('USD'),
});

type SimuladoFormValues = z.infer<typeof simuladoFormSchema>;

interface SimuladoFormProps {
  simulado?: Simulado;
  onSubmit: (data: SimuladoFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const categorias = [
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud Platform' },
  { value: 'cisco', label: 'Cisco' },
  { value: 'comptia', label: 'CompTIA' },
];

const idiomas = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
];

const dificuldades = [
  { value: 'Fácil', label: 'Fácil' },
  { value: 'Médio', label: 'Médio' },
  { value: 'Difícil', label: 'Difícil' },
];

const subscriptionTiers = [
  { value: 'free', label: 'Gratuito' },
  { value: 'basic', label: 'Básico' },
  { value: 'premium', label: 'Premium' },
];

const SimuladoForm: React.FC<SimuladoFormProps> = ({
  simulado,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const form = useForm<SimuladoFormValues>({
    resolver: zodResolver(simuladoFormSchema),
    defaultValues: {
      titulo: simulado?.titulo || '',
      descricao: simulado?.descricao || '',
      categoria: simulado?.categoria || 'aws',
      language: simulado?.language || 'pt',
      preco_usd: simulado?.preco_usd || 0,
      is_gratis: simulado?.is_gratis !== undefined ? simulado.is_gratis : true,
      duracao_minutos: simulado?.duracao_minutos || 60,
      nivel_dificuldade: simulado?.nivel_dificuldade || 'Médio',
      ativo: simulado?.ativo !== undefined ? simulado.ativo : true,
      numero_questoes: simulado?.numero_questoes || 10,
      pontuacao_minima: simulado?.pontuacao_minima || 70,
      subscription_tier: simulado?.subscription_tier || 'free',
      subscription_currency: simulado?.subscription_currency || 'USD',
    },
  });

  const isGratis = form.watch('is_gratis');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: AWS Solutions Architect Associate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o simulado..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {idiomas.map((idioma) => (
                      <SelectItem key={idioma.value} value={idioma.value}>
                        {idioma.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dificuldades.map((dificuldade) => (
                      <SelectItem key={dificuldade.value} value={dificuldade.value}>
                        {dificuldade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duracao_minutos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_questoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Questões</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pontuacao_minima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontuação Mínima (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscription_tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Assinatura</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subscriptionTiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="is_gratis"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Simulado Gratuito</FormLabel>
                    <FormDescription>
                      Se ativado, o simulado será gratuito para todos os usuários
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isGratis && (
              <FormField
                control={form.control}
                name="preco_usd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Preço do simulado em dólares americanos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Simulado Ativo</FormLabel>
                    <FormDescription>
                      Se ativado, o simulado ficará visível para os usuários
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : simulado ? 'Atualizar' : 'Criar'} Simulado
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SimuladoForm;
