import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { usePolicies } from '@/hooks/usePolicies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';


const cookiePolicySchema = z.object({
  enabled: z.boolean(),
  lastUpdated: z.string(),
  version: z.string(),
  content: z.string().min(1, 'O conteúdo da política é obrigatório'),
  requiresAcceptance: z.boolean(),
  showBanner: z.boolean(),
  bannerPosition: z.enum(['top', 'bottom']),
  customization: z.object({
    headerText: z.string(),
    bannerText: z.string(),
    acceptAllButtonText: z.string(),
    acceptSelectedButtonText: z.string(),
    rejectAllButtonText: z.string(),
    settingsButtonText: z.string(),
  }),
  cookieTypes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    required: z.boolean(),
    enabled: z.boolean(),
  })),
});

const defaultCookiePolicy: CookiePolicyFormValues = {
  enabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  version: '1.0',
  content: `# Política de Cookies

## 1. O que são Cookies
Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site.

## 2. Como Usamos os Cookies
Utilizamos cookies para:
- Manter sua sessão ativa
- Lembrar suas preferências
- Melhorar a navegação
- Analisar o uso do site

## 3. Tipos de Cookies

### Cookies Essenciais
- Necessários para o funcionamento básico
- Não podem ser desativados

### Cookies de Desempenho
- Coletam informações anônimas sobre o uso
- Ajudam a melhorar a experiência

### Cookies de Funcionalidade
- Lembram suas preferências
- Personalizam sua experiência

### Cookies de Marketing
- Rastreiam sua atividade entre sites
- Permitem publicidade direcionada

## 4. Gerenciamento de Cookies
- Configure suas preferências no banner
- Ajuste as configurações do navegador
- Remova cookies existentes

## 5. Atualizações
Esta política pode ser atualizada. Verifique periodicamente.`,
  requiresAcceptance: true,
  showBanner: true,
  bannerPosition: 'bottom' as const,
  customization: {
    headerText: 'Política de Cookies',
    bannerText: 'Utilizamos cookies para melhorar sua experiência. Escolha quais tipos de cookies aceitar.',
    acceptAllButtonText: 'Aceitar Todos',
    acceptSelectedButtonText: 'Aceitar Selecionados',
    rejectAllButtonText: 'Rejeitar Todos',
    settingsButtonText: 'Configurações',
  },
  cookieTypes: [
    {
      id: 'essential',
      name: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site.',
      required: true,
      enabled: true,
    },
    {
      id: 'performance',
      name: 'Cookies de Desempenho',
      description: 'Ajudam a melhorar a experiência coletando informações anônimas.',
      required: false,
      enabled: true,
    },
    {
      id: 'functional',
      name: 'Cookies de Funcionalidade',
      description: 'Permitem que o site lembre suas preferências.',
      required: false,
      enabled: true,
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Usados para rastrear visitantes entre sites para publicidade.',
      required: false,
      enabled: false,
    },
  ],
};

const termsOfUseSchema = z.object({
  enabled: z.boolean(),
  lastUpdated: z.string(),
  version: z.string(),
  content: z.string().min(1, 'O conteúdo dos termos é obrigatório'),
  requiresAcceptance: z.boolean(),
  showPopup: z.boolean(),
  popupFrequency: z.number().min(0),
  customization: z.object({
    headerText: z.string(),
    acceptButtonText: z.string(),
    rejectButtonText: z.string(),
    popupMessage: z.string(),
  }),
});

const defaultTermsOfUse = {
  enabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  version: '1.0',
  content: `# Termos de Uso

## 1. Aceitação dos Termos
Ao acessar e usar a plataforma CertQuest, você concorda com estes termos.

## 2. Elegibilidade
- Idade mínima de 18 anos
- Capacidade legal para aceitar estes termos
- Informações verdadeiras e atualizadas

## 3. Conta do Usuário
- Responsabilidade pela segurança da conta
- Informações precisas e atualizadas
- Notificação imediata de uso não autorizado

## 4. Serviços Educacionais
- Acesso aos cursos mediante pagamento
- Certificados após conclusão
- Disponibilidade do conteúdo

## 5. Propriedade Intelectual
- Direitos autorais do conteúdo
- Restrições de uso e compartilhamento
- Licença limitada de uso

## 6. Pagamentos
- Preços e taxas
- Métodos de pagamento
- Política de reembolso

## 7. Conduta do Usuário
- Comportamento adequado
- Proibições específicas
- Consequências de violações

## 8. Modificações
- Direito de alterar os termos
- Notificação de alterações
- Continuidade de uso

## 9. Limitação de Responsabilidade
- Disponibilidade do serviço
- Precisão do conteúdo
- Danos indiretos

## 10. Lei Aplicável
- Jurisdição
- Resolução de conflitos
- Foro competente`,
  requiresAcceptance: true,
  showPopup: true,
  popupFrequency: 90,
  customization: {
    headerText: 'Termos de Uso',
    acceptButtonText: 'Aceitar',
    rejectButtonText: 'Rejeitar',
    popupMessage: 'Por favor, leia e aceite nossos termos de uso para continuar.',
  },
};

