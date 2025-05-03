
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Settings, Plus, Edit, Trash } from 'lucide-react';

const AdminPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando um salvamento
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Simulado salvo",
        description: "O simulado foi salvo com sucesso.",
      });
    }, 1000);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando um salvamento
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Questão salva",
        description: "A questão foi adicionada com sucesso.",
      });
    }, 1000);
  };

  const handleDeleteExam = () => {
    toast({
      title: "Simulado excluído",
      description: "O simulado foi removido com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
          
          <Tabs defaultValue="exams" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="exams">Simulados</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="discounts">Descontos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            {/* Guia de Simulados */}
            <TabsContent value="exams" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gerenciar Simulados</h2>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Simulado
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Criar/Editar Simulado</CardTitle>
                  <CardDescription>
                    Crie um novo simulado ou edite um existente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveExam} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome do Simulado</label>
                        <Input placeholder="Ex: AWS Cloud Practitioner" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <Input placeholder="Ex: Cloud Computing" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <Textarea placeholder="Descrição do simulado" rows={3} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                        <Input type="number" placeholder="29.90" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tempo (minutos)</label>
                        <Input type="number" placeholder="60" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nº de Questões</label>
                        <Input type="number" placeholder="60" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Simulado"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Simulados Disponíveis</CardTitle>
                  <CardDescription>
                    Lista de todos os simulados cadastrados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Questões</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell>Cloud Computing</TableCell>
                        <TableCell>R$ 29,90</TableCell>
                        <TableCell>60</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDeleteExam}>
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>CompTIA A+</TableCell>
                        <TableCell>Hardware</TableCell>
                        <TableCell>R$ 39,90</TableCell>
                        <TableCell>90</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDeleteExam}>
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Guia de Questões */}
            <TabsContent value="questions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gerenciar Questões</h2>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Nova Questão
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Criar/Editar Questão</CardTitle>
                  <CardDescription>
                    Adicione uma nova questão ou edite uma existente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveQuestion} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Simulado</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="">Selecione um simulado</option>
                        <option value="1">AWS Cloud Practitioner</option>
                        <option value="2">CompTIA A+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Texto da Questão</label>
                      <Textarea placeholder="Digite o enunciado da questão" rows={4} />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">Opções de Resposta</label>
                      
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-2">
                          <Input placeholder={`Opção ${i}`} className="flex-grow" />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-shrink-0"
                          >
                            Correta
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Explicação da Resposta</label>
                      <Textarea placeholder="Explique o motivo da resposta correta" rows={4} />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Questão"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Questões Cadastradas</CardTitle>
                  <CardDescription>
                    Lista de todas as questões por simulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Filtrar por Simulado</label>
                    <select className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2">
                      <option value="">Todos os simulados</option>
                      <option value="1">AWS Cloud Practitioner</option>
                      <option value="2">CompTIA A+</option>
                    </select>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Simulado</TableHead>
                        <TableHead>Questão (resumo)</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>101</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell className="max-w-xs truncate">
                          Qual serviço da AWS é utilizado para armazenamento de objetos?
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>102</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell className="max-w-xs truncate">
                          Qual serviço fornece capacidade de computação escalável na nuvem?
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Guia de Pagamentos */}
            <TabsContent value="payments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Configuração de Pagamentos</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integração com Gateway de Pagamento</CardTitle>
                  <CardDescription>
                    Configure as chaves de integração com gateways de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Stripe</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Chave Pública</label>
                          <Input type="password" placeholder="pk_test_..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Chave Secreta</label>
                          <Input type="password" placeholder="sk_test_..." />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button>Salvar Configurações Stripe</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">PayPal</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Client ID</label>
                          <Input type="password" placeholder="client_id..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Client Secret</label>
                          <Input type="password" placeholder="client_secret..." />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button>Salvar Configurações PayPal</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Relatório de Vendas</CardTitle>
                  <CardDescription>
                    Visualize os pagamentos recebidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">R$ 4.290,00</div>
                        <p className="text-sm text-gray-500">Receita total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">137</div>
                        <p className="text-sm text-gray-500">Vendas realizadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">R$ 31,31</div>
                        <p className="text-sm text-gray-500">Ticket médio</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Simulado</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#12345</TableCell>
                        <TableCell>03/05/2025</TableCell>
                        <TableCell>maria@email.com</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell>R$ 29,90</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Pago
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#12344</TableCell>
                        <TableCell>02/05/2025</TableCell>
                        <TableCell>joao@email.com</TableCell>
                        <TableCell>CompTIA A+</TableCell>
                        <TableCell>R$ 39,90</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Pago
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Guia de Descontos */}
            <TabsContent value="discounts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gerenciar Descontos</h2>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Cupom
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Criar/Editar Cupom</CardTitle>
                  <CardDescription>
                    Crie um novo cupom de desconto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Código do Cupom</label>
                        <Input placeholder="Ex: PROMO25" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Desconto</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option value="percentage">Porcentagem (%)</option>
                          <option value="fixed">Valor Fixo (R$)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Valor do Desconto</label>
                        <Input type="number" placeholder="25" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Simulado Aplicável</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option value="all">Todos os simulados</option>
                          <option value="1">AWS Cloud Practitioner</option>
                          <option value="2">CompTIA A+</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Data de Início</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Data de Expiração</label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Limite de Usos</label>
                      <Input type="number" placeholder="100" />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button type="submit">Salvar Cupom</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cupons Disponíveis</CardTitle>
                  <CardDescription>
                    Lista de todos os cupons de desconto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Simulado</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Usos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>PROMO25</TableCell>
                        <TableCell>25%</TableCell>
                        <TableCell>Todos</TableCell>
                        <TableCell>30/05/2025</TableCell>
                        <TableCell>10/100</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Ativo
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>AWS15OFF</TableCell>
                        <TableCell>15%</TableCell>
                        <TableCell>AWS Cloud Practitioner</TableCell>
                        <TableCell>15/05/2025</TableCell>
                        <TableCell>5/50</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Ativo
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Guia de Configurações */}
            <TabsContent value="settings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Configurações do Sistema</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Defina parâmetros gerais do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Idioma do Sistema</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Idioma Padrão</label>
                          <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="pt_BR">Português (Brasil)</option>
                            <option value="en_US">English (US)</option>
                            <option value="es_ES">Español</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Permitir Múltiplos Idiomas</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <input type="checkbox" id="multiLanguage" className="rounded" />
                            <label htmlFor="multiLanguage">Ativar seletor de idioma para usuários</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Configurações de Email</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Servidor SMTP</label>
                          <Input placeholder="smtp.exemplo.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Porta</label>
                          <Input type="number" placeholder="587" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Usuário</label>
                          <Input placeholder="contato@exemplo.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Senha</label>
                          <Input type="password" placeholder="********" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email Remetente</label>
                          <Input placeholder="contato@exemplo.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome Remetente</label>
                          <Input placeholder="Simulados Certificações" />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button>Testar Conexão SMTP</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Notificações</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="emailWelcome" className="rounded" defaultChecked />
                          <label htmlFor="emailWelcome">Enviar email de boas-vindas aos novos usuários</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="emailPurchase" className="rounded" defaultChecked />
                          <label htmlFor="emailPurchase">Enviar confirmação de compra</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="emailReminder" className="rounded" />
                          <label htmlFor="emailReminder">Enviar lembretes de simulados disponíveis</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button type="submit" className="bg-cert-blue hover:bg-cert-darkblue">
                        Salvar Configurações
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Visualize informações técnicas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Versão do Sistema:</div>
                      <div>1.0.0</div>
                      
                      <div className="font-medium">Data da Última Atualização:</div>
                      <div>03/05/2025</div>
                      
                      <div className="font-medium">Banco de Dados:</div>
                      <div>PostgreSQL 14</div>
                      
                      <div className="font-medium">Armazenamento de Arquivos:</div>
                      <div>22.5 GB / 50 GB</div>
                      
                      <div className="font-medium">Usuários Registrados:</div>
                      <div>432</div>
                      
                      <div className="font-medium">Simulados Ativos:</div>
                      <div>8</div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="mr-2">
                        Fazer Backup
                      </Button>
                      <Button variant="outline">
                        Verificar Atualizações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
