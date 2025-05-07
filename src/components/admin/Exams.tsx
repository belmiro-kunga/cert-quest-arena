import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Search, Trash, ListChecks } from 'lucide-react';
import { Exam } from '@/types/admin';
import { ExamForm } from './ExamForm';
import { QuestionsList } from './QuestionsList';
import { Badge } from "@/components/ui/badge";
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

interface ExamsProps {
  exams: Exam[];
  onSelect: (examId: string) => void;
  onDelete: (examId: string) => Promise<void>;
  onExamCreated: (exam: Exam) => void;
  onExamUpdated: (exam: Exam) => void;
}

export const Exams: React.FC<ExamsProps> = ({
  exams,
  onSelect,
  onDelete,
  onExamCreated,
  onExamUpdated
}) => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(search.toLowerCase()) ||
    exam.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateExam = async (data: Partial<Exam>) => {
    try {
      onExamCreated(data as Exam);
      toast({
        title: "Sucesso",
        description: "Simulado criado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar simulado:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar simulado.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExam = async (data: Partial<Exam>) => {
    if (!selectedExam) return;
    try {
      const updatedExam = { ...selectedExam, ...data };
      onExamUpdated(updatedExam);
      toast({
        title: "Sucesso",
        description: "Simulado atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar simulado:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar simulado.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setSelectedExam(null);
    setShowQuestions(false);
  };

  const handleManageQuestions = (exam: Exam) => {
    setSelectedExam(exam);
    setShowQuestions(true);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      await onDelete(examToDelete);
      setDeleteDialogOpen(false);
      setExamToDelete(null);
      toast({
        title: "Sucesso",
        description: "Simulado excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir simulado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir simulado.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Simulados</CardTitle>
              <CardDescription>
                Gerenciar simulados disponíveis
              </CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedExam(null);
              setFormOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Novo Simulado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar simulados..."
                className="max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Questões</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Nota Mínima</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>R$ {exam.price.toFixed(2)}</span>
                        {exam.discountPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {exam.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.discountPercentage ? (
                        <Badge variant="secondary">{exam.discountPercentage}% OFF</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{exam.questionsCount || 0}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          exam.difficulty === 'Fácil' ? 'secondary' :
                          exam.difficulty === 'Médio' ? 'default' :
                          'destructive'
                        }
                      >
                        {exam.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{exam.passingScore}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedExam(exam);
                            setFormOpen(true);
                          }}
                          title="Editar simulado"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleManageQuestions(exam)}
                          title="Gerenciar questões"
                        >
                          <ListChecks className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setExamToDelete(exam.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Excluir simulado"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {formOpen && (
        <ExamForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={selectedExam ? handleUpdateExam : handleCreateExam}
          exam={selectedExam}
        />
      )}

      {showQuestions && selectedExam && (
        <QuestionsList
          exam={selectedExam}
          open={showQuestions}
          onClose={handleCloseDialog}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o simulado
              e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExam}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
