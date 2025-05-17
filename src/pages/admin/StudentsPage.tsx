import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, User } from '@/services/userService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Download, 
  Users 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { adminUser, isAuthenticated } = useAdminAuth();

  // Carregar a lista de alunos
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsersByRole('user');
      setStudents(data);
    } catch (err: any) {
      console.error('Erro ao carregar alunos:', err);
      setError(err.message || 'Erro ao carregar a lista de alunos');
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Erro ao carregar a lista de alunos',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticação e carregar alunos ao montar o componente
  useEffect(() => {
    if (!isAuthenticated || !adminUser) {
      navigate('/admin/login');
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: 'Você precisa estar logado como administrador para acessar esta página',
      });
      return;
    }
    fetchStudents();
  }, [isAuthenticated, adminUser, navigate]);

  // Filtrar alunos com base no termo de pesquisa
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir o diálogo de edição
  const handleEdit = (student: User) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      role: student.role
    });
    setIsEditDialogOpen(true);
  };

  // Abrir o diálogo de exclusão
  const handleDelete = (student: User) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar os dados do aluno
  const handleUpdate = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await userService.updateUser(selectedStudent.id, editFormData);
      toast({
        title: 'Sucesso',
        description: 'Dados do aluno atualizados com sucesso',
      });
      setIsEditDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      console.error('Erro ao atualizar aluno:', err);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Erro ao atualizar dados do aluno',
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir o aluno
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await userService.deleteUser(selectedStudent.id);
      toast({
        title: 'Sucesso',
        description: 'Aluno excluído com sucesso',
      });
      setIsDeleteDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      console.error('Erro ao excluir aluno:', err);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Erro ao excluir aluno',
      });
    } finally {
      setLoading(false);
    }
  };

  // Exportar dados para CSV
  const exportToCSV = () => {
    if (students.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não há dados para exportar',
      });
      return;
    }
    
    const headers = ['ID', 'Nome', 'Email', 'Papel', 'Data de Criação', 'Última Atualização'];
    const csvData = students.map(student => [
      student.id,
      student.name,
      student.email,
      student.role,
      format(new Date(student.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      format(new Date(student.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `alunos_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Alunos</h1>
          <p className="text-muted-foreground">Visualize e gerencie os alunos inscritos na plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStudents}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
          <CardDescription>Visão geral dos alunos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg flex items-center">
              <Users className="h-8 w-8 mr-3 text-primary" />
              <div>
                <p className="text-sm font-medium">Total de Alunos</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg flex items-center">
              <UserPlus className="h-8 w-8 mr-3 text-primary" />
              <div>
                <p className="text-sm font-medium">Novos (últimos 30 dias)</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(s.created_at) >= thirtyDaysAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>Lista de alunos registrados na plataforma</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p>Carregando alunos...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm ? 'Nenhum aluno encontrado com os critérios de busca' : 'Nenhum aluno registrado'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{formatDate(student.created_at)}</TableCell>
                    <TableCell>{formatDate(student.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(student)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(student)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>
              Atualize as informações do aluno. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nome
              </label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta do aluno
              {selectedStudent && ` ${selectedStudent.name}`} e removerá seus dados do servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Excluindo...' : 'Sim, excluir aluno'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentsPage;
