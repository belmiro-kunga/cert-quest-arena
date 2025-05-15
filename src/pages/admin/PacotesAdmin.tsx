import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Search
} from 'lucide-react';
import { 
  Pacote, 
  PacoteInput, 
  getAllPacotes, 
  getPacoteById, 
  createPacote, 
  updatePacote, 
  deletePacote, 
  criarPacotesAutomaticos 
} from '@/services/pacoteService';
import { Exam } from '@/services/adminService';
import { getAllExams } from '@/services/adminService';
import { useCurrency } from '@/contexts/CurrencyContext';

const PacotesAdmin: React.FC = () => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [simulados, setSimulados] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingAuto, setIsCreatingAuto] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPacote, setSelectedPacote] = useState<Pacote | null>(null);
  const [formData, setFormData] = useState<PacoteInput>({
    titulo: '',
    descricao: '',
    preco: 0,
    preco_usd: 0,
    is_gratis: false,
    duracao_dias: 365,
    porcentagem_desconto: 25,
    categoria: '',
    ativo: true,
    simulado_ids: [],
    is_subscription: false,
    subscription_duration: 365,
    subscription_price: 0,
    subscription_currency: 'BRL'
  });
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadPacotes();
    loadSimulados();
  }, []);

  const loadPacotes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPacotes();
      setPacotes(data);
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pacotes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSimulados = async () => {
    try {
      const data = await getAllExams();
      setSimulados(data);
    } catch (error) {
      console.error('Erro ao carregar simulados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os simulados.',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePacote = async () => {
    try {
      setIsCreating(true);
      await createPacote(formData);
      toast({
        title: 'Sucesso',
        description: 'Pacote criado com sucesso!',
      });
      resetForm();
      loadPacotes();
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o pacote.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePacote = async () => {
    if (!selectedPacote) return;
    
    try {
      setIsEditing(true);
      await updatePacote(selectedPacote.id.toString(), formData);
      toast({
        title: 'Sucesso',
        description: 'Pacote atualizado com sucesso!',
      });
      resetForm();
      loadPacotes();
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o pacote.',
        variant: 'destructive',
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePacote = async () => {
    if (!selectedPacote) return;
    
    try {
      setIsDeleting(true);
      await deletePacote(selectedPacote.id.toString());
      toast({
        title: 'Sucesso',
        description: 'Pacote excluído com sucesso!',
      });
      loadPacotes();
    } catch (error) {
      console.error('Erro ao excluir pacote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o pacote.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setSelectedPacote(null);
    }
  };

  const handleCreateAutomaticPacotes = async () => {
    try {
      setIsCreatingAuto(true);
      const result = await criarPacotesAutomaticos();
      toast({
        title: 'Sucesso',
        description: `${result.pacotes.length} pacotes criados automaticamente!`,
      });
      loadPacotes();
    } catch (error) {
      console.error('Erro ao criar pacotes automáticos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar os pacotes automáticos.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingAuto(false);
    }
  };

  const editPacote = (pacote: Pacote) => {
    setSelectedPacote(pacote);
    setFormData({
      titulo: pacote.titulo,
      descricao: pacote.descricao,
      preco: pacote.preco,
      preco_usd: pacote.preco_usd,
      is_gratis: pacote.is_gratis,
      duracao_dias: pacote.duracao_dias,
      porcentagem_desconto: pacote.porcentagem_desconto,
      categoria: pacote.categoria,
      ativo: pacote.ativo,
      simulado_ids: pacote.simulados.map(s => s.id),
      is_subscription: pacote.is_subscription,
      subscription_duration: pacote.subscription_duration,
      subscription_price: pacote.subscription_price,
      subscription_currency: pacote.subscription_currency
    });
  };

  const resetForm = () => {
    setSelectedPacote(null);
    setFormData({
      titulo: '',
      descricao: '',
      preco: 0,
      preco_usd: 0,
      is_gratis: false,
      duracao_dias: 365,
      porcentagem_desconto: 25,
      categoria: '',
      ativo: true,
      simulado_ids: [],
      is_subscription: false,
      subscription_duration: 365,
      subscription_price: 0,
      subscription_currency: 'BRL'
    });
  };

  const handleSimuladoToggle = (simuladoId: string) => {
    const currentIds = formData.simulado_ids || [];
    
    if (currentIds.includes(simuladoId)) {
      setFormData({
        ...formData,
        simulado_ids: currentIds.filter(id => id !== simuladoId)
      });
    } else {
      setFormData({
        ...formData,
        simulado_ids: [...currentIds, simuladoId]
      });
    }
  };

  const filteredPacotes = pacotes.filter(pacote => 
    pacote.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pacote.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pacote.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Pacotes</h2>
          <p className="text-muted-foreground">
            Crie e gerencie pacotes de simulados com desconto.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-cert-blue hover:bg-cert-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pacote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Pacote</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar um novo pacote de simulados.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="titulo" className="text-sm font-medium">Título</label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Título do pacote"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="categoria" className="text-sm font-medium">Categoria</label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">AWS</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                        <SelectItem value="gcp">Google Cloud</SelectItem>
                        <SelectItem value="comptia">CompTIA</SelectItem>
                        <SelectItem value="cisco">Cisco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do pacote"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="preco_usd" className="text-sm font-medium">Preço (USD)</label>
                    <Input
                      id="preco_usd"
                      type="number"
                      min={0}
                      value={formData.preco_usd || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preco_usd: parseFloat(e.target.value) || 0,
                        preco: parseFloat(e.target.value) || 0 // Keep preco field in sync for backward compatibility
                      })}
                      placeholder="Preço do pacote em USD"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_gratis"
                      checked={formData.is_gratis}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_gratis: checked as boolean })}
                    />
                    <label htmlFor="is_gratis" className="text-sm font-medium">Pacote Gratuito</label>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="duracao_dias" className="text-sm font-medium">Duração (dias)</label>
                    <Input
                      id="duracao_dias"
                      type="number"
                      min={1}
                      value={formData.duracao_dias || ''}
                      onChange={(e) => setFormData({ ...formData, duracao_dias: parseInt(e.target.value) || 365 })}
                      placeholder="Duração do pacote em dias"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_subscription"
                      checked={formData.is_subscription}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_subscription: checked as boolean })}
                    />
                    <label htmlFor="is_subscription" className="text-sm font-medium">Pacote por Assinatura</label>
                  </div>
                  {formData.is_subscription && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="subscription_duration" className="text-sm font-medium">Duração da Assinatura (dias)</label>
                        <Input
                          id="subscription_duration"
                          type="number"
                          min={1}
                          value={formData.subscription_duration || ''}
                          onChange={(e) => setFormData({ ...formData, subscription_duration: parseInt(e.target.value) || 365 })}
                          placeholder="Duração da assinatura em dias"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subscription_price" className="text-sm font-medium">Preço da Assinatura</label>
                        <Input
                          id="subscription_price"
                          type="number"
                          min={0}
                          value={formData.subscription_price || ''}
                          onChange={(e) => setFormData({ ...formData, subscription_price: parseFloat(e.target.value) || 0 })}
                          placeholder="Preço da assinatura"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subscription_currency" className="text-sm font-medium">Moeda da Assinatura</label>
                        <Select
                          value={formData.subscription_currency}
                          onValueChange={(value) => setFormData({ ...formData, subscription_currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">BRL</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Simulados Incluídos</label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      <Input
                        placeholder="Buscar simulados..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      {simulados
                        .filter(simulado => 
                          simulado.title.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((simulado) => (
                          <div key={simulado.id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`simulado-${simulado.id}`}
                              checked={(formData.simulado_ids || []).includes(simulado.id)}
                              onCheckedChange={() => handleSimuladoToggle(simulado.id)}
                            />
                            <label
                              htmlFor={`simulado-${simulado.id}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow"
                            >
                              <div className="flex justify-between items-center">
                                <span>{simulado.title}</span>
                              </div>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button 
                  onClick={handleCreatePacote} 
                  disabled={isCreating}
                  className="bg-cert-blue hover:bg-cert-blue/90"
                >
                  {isCreating ? 'Criando...' : 'Criar Pacote'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Criar Pacotes Automáticos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Pacotes Automáticos</DialogTitle>
                <DialogDescription>
                  Esta ação irá criar pacotes automaticamente agrupando simulados com o mesmo título.
                  Cada pacote terá um desconto de 25%.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancelar</Button>
                <Button 
                  onClick={handleCreateAutomaticPacotes} 
                  disabled={isCreatingAuto}
                  className="bg-cert-blue hover:bg-cert-blue/90"
                >
                  {isCreatingAuto ? 'Criando...' : 'Criar Pacotes Automáticos'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar pacotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Simulados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPacotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-muted-foreground">Nenhum pacote encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPacotes.map((pacote) => (
                  <TableRow key={pacote.id}>
                    <TableCell className="font-medium">{pacote.id}</TableCell>
                    <TableCell>{pacote.titulo}</TableCell>
                    <TableCell>
                      {pacote.categoria ? (
                        <Badge variant="outline">
                          {pacote.categoria.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {pacote.porcentagem_desconto}%
                      </Badge>
                    </TableCell>
                    <TableCell>{pacote.simulados.length}</TableCell>
                    <TableCell>
                      {pacote.ativo ? (
                        <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => editPacote(pacote)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Pacote</DialogTitle>
                              <DialogDescription>
                                Edite as informações do pacote abaixo.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label htmlFor="edit-titulo" className="text-sm font-medium">Título</label>
                                  <Input
                                    id="edit-titulo"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    placeholder="Título do pacote"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="edit-categoria" className="text-sm font-medium">Categoria</label>
                                  <Select
                                    value={formData.categoria}
                                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aws">AWS</SelectItem>
                                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                                      <SelectItem value="gcp">Google Cloud</SelectItem>
                                      <SelectItem value="comptia">CompTIA</SelectItem>
                                      <SelectItem value="cisco">Cisco</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-descricao" className="text-sm font-medium">Descrição</label>
                                <Textarea
                                  id="edit-descricao"
                                  value={formData.descricao}
                                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                  placeholder="Descrição do pacote"
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <label htmlFor="edit-preco_usd" className="text-sm font-medium">Preço (USD)</label>
                                  <Input
                                    id="edit-preco_usd"
                                    type="number"
                                    min={0}
                                    value={formData.preco_usd || ''}
                                    onChange={(e) => setFormData({ 
                                      ...formData, 
                                      preco_usd: parseFloat(e.target.value) || 0,
                                      preco: parseFloat(e.target.value) || 0 // Keep preco field in sync for backward compatibility
                                    })}
                                    placeholder="Preço do pacote em USD"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-is_gratis"
                                    checked={formData.is_gratis}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_gratis: checked as boolean })}
                                  />
                                  <label htmlFor="edit-is_gratis" className="text-sm font-medium">Pacote Gratuito</label>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="edit-duracao_dias" className="text-sm font-medium">Duração (dias)</label>
                                  <Input
                                    id="edit-duracao_dias"
                                    type="number"
                                    min={1}
                                    value={formData.duracao_dias || ''}
                                    onChange={(e) => setFormData({ ...formData, duracao_dias: parseInt(e.target.value) || 365 })}
                                    placeholder="Duração do pacote em dias"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-is_subscription"
                                    checked={formData.is_subscription}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_subscription: checked as boolean })}
                                  />
                                  <label htmlFor="edit-is_subscription" className="text-sm font-medium">Pacote por Assinatura</label>
                                </div>
                                {formData.is_subscription && (
                                  <>
                                    <div className="space-y-2">
                                      <label htmlFor="edit-subscription_duration" className="text-sm font-medium">Duração da Assinatura (dias)</label>
                                      <Input
                                        id="edit-subscription_duration"
                                        type="number"
                                        min={1}
                                        value={formData.subscription_duration || ''}
                                        onChange={(e) => setFormData({ ...formData, subscription_duration: parseInt(e.target.value) || 365 })}
                                        placeholder="Duração da assinatura em dias"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label htmlFor="edit-subscription_price" className="text-sm font-medium">Preço da Assinatura</label>
                                      <Input
                                        id="edit-subscription_price"
                                        type="number"
                                        min={0}
                                        value={formData.subscription_price || ''}
                                        onChange={(e) => setFormData({ ...formData, subscription_price: parseFloat(e.target.value) || 0 })}
                                        placeholder="Preço da assinatura"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label htmlFor="edit-subscription_currency" className="text-sm font-medium">Moeda da Assinatura</label>
                                      <Select
                                        value={formData.subscription_currency}
                                        onValueChange={(value) => setFormData({ ...formData, subscription_currency: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione a moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="BRL">BRL</SelectItem>
                                          <SelectItem value="USD">USD</SelectItem>
                                          <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Simulados Incluídos</label>
                                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Buscar simulados..."
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="mb-2"
                                    />
                                    {simulados
                                      .filter(simulado => 
                                        simulado.title.toLowerCase().includes(searchTerm.toLowerCase())
                                      )
                                      .map((simulado) => (
                                        <div key={simulado.id} className="flex items-center space-x-2 py-1">
                                          <Checkbox
                                            id={`edit-simulado-${simulado.id}`}
                                            checked={(formData.simulado_ids || []).includes(simulado.id)}
                                            onCheckedChange={() => handleSimuladoToggle(simulado.id)}
                                          />
                                          <label
                                            htmlFor={`edit-simulado-${simulado.id}`}
                                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow"
                                          >
                                            <div className="flex justify-between items-center">
                                              <span>{simulado.title}</span>
                                            </div>
                                          </label>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                              <Button 
                                onClick={handleUpdatePacote} 
                                disabled={isEditing}
                                className="bg-cert-blue hover:bg-cert-blue/90"
                              >
                                {isEditing ? 'Salvando...' : 'Salvar Alterações'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" onClick={() => setSelectedPacote(pacote)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Pacote</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o pacote "{selectedPacote?.titulo}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDeletePacote}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting ? 'Excluindo...' : 'Excluir'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PacotesAdmin;
