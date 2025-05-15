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
import QuestaoList from './QuestaoList';
import QuestionForm from './QuestionForm';
import { Simulado, getSimulados, createSimulado, updateSimulado, deleteSimulado } from '@/services/simuladoService';
import { BaseQuestion, createQuestion, updateQuestion } from '@/services/questaoService';

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
  
  // Estado para controlar o simulado selecionado para gerenciar questões
  const [selectedSimulado, setSelectedSimulado] = useState<Simulado | null>(null);
  
  // Estado para controlar a questão em edição
  const [selectedQuestion, setSelectedQuestion] = useState<BaseQuestion | null>(null);
  
  // Estado para controlar a visibilidade do formulário de questão
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState<string>("simulados");
  
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
      
      // Garantir que is_gratis seja um booleano e que a categoria esteja definida
      const dadosAjustados = {
        ...data,
        is_gratis: !!data.is_gratis,
        categoria: data.categoria || 'aws' // Garantir que a categoria esteja definida
      };
      
      console.log('Dados para salvar simulado:', dadosAjustados);
      
      if (editingSimulado && editingSimulado.id) {
        // Atualizar simulado existente
        await updateSimulado(editingSimulado.id, dadosAjustados);
        toast({
          title: 'Simulado atualizado',
          description: `O simulado foi atualizado com sucesso. Tipo: ${dadosAjustados.is_gratis ? 'Grátis' : 'Pago'}`,
        });
      } else {
        // Criar novo simulado
        await createSimulado(dadosAjustados);
        toast({
          title: 'Simulado criado',
          description: `O novo simulado foi criado com sucesso. Tipo: ${dadosAjustados.is_gratis ? 'Grátis' : 'Pago'}`,
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

  // Função para lidar com a edição de um simulado
  const handleEditSimulado = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    setShowForm(true);
    setActiveTab("simulados");
  };
  
  // Função para selecionar um simulado para gerenciar questões
  const handleSelectSimulado = (simulado: Simulado) => {
    setSelectedSimulado(simulado);
    setActiveTab("questoes");
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

  // Função para lidar com o envio do formulário de questão
  const handleQuestionSubmit = async (question: BaseQuestion) => {
    try {
      setIsSubmitting(true);
      
      if (selectedQuestion) {
        // Atualizar questão existente
        await updateQuestion(selectedQuestion.id, question);
        toast({
          title: "Sucesso",
          description: "Questão atualizada com sucesso!",
        });
      } else {
        // Criar nova questão
        await createQuestion(question);
        toast({
          title: "Sucesso",
          description: "Questão criada com sucesso!",
        });
      }
      
      setQuestionFormOpen(false);
      setSelectedQuestion(null);
      
    } catch (error) {
      console.error('Erro ao salvar questão:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar questão.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Simulados</h2>
        {!showForm && activeTab === "simulados" && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Simulado
          </Button>
        )}
      </div>

      <Tabs defaultValue="simulados" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simulados">Simulados</TabsTrigger>
          <TabsTrigger value="questoes">Questões</TabsTrigger>
        </TabsList>

        <TabsContent value="simulados" className="space-y-4">
          {showForm ? (
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
          ) : (
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
                    onManageQuestions={handleSelectSimulado}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="questoes">
          {selectedSimulado ? (
            <div className="space-y-4">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Simulado: {selectedSimulado.titulo}</CardTitle>
                  <CardDescription>{selectedSimulado.descricao}</CardDescription>
                </CardHeader>
              </Card>
              
              <QuestaoList
                simuladoId={selectedSimulado.id ? String(selectedSimulado.id) : ''}
                onAddQuestion={() => {
                  setSelectedQuestion(null);
                  setQuestionFormOpen(true);
                }}
                onEditQuestion={(question) => {
                  setSelectedQuestion(question);
                  setQuestionFormOpen(true);
                }}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  Selecione um simulado para gerenciar suas questões.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Formulário de questão */}
      {questionFormOpen && (
        <QuestionForm
          open={questionFormOpen}
          onClose={() => setQuestionFormOpen(false)}
          onSubmit={handleQuestionSubmit}
          question={selectedQuestion}
          examId={selectedSimulado?.id ? String(selectedSimulado.id) : ''}
        />
      )}

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
