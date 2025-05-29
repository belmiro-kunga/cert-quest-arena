
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Schemas para diferentes tipos de políticas
const termsOfServiceSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  version: z.string().min(1, 'Versão é obrigatória'),
  enabled: z.boolean(),
  lastUpdated: z.string().optional(),
});

const privacyPolicySchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  version: z.string().min(1, 'Versão é obrigatória'),
  enabled: z.boolean(),
  lastUpdated: z.string().optional(),
});

const cookiePolicySchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  version: z.string().min(1, 'Versão é obrigatória'),
  enabled: z.boolean(),
  customization: z.object({
    headerText: z.string(),
    acceptButtonText: z.string(),
    rejectButtonText: z.string(),
    popupMessage: z.string(),
  }),
  cookieTypes: z.array(z.object({
    name: z.string(),
    description: z.string(),
    required: z.boolean(),
    enabled: z.boolean(),
  })),
  lastUpdated: z.string().optional(),
});

type TermsOfServiceFormValues = z.infer<typeof termsOfServiceSchema>;
type PrivacyPolicyFormValues = z.infer<typeof privacyPolicySchema>;
type CookiePolicyFormValues = z.infer<typeof cookiePolicySchema>;

// Valores padrão para Terms of Service
const termsDefaultValues: Partial<TermsOfServiceFormValues> = {
  content: `TERMOS DE SERVIÇO

1. ACEITAÇÃO DOS TERMOS
Ao acessar e usar este serviço, você aceita e concorda em ficar vinculado aos termos e condições deste acordo.

2. USO DO SERVIÇO
Você pode usar nosso serviço para fins legais apenas. Você concorda em não usar o serviço:
- Para qualquer finalidade ilegal ou não autorizada
- Para violar quaisquer leis locais, estaduais, nacionais ou internacionais
- Para transmitir ou obter envio de material publicitário não solicitado

3. CONTAS DE USUÁRIO
Quando você cria uma conta conosco, deve fornecer informações precisas, completas e atuais.

4. PROPRIEDADE INTELECTUAL
O serviço e seu conteúdo original, recursos e funcionalidade são e permanecerão propriedade exclusiva da empresa.

5. RESCISÃO
Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo.

6. LIMITAÇÃO DE RESPONSABILIDADE
Em nenhum caso a empresa será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos.

7. LEI APLICÁVEL
Estes Termos serão interpretados e regidos de acordo com as leis do país, sem considerar suas disposições de conflito de leis.

8. ALTERAÇÕES
Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento.`,
  version: '1.0',
  enabled: true,
  lastUpdated: new Date().toISOString(),
};

// Valores padrão para Privacy Policy
const privacyDefaultValues: Partial<PrivacyPolicyFormValues> = {
  content: `POLÍTICA DE PRIVACIDADE

1. INFORMAÇÕES QUE COLETAMOS
Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, faz uma compra ou entra em contato conosco.

2. COMO USAMOS SUAS INFORMAÇÕES
Usamos as informações que coletamos para:
- Fornecer, manter e melhorar nossos serviços
- Processar transações e enviar confirmações relacionadas
- Enviar informações técnicas, atualizações, alertas de segurança e mensagens administrativas

3. COMPARTILHAMENTO DE INFORMAÇÕES
Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros.

4. SEGURANÇA DOS DADOS
Implementamos uma variedade de medidas de segurança para manter a segurança de suas informações pessoais.

5. COOKIES
Usamos cookies para melhorar sua experiência em nosso site. Você pode escolher definir seu navegador para recusar cookies.

6. ALTERAÇÕES NA POLÍTICA
Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos sobre quaisquer alterações.

7. CONTATO
Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco.`,
  version: '1.0',
  enabled: true,
  lastUpdated: new Date().toISOString(),
};

