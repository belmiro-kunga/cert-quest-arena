import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Simulado } from '@/services/simuladoService';
// Garantir que os campos opcionais estejam presentes

import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

// Esquema de validação usando Zod
const simuladoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  preco_usd: z.number().min(0, 'Preço não pode ser negativo'),
  is_gratis: z.boolean().default(false),
  duracao_minutos: z.number().min(1, 'Duração deve ser maior que 0'),
  nivel_dificuldade: z.enum(['Fácil', 'Médio', 'Difícil']),
  language: z.enum(['pt', 'en', 'fr', 'es']),
  categoria: z.enum(['aws', 'azure', 'gcp', 'comptia', 'cisco']),
  ativo: z.boolean().default(true),
  topicos: z.array(z.string()),
  // Campos de subscrição
  is_subscription: z.boolean().default(false),
  subscription_duration: z.number().min(1).default(90),
  subscription_price: z.number().min(0).optional(),
  subscription_currency: z.string().default('BRL')
});

type SimuladoFormValues = z.infer<typeof simuladoSchema>;

interface SimuladoFormProps {
  simulado?: Simulado;
  onSubmit: (data: SimuladoFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const normalizeLanguage = (lang: string) => lang.split('-')[0];

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
      preco_usd: simulado?.preco_usd ?? 0,
      is_gratis: simulado?.is_gratis ?? false,
      duracao_minutos: simulado?.duracao_minutos || 60,
      nivel_dificuldade: (['Fácil', 'Médio', 'Difícil'] as const).includes(simulado?.nivel_dificuldade as any)
        ? (simulado?.nivel_dificuldade as 'Fácil' | 'Médio' | 'Difícil')
        : 'Médio',
      language: (['pt', 'en', 'fr', 'es'] as const).includes(simulado?.language as any)
        ? (simulado?.language as 'pt' | 'en' | 'fr' | 'es')
        : 'pt',
      categoria: (['aws', 'azure', 'gcp', 'comptia', 'cisco'] as const).includes(simulado?.categoria as any)
        ? (simulado?.categoria as 'aws' | 'azure' | 'gcp' | 'comptia' | 'cisco')
        : 'aws',
      ativo: simulado?.ativo !== undefined ? simulado.ativo : true,
      topicos: (simulado as any)?.topicos || [''],
      // Valores padrão para subscrição
      is_subscription: simulado?.is_subscription ?? false,
      subscription_duration: simulado?.subscription_duration ?? 90,
      subscription_price: simulado?.subscription_price,
      subscription_currency: simulado?.subscription_currency ?? 'BRL'
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        // Normaliza o campo language para evitar erro no backend e garantir o tipo
        const allowedLanguages = ['pt', 'en', 'fr', 'es'] as const;
        const allowedCategories = ['aws', 'azure', 'gcp', 'comptia', 'cisco'] as const;
        const normalizedLang = normalizeLanguage(data.language);
        let precoFinal = data.preco_usd;
        if (data.is_gratis) precoFinal = 0;
        const normalized = {
          ...data,
          preco: precoFinal, // Define o campo principal de preço para o backend
          preco_usd: precoFinal,
          is_gratis: !!data.is_gratis, // Garante que is_gratis seja booleano
          language: allowedLanguages.includes(normalizedLang as any)
            ? (normalizedLang as typeof allowedLanguages[number])
            : 'pt',
          categoria: allowedCategories.includes(data.categoria as any)
            ? data.categoria
            : 'aws',
        };
        console.log('Dados normalizados para envio:', normalized);
        onSubmit(normalized);
      })}>
        <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Idioma em que o simulado será apresentado.
                  </FormDescription>
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
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="gcp">Google Cloud</SelectItem>
                      <SelectItem value="comptia">CompTIA</SelectItem>
                      <SelectItem value="cisco">Cisco</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categoria do simulado para facilitar a filtragem no frontend.
                  </FormDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="is_gratis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Simulado gratuito?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Marque se este simulado for gratuito. O campo de preço será desabilitado.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preco_usd"
              render={({ field }) => {
                // Desabilita o campo se is_gratis estiver ativado
                const isGratis = form.watch('is_gratis');
                return (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Preço"
                        {...field}
                        disabled={isGratis}
                        value={isGratis ? 0 : field.value}
                      />
                    </FormControl>
                    <FormDescription>Preço do simulado (em dólar).</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Simulado Ativo?</FormLabel>
                  <FormDescription>Se desativado, o simulado não será exibido para os usuários.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="is_subscription"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Subscrição de 90 dias</FormLabel>
                    <FormDescription>
                      Marque esta opção para oferecer este simulado como uma subscrição de 90 dias.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('is_subscription') && (
              <>
                <FormField
                  control={form.control}
                  name="subscription_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração da Subscrição (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          value={field.value || 90}
                        />
                      </FormControl>
                      <FormDescription>
                        Número de dias que o usuário terá acesso ao simulado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscription_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço da Subscrição</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Preço para acesso ao simulado durante o período da subscrição.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscription_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BRL">BRL (Real)</SelectItem>
                          <SelectItem value="USD">USD (Dólar)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Moeda para o preço da subscrição.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormField
            control={form.control}
            name="topicos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tópicos Abordados</FormLabel>
                <FormDescription>Adicione os principais tópicos abordados neste simulado.</FormDescription>
                {field.value && field.value.map((topico: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <Input
                      value={topico}
                      onChange={e => {
                        const newArr = [...field.value];
                        newArr[idx] = e.target.value;
                        field.onChange(newArr);
                      }}
                      placeholder={`Tópico ${idx + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newArr = field.value.filter((_: string, i: number) => i !== idx);
                        field.onChange(newArr.length ? newArr : ['']);
                      }}
                      disabled={field.value.length === 1}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ''])}
                  className="mt-2"
                >
                  + Adicionar Tópico
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 mt-8">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default SimuladoForm;