const privacyPolicySchema = z.object({
  enabled: z.boolean(),
  lastUpdated: z.string(),
  version: z.string(),
  content: z.string().min(1, 'O conteúdo da política é obrigatório'),
  requiresAcceptance: z.boolean(),
  showPopup: z.boolean(),
  popupFrequency: z.number().min(0),
  customization: z.object({
    headerText: z.string(),
    acceptButtonText: z.string(),
    rejectButtonText: z.string(),
    popupMessage: z.string(),
  }),
});

type PrivacyPolicyFormValues = z.infer<typeof privacyPolicySchema>;
type TermsOfUseFormValues = z.infer<typeof termsOfUseSchema>;
type CookiePolicyFormValues = z.infer<typeof cookiePolicySchema>;

const defaultPrivacyPolicy: PrivacyPolicyFormValues = {
  enabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  version: '1.0',
  content: `# Politica de Privacidade

## 1. Introdução
Esta Politica de Privacidade descreve como coletamos, usamos e protegemos suas informacoes pessoais.

## 2. Coleta de Dados
Coletamos as seguintes informacoes:
- Nome completo
- Endereco de email
- Dados de uso da plataforma

## 3. Uso dos Dados
Utilizamos seus dados para:
- Fornecer acesso a plataforma
- Melhorar nossos servicos
- Enviar comunicacoes importantes

## 4. Protecao de Dados
Implementamos medidas de seguranca para proteger suas informacoes.

## 5. Seus Direitos
Você tem direito a:
- Acessar seus dados
- Solicitar correcoes
- Solicitar exclusao
- Retirar consentimento

## 6. Contato
Para questoes sobre privacidade: privacy@certquest.com`,
  requiresAcceptance: true,
  showPopup: true,
  popupFrequency: 90,
  customization: {
    headerText: 'Política de Privacidade',
    acceptButtonText: 'Aceitar',
    rejectButtonText: 'Rejeitar',
    popupMessage: 'Atualizamos nossa política de privacidade. Por favor, leia e aceite para continuar.',
  },
};