// Valores padrão para Cookie Policy
export const defaultCookiePolicy: Partial<CookiePolicyFormValues> = {
  content: `POLÍTICA DE COOKIES

1. O QUE SÃO COOKIES
Cookies são pequenos arquivos de texto que são colocados no seu computador ou dispositivo móvel quando você visita um site.

2. COMO USAMOS COOKIES
Usamos cookies para:
- Lembrar suas preferências e configurações
- Entender como você usa nosso site
- Melhorar nossos serviços
- Fornecer conteúdo relevante

3. TIPOS DE COOKIES
- Cookies essenciais: Necessários para o funcionamento do site
- Cookies de performance: Nos ajudam a entender como os visitantes interagem com o site
- Cookies de funcionalidade: Permitem que o site lembre das escolhas que você faz
- Cookies de marketing: Usados para rastrear visitantes em sites

4. GERENCIAR COOKIES
Você pode controlar e/ou deletar cookies como desejar através das configurações do seu navegador.

5. CONTATO
Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco.`,
  version: '1.0',
  enabled: true,
  customization: {
    headerText: 'Este site usa cookies',
    acceptButtonText: 'Aceitar todos',
    rejectButtonText: 'Rejeitar todos',
    popupMessage: 'Usamos cookies para melhorar sua experiência em nosso site.',
  },
  cookieTypes: [
    {
      name: 'Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      required: true,
      enabled: true,
    },
    {
      name: 'Analytics',
      description: 'Nos ajudam a entender como você usa o site',
      required: false,
      enabled: false,
    },
    {
      name: 'Marketing',
      description: 'Usados para mostrar anúncios relevantes',
      required: false,
      enabled: false,
    },
  ],
  lastUpdated: new Date().toISOString(),
};

export function PoliciesSettings() {
  const termsForm = useForm<TermsOfServiceFormValues>({
    resolver: zodResolver(termsOfServiceSchema),
    defaultValues: termsDefaultValues,
  });

  const privacyForm = useForm<PrivacyPolicyFormValues>({
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: privacyDefaultValues,
  });

  const cookieForm = useForm<CookiePolicyFormValues>({
    resolver: zodResolver(cookiePolicySchema),
    defaultValues: defaultCookiePolicy,
  });

  function onTermsSubmit(data: TermsOfServiceFormValues) {
    toast({
      title: 'Termos de Serviço atualizados',
      description: 'Os termos de serviço foram atualizados com sucesso.',
    });
    console.log('Terms of Service:', data);
  }

  function onPrivacySubmit(data: PrivacyPolicyFormValues) {
    toast({
      title: 'Política de Privacidade atualizada',
      description: 'A política de privacidade foi atualizada com sucesso.',
    });
    console.log('Privacy Policy:', data);
  }

  function onCookieSubmit(data: CookiePolicyFormValues) {
    toast({
      title: 'Política de Cookies atualizada',
      description: 'A política de cookies foi atualizada com sucesso.',
    });
    console.log('Cookie Policy:', data);
  }

  return (
    <div className="space-y-8">
      {/* Termos de Serviço */}
      <Card>
        <CardHeader>
          <CardTitle>Termos de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...termsForm}>
            <form onSubmit={termsForm.handleSubmit(onTermsSubmit)} className="space-y-6">
              <FormField
                control={termsForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar Termos de Serviço</FormLabel>
                      <FormDescription>
                        Exibir termos de serviço no site
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo dos Termos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo dos termos de serviço..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar Termos de Serviço</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Política de Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle>Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...privacyForm}>
            <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
              <FormField
                control={privacyForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar Política de Privacidade</FormLabel>
                      <FormDescription>
                        Exibir política de privacidade no site
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
                control={privacyForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo da Política</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo da política de privacidade..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar Política de Privacidade</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Política de Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>Política de Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...cookieForm}>
            <form onSubmit={cookieForm.handleSubmit(onCookieSubmit)} className="space-y-6">
              <FormField
                control={cookieForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar Banner de Cookies</FormLabel>
                      <FormDescription>
                        Exibir banner de consentimento de cookies
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo da Política de Cookies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo da política de cookies..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar Política de Cookies</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
