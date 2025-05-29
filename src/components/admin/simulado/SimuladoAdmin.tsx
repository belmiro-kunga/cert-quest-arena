
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
import { simuladoService, type Simulado } from '@/services/simuladoService';
import { BaseQuestion } from '@/types/admin';

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
      const data = await simuladoService.getAllSimulados();
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
  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Mapear os dados do formulário para o tipo Simulado
      const simuladoData: Simulado = {
        id: editingSimulado?.id || '',
        titulo: data.titulo || data.title,
        descricao: data.descricao || data.description,
        categoria: data.categoria || 'aws',
        language: data.language || 'pt',
        preco_usd: data.preco_usd || 0,
        is_gratis: data.is_gratis || true,
        duracao_minutos: data.duracao_minutos || 60,
        nivel_dificuldade: data.nivel_dificuldade || 'Médio',
        ativo: data.ativo !== undefined ? data.ativo : true,
        numero_questoes: data.numero_questoes || 10,
        pontuacao_minima: data.pontuacao_minima || 70,
        data_criacao: editingSimulado?.data_criacao || new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
        subscription_tier: data.subscription_tier || 'free',
        subscription_currency: data.subscription_currency || 'USD'
      };
      
      console.log('Dados para salvar simulado:', simuladoData);
      
      if (editingSimulado && editingSimulado.id) {
        // Atualizar simulado existente
        await simuladoService.updateSimulado(editingSimulado.id, simuladoData);
        toast({
          title: 'Simulado atualizado',
          description: `O simulado foi atualizado com sucesso. Tipo: ${simuladoData.ativo ? 'Ativo' : 'Inativo'}`,
        });
      } else {
        // Criar novo simulado
        await simuladoService.createSimulado(simuladoData);
        toast({
          title: 'Simulado criado',
          description: `O novo simulado foi criado com sucesso. Tipo: ${simuladoData.ativo ? 'Ativo' : 'Inativo'}`,
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
      await simuladoService.deleteSimulado(simuladoToDelete.id);
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
        // await updateQuestion(selectedQuestion.id, question);
        console.log('Update question:', question);
      } else {
        // await createQuestion(question);
        console.log('Create question:', question);
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
