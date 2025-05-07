import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Question, Exam } from '@/types/admin';
import { QuestionForm } from './QuestionForm';
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
import { useToast } from "@/components/ui/use-toast";

interface QuestionsListProps {
  exam: Exam;
  open: boolean;
  onClose: () => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  exam,
  open,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateQuestion = async (data: Question) => {
    try {
      // TODO: Implementar criação de questão
      toast({
        title: "Questão criada",
        description: "A questão foi criada com sucesso.",
      });
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao criar questão",
        description: "Ocorreu um erro ao criar a questão.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async (data: Question) => {
    try {
      // TODO: Implementar atualização de questão
      toast({
        title: "Questão atualizada",
        description: "A questão foi atualizada com sucesso.",
      });
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar questão",
        description: "Ocorreu um erro ao atualizar a questão.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      // TODO: Implementar exclusão de questão
      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso.",
      });
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir questão",
        description: "Ocorreu um erro ao excluir a questão.",
        variant: "destructive",
      });
    }
  };

  const filteredQuestions = exam.questions?.filter(question =>
    question.text.toLowerCase().includes(search.toLowerCase()) ||
    question.category?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Questões do Simulado: {exam.title}</DialogTitle>
            <DialogDescription>
              Gerencie as questões deste simulado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar questões..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[300px]"
                />
                <Search className="text-muted-foreground" />
              </div>

              <Button onClick={() => {
                setSelectedQuestion(null);
                setFormOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Nova Questão
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Texto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {question.type === 'multiple_choice' && 'Múltipla Escolha'}
                        {question.type === 'single_choice' && 'Escolha Única'}
                        {question.type === 'drag_and_drop' && 'Arrastar e Soltar'}
                        {question.type === 'practical_scenario' && 'Cenário Prático'}
                        {question.type === 'fill_in_blank' && 'Preencher Lacunas'}
                        {question.type === 'command_line' && 'Linha de Comando'}
                        {question.type === 'network_topology' && 'Topologia de Rede'}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.text}</TableCell>
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
                          onClick={() => {
                            setSelectedQuestion(question);
                            setFormOpen(true);
                          }}
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

                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma questão encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {formOpen && (
        <QuestionForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
          question={selectedQuestion || undefined}
          examId={exam.id}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir questão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
