import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SimuladoList from './SimuladoList';
import SimuladoForm from './SimuladoForm';
import { Simulado, getSimulados, createSimulado, updateSimulado, deleteSimulado } from '@/services/simuladoService';

const SimuladoAdmin: React.FC = () => {
  // Estado para armazenar a lista de simulados
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  
  // Estado para controlar o carregamento inicial
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar o envio de formulários
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para controlar o simulado em edição
  const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);
  
  // Estado para controlar a visibilidade do formulário
  const [showForm, setShowForm] = useState(false);
  
  // Estado para controlar o diálogo de confirmação de exclusão
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [simuladoToDelete, setSimuladoToDelete] = useState<Simulado | null>(null);
  
  // Hook de toast para notificações
  const { toast } = useToast();

  // Função para carregar os simulados do backend
  const loadSimulados = async () => {
    try {
      setIsLoading(true);
      const data = await getSimulados();
      setSimulados(data);
    } catch (error) {
      console.error('Erro ao carregar simulados:', error);
      toast({
        title: 'Erro ao carregar simulados',
        description: 'Não foi possível carregar a lista de simulados. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar simulados ao montar o componente
  useEffect(() => {
    loadSimulados();
  }, []);

  // Função para lidar com a criação/atualização de um simulado
  const handleFormSubmit = async (data: Simulado) => {
    try {
      setIsSubmitting(true);
      
      if (editingSimulado && editingSimulado.id) {
        // Atualizar simulado existente
        await updateSimulado(editingSimulado.id, data);
        toast({
          title: 'Simulado atualizado',
          description: 'O simulado foi atualizado com sucesso.',
        });
      } else {
        // Criar novo simulado
        await createSimulado(data);
        toast({
          title: 'Simulado criado',
          description: 'O novo simulado foi criado com sucesso.',
        });
      }
      
      // Recarregar a lista de simulados
      await loadSimulados();
      
      // Resetar o estado do formulário
      handleCancelForm();
    } catch (error) {
      console.error('Erro ao salvar simulado:', error);
      toast({
        title: 'Erro ao salvar simulado',
        description: 'Ocorreu um erro ao salvar o simulado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com o cancelamento do formulário
  const handleCancelForm = () => {
    setEditingSimulado(null);
    setShowForm(false);
  };

  // Função para iniciar a edição de um simulado
  const handleEditSimulado = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    setShowForm(true);
  };

  // Função para iniciar o processo de exclusão de um simulado
  const handleDeleteClick = (simulado: Simulado) => {
    setSimuladoToDelete(simulado);
    setDeleteConfirmOpen(true);
  };

  // Função para confirmar a exclusão de um simulado
  const handleDeleteConfirm = async () => {
    if (!simuladoToDelete || !simuladoToDelete.id) return;
    
    try {
      await deleteSimulado(simuladoToDelete.id);
      toast({
        title: 'Simulado excluído',
        description: 'O simulado foi excluído com sucesso.',
      });
      
      // Recarregar a lista de simulados
      await loadSimulados();
    } catch (error) {
      console.error('Erro ao excluir simulado:', error);
      toast({
        title: 'Erro ao excluir simulado',
        description: 'Ocorreu um erro ao excluir o simulado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSimuladoToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Simulados</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Simulado
          </Button>
        )}
      </div>

      <Tabs defaultValue={showForm ? "form" : "list"} value={showForm ? "form" : "list"}>
        <TabsList className="hidden">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="form">Formulário</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulados</CardTitle>
              <CardDescription>
                Gerencie os simulados disponíveis para os estudantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <SimuladoList
                  simulados={simulados}
                  onEdit={handleEditSimulado}
                  onDelete={handleDeleteClick}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingSimulado ? 'Editar Simulado' : 'Novo Simulado'}
              </CardTitle>
              <CardDescription>
                {editingSimulado
                  ? 'Atualize as informações do simulado existente.'
                  : 'Preencha as informações para criar um novo simulado.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimuladoForm
                simulado={editingSimulado || undefined}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                onCancel={handleCancelForm}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Simulado</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o simulado "{simuladoToDelete?.titulo}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SimuladoAdmin;
