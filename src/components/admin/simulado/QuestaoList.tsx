import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { BaseQuestion } from '@/types/admin';
import type { Questao, Alternativa } from '@/types/simulado';
import { getQuestionsByExamId, deleteQuestion } from '@/services/questaoService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuestaoListProps {
  simuladoId: string;
  onAddQuestion: () => void;
  onEditQuestion: (question: BaseQuestion) => void;
}

const QuestaoList: React.FC<QuestaoListProps> = ({ simuladoId, onAddQuestion, onEditQuestion }) => {
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar questões quando o componente montar ou o simuladoId mudar
  useEffect(() => {
    const loadQuestions = async () => {
      if (!simuladoId) return;
      
      try {
        setIsLoading(true);
        const loadedQuestions = await getQuestionsByExamId(simuladoId);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Erro ao carregar questões:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as questões.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [simuladoId, toast]);

  // Filtrar questões com base na busca
  const filteredQuestions = questions.filter(question =>
    question.text.toLowerCase().includes(search.toLowerCase()) ||
    question.category.toLowerCase().includes(search.toLowerCase())
  );

  // Função para excluir uma questão
  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteQuestion(questionToDelete);
      
      // Atualizar a lista de questões
      setQuestions(prevQuestions => 
        prevQuestions.filter(question => question.id !== questionToDelete)
      );
      
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      
      toast({
        title: "Sucesso",
        description: "Questão excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir questão:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir questão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter o rótulo do tipo de questão
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Múltipla Escolha';
      case 'single_choice': return 'Escolha Única';
      case 'drag_and_drop': return 'Arrastar e Soltar';
      case 'practical_scenario': return 'Cenário Prático';
      case 'fill_in_blank': return 'Preencher Lacunas';
      case 'command_line': return 'Linha de Comando';
      case 'network_topology': return 'Topologia de Rede';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questões</CardTitle>
        <Button onClick={onAddQuestion}>
          <Plus className="mr-2 h-4 w-4" /> Nova Questão
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar questões..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Carregando questões...</span>
              </div>
            </div>
          )}

          {!isLoading && filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma questão encontrada. Clique em "Nova Questão" para adicionar.
            </div>
          )}

          {filteredQuestions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Questão</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-xs truncate">{question.text}</TableCell>
                    <TableCell>{getQuestionTypeLabel(question.type)}</TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          question.difficulty === 'Fácil' ? 'secondary' :
                          question.difficulty === 'Médio' ? 'default' :
                          'destructive'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditQuestion(question)}
                          title="Editar questão"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setQuestionToDelete(question.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Excluir questão"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a questão
              e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default QuestaoList;
