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
  const [activeTab, setActiveTab] = useState('privacy');

  const form = useForm<PrivacyPolicyFormValues>({
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: defaultPrivacyPolicy,
  });

  function onSubmit(data: PrivacyPolicyFormValues) {
    toast({
      title: 'Política atualizada',
      description: 'As configurações da política foram salvas com sucesso.',
    });
    console.log(data);
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
              <TabsTrigger value="terms" disabled>
                Termos de Uso
              </TabsTrigger>
              <TabsTrigger value="cookies" disabled>
                Política de Cookies
              </TabsTrigger>
              <TabsTrigger value="refund" disabled>
                Política de Reembolso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