export function PoliciesSettings() {
  const {
    privacyPolicy,
    termsOfUse,
    cookiePolicy,
    loading,
    error,
    updatePrivacyPolicy,
    updateTermsOfUse,
    updateCookiePolicy,
  } = usePolicies();
  const [activeTab, setActiveTab] = useState('privacy');

  const cookieForm = useForm<CookiePolicyFormValues>({
    defaultValues: cookiePolicy,
    resolver: zodResolver(cookiePolicySchema),
    defaultValues: defaultCookiePolicy,
  });

  const termsForm = useForm<TermsOfUseFormValues>({
    defaultValues: termsOfUse,
    resolver: zodResolver(termsOfUseSchema),
    defaultValues: defaultTermsOfUse,
  });

  const form = useForm<PrivacyPolicyFormValues>({
    defaultValues: privacyPolicy,
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: defaultPrivacyPolicy,
  });

  const onSubmit = async (data: PrivacyPolicyFormValues | TermsOfUseFormValues | CookiePolicyFormValues, formType: 'privacy' | 'terms' | 'cookies') => {
    try {
      switch (formType) {
        case 'privacy':
          await updatePrivacyPolicy(data);
          toast({
            title: 'Sucesso',
            description: 'Política de privacidade atualizada com sucesso',
          });
          break;
        case 'terms':
          await updateTermsOfUse(data);
          toast({
            title: 'Sucesso',
            description: 'Termos de uso atualizados com sucesso',
          });
          break;
        case 'cookies':
          await updateCookiePolicy(data);
          toast({
            title: 'Sucesso',
            description: 'Política de cookies atualizada com sucesso',
          });
          break;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar as configurações',
      });
    }
  };
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Políticas da Plataforma</CardTitle>
          <CardDescription>
            Gerencie as políticas e termos da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="privacy">
                Política de Privacidade
              </TabsTrigger>
              <TabsTrigger value="terms">
                Termos de Uso
              </TabsTrigger>
              <TabsTrigger value="cookies">
                Política de Cookies
              </TabsTrigger>
              <TabsTrigger value="refund" disabled>
                Política de Reembolso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data, 'privacy'))} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versão</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastUpdated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Atualização</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo da Política</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Digite o conteúdo da política de privacidade..."
                            className="min-h-[400px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Use markdown para formatar o texto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Exibição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Ativar Política</FormLabel>
                              <FormDescription>
                                Tornar a política visível para os usuários
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

                      <FormField
                        control={form.control}
                        name="requiresAcceptance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Exigir Aceitação</FormLabel>
                              <FormDescription>
                                Usuários devem aceitar a política para usar a plataforma
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

                      <FormField
                        control={form.control}
                        name="showPopup"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Pop-up</FormLabel>
                              <FormDescription>
                                Exibir pop-up quando houver atualizações
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

                      <FormField
                        control={form.control}
                        name="popupFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência do Pop-up (dias)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Intervalo mínimo entre exibições do pop-up
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customization.headerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Cabeçalho</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customization.popupMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem do Pop-up</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customization.acceptButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto do Botão Aceitar</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customization.rejectButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto do Botão Rejeitar</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full">
                    Salvar Política de Privacidade
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="cookies">
              <Form {...cookieForm}>
                <form onSubmit={cookieForm.handleSubmit((data) => onSubmit(data, 'cookies'))} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={cookieForm.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versão</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cookieForm.control}
                      name="lastUpdated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Atualização</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={cookieForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo da Política</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Digite o conteúdo da política de cookies..."
                            className="min-h-[400px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Use markdown para formatar o texto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Tipos de Cookies</CardTitle>
                      <CardDescription>
                        Configure os tipos de cookies disponíveis na plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cookieForm.watch('cookieTypes').map((cookie, index) => (
                        <div key={cookie.id} className="flex flex-row items-start justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <div className="font-medium">{cookie.name}</div>
                            <div className="text-sm text-muted-foreground">{cookie.description}</div>
                            {cookie.required && (
                              <div className="text-sm text-muted-foreground">(Obrigatório)</div>
                            )}
                          </div>
                          <FormField
                            control={cookieForm.control}
                            name={`cookieTypes.${index}.enabled`}
                            render={({ field }) => (
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={cookie.required}
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações do Banner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={cookieForm.control}
                        name="showBanner"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Banner</FormLabel>
                              <FormDescription>
                                Exibir banner de cookies quando o usuário acessar o site
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

                      <FormField
                        control={cookieForm.control}
                        name="bannerPosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Posição do Banner</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a posição" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="top">Topo da página</SelectItem>
                                <SelectItem value="bottom">Rodapé da página</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={cookieForm.control}
                        name="customization.headerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Banner</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={cookieForm.control}
                        name="customization.bannerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Texto do Banner</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={cookieForm.control}
                          name="customization.acceptAllButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Botão Aceitar Todos</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cookieForm.control}
                          name="customization.rejectAllButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Botão Rejeitar Todos</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cookieForm.control}
                          name="customization.acceptSelectedButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Botão Aceitar Selecionados</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cookieForm.control}
                          name="customization.settingsButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Botão Configurações</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full">
                    Salvar Política de Cookies
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="terms">
              <Form {...termsForm}>
                <form onSubmit={termsForm.handleSubmit((data) => onSubmit(data, 'terms'))} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={termsForm.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versão</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={termsForm.control}
                      name="lastUpdated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Atualização</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={termsForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo dos Termos</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Digite o conteúdo dos termos de uso..."
                            className="min-h-[400px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Use markdown para formatar o texto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Exibição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={termsForm.control}
                        name="enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Ativar Termos</FormLabel>
                              <FormDescription>
                                Tornar os termos visíveis para os usuários
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

                      <FormField
                        control={termsForm.control}
                        name="requiresAcceptance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Exigir Aceitação</FormLabel>
                              <FormDescription>
                                Usuários devem aceitar os termos para usar a plataforma
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

                      <FormField
                        control={termsForm.control}
                        name="showPopup"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Pop-up</FormLabel>
                              <FormDescription>
                                Exibir pop-up quando houver atualizações
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

                      <FormField
                        control={termsForm.control}
                        name="popupFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência do Pop-up (dias)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Intervalo mínimo entre exibições do pop-up
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={termsForm.control}
                        name="customization.headerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Cabeçalho</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={termsForm.control}
                        name="customization.popupMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem do Pop-up</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={termsForm.control}
                          name="customization.acceptButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto do Botão Aceitar</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={termsForm.control}
                          name="customization.rejectButtonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto do Botão Rejeitar</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full">
                    Salvar Termos de Uso
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
