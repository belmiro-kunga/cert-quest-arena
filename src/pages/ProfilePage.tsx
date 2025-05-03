
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreditCard, Lock, User, History, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Simulando dados do usuário
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    photo: '',
    phone: '(11) 98765-4321',
    planType: 'Freemium',
    attemptsLeft: 1,
    paymentMethod: {
      type: 'credit',
      lastFour: '4242',
      expiry: '04/25'
    },
    invoices: [
      { id: 'INV-001', date: '01/04/2025', amount: 'R$39,90', status: 'Pago' },
      { id: 'INV-002', date: '01/03/2025', amount: 'R$39,90', status: 'Pago' }
    ],
    examHistory: [
      { id: 1, cert: 'AWS Cloud Practitioner', date: '25/04/2025', score: 70, result: 'Aprovado' },
      { id: 2, cert: 'CompTIA A+', date: '20/04/2025', score: 65, result: 'Reprovado' },
      { id: 3, cert: 'AWS Cloud Practitioner', date: '18/04/2025', score: 60, result: 'Reprovado' }
    ],
    certificates: [
      { id: 'aws-cloud-practitioner', name: 'AWS Cloud Practitioner', acquired: '25/04/2025' }
    ]
  });
  
  // Schema para validação do formulário de perfil
  const profileFormSchema = z.object({
    name: z.string().min(2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
      message: "Email inválido.",
    }),
    phone: z.string().optional()
  });
  
  // Schema para validação do formulário de senha
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, {
      message: "Senha atual deve ter pelo menos 6 caracteres.",
    }),
    newPassword: z.string().min(6, {
      message: "Nova senha deve ter pelo menos 6 caracteres.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirmação de senha deve ter pelo menos 6 caracteres.",
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });
  
  // Form para editar perfil
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
  });
  
  // Form para alterar senha
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  // Manipulador para atualização de perfil
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    setUser({
      ...user,
      name: values.name,
      email: values.email,
      phone: values.phone || ''
    });
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };
  
  // Manipulador para alteração de senha
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    // Simula atualização de senha
    passwordForm.reset();
    
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi alterada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar com informações do usuário */}
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.photo} />
                    <AvatarFallback className="text-2xl bg-cert-blue text-white">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Plano</span>
                      <span className={`text-sm font-semibold ${user.planType === 'Premium' ? 'text-cert-purple' : 'text-gray-500'}`}>
                        {user.planType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tentativas restantes</span>
                      <span className="text-sm font-semibold">{user.attemptsLeft}/3</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  {user.planType === 'Freemium' ? (
                    <Button 
                      className="w-full bg-cert-purple hover:bg-cert-purple/90"
                      onClick={() => navigate('/#pricing')}
                    >
                      Upgrade para Premium
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                    >
                      Acessar Dashboard
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            {/* Conteúdo principal com tabs */}
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="hidden sm:inline">Perfil</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span className="hidden sm:inline">Pagamento</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History size={16} />
                    <span className="hidden sm:inline">Histórico</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Lock size={16} />
                    <span className="hidden sm:inline">Segurança</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab de Perfil */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações de Perfil</CardTitle>
                      <CardDescription>
                        Atualize suas informações pessoais aqui. Clique em salvar quando terminar.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone (opcional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full">Salvar Alterações</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tab de Pagamentos */}
                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações de Pagamento</CardTitle>
                      <CardDescription>
                        Gerencie seus métodos de pagamento e veja seu histórico de faturas.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Método de Pagamento Atual</h3>
                        <div className="flex items-center space-x-4 p-4 border rounded-md">
                          <div className="bg-cert-blue text-white p-2 rounded">
                            <CreditCard />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• {user.paymentMethod.lastFour}</p>
                            <p className="text-sm text-gray-500">Válido até {user.paymentMethod.expiry}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">Atualizar Cartão</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Histórico de Faturas</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {user.invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      {invoice.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-2">Plano Atual: {user.planType}</h3>
                        {user.planType === 'Freemium' ? (
                          <div>
                            <p className="text-sm text-gray-500 mb-3">Atualize para o plano Premium para acessar recursos adicionais.</p>
                            <Button 
                              className="w-full bg-cert-purple hover:bg-cert-purple/90"
                              onClick={() => navigate('/#pricing')}
                            >
                              Upgrade para Premium
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-500 mb-3">Você está atualmente no plano Premium.</p>
                            <Button variant="outline" className="w-full">Cancelar Assinatura</Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tab de Histórico */}
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Simulados</CardTitle>
                      <CardDescription>
                        Acompanhe seu progresso nos simulados realizados.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Simulados Realizados</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontuação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {user.examHistory.map((exam) => (
                                <tr key={exam.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.cert}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.date}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.score}%</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      exam.result === 'Aprovado' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {exam.result}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => navigate(`/results/${exam.id}`)}
                                    >
                                      Ver Detalhes
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Certificados Adquiridos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {user.certificates.length > 0 ? (
                            user.certificates.map((cert) => (
                              <div key={cert.id} className="border rounded-md p-4 flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <p className="text-sm text-gray-500">Adquirido em {cert.acquired}</p>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-10 bg-gray-50 rounded-md">
                              <p className="text-gray-500">Você ainda não possui certificados.</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center mt-4">
                        <Button onClick={() => navigate('/certifications')}>
                          Ver Todas as Certificações
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tab de Segurança */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança da Conta</CardTitle>
                      <CardDescription>
                        Gerencie sua senha e configurações de segurança.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Alteração de Senha</h3>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Senha Atual</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nova Senha</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirmar Nova Senha</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" className="w-full">Alterar Senha</Button>
                          </form>
                        </Form>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-2">Preferências de Notificação</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-updates">Atualizações por email</Label>
                            <input
                              id="email-updates"
                              type="checkbox"
                              defaultChecked={true}
                              className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="marketing">Ofertas e promoções</Label>
                            <input
                              id="marketing"
                              type="checkbox"
                              defaultChecked={false}
                              className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="new-certs">Novas certificações disponíveis</Label>
                            <input
                              id="new-certs"
                              type="checkbox"
                              defaultChecked={true}
                              className="h-4 w-4 text-cert-blue focus:ring-cert-blue border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium text-red-600">Zona de Perigo</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Estas ações não podem ser desfeitas. Por favor, tenha certeza antes de prosseguir.
                        </p>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                            Apagar histórico de simulados
                          </Button>
                          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                            Excluir conta
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
