import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Trash } from 'lucide-react';
import { Exam as AdminExam } from '@/types/admin';
import { Exam as ServiceExam, getExams, createExam, updateExam, deleteExam } from '@/services/simuladoService';
import { ExamForm } from './ExamForm';
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
  exams: AdminExam[];
  onSelect: (examId: string) => void;
  onDelete: (examId: string) => Promise<void>;
  onExamCreated: (exam: AdminExam) => void;
  onExamUpdated: (exam: AdminExam) => void;
}

export const Exams: React.FC<ExamsProps> = ({
  exams: propExams,
  onSelect,
  onDelete: propOnDelete,
  onExamCreated,
  onExamUpdated
}) => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<AdminExam | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Estado local para armazenar os exames carregados do backend
  const [exams, setExams] = useState<AdminExam[]>(propExams || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar exames do backend quando o componente montar
  useEffect(() => {
    const loadExams = async () => {
      try {
        setIsLoading(true);
        const loadedExams = await getExams();
        
        // Converter para o formato AdminExam
        const adminExams: AdminExam[] = loadedExams.map(serviceExam => ({
          id: serviceExam.id,
          title: serviceExam.title,
          description: serviceExam.description,
          price: serviceExam.price,
          duration: serviceExam.duration,
          questions_count: serviceExam.questionsCount,
          difficulty: serviceExam.difficulty,
          created_at: serviceExam.createdAt || new Date().toISOString(),
          updated_at: serviceExam.createdAt || new Date().toISOString(),
          category: '',  // Campo obrigatório em AdminExam
          image_url: ''  // Campo obrigatório em AdminExam
        }));
        
        setExams(adminExams);
        
        // Notificar o componente pai sobre os exames carregados
        if (onExamCreated && adminExams.length > 0) {
          adminExams.forEach(exam => onExamCreated(exam));
        }
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os simulados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExams();
  }, []);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(search.toLowerCase()) ||
    exam.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateExam = async (data: Partial<AdminExam>) => {
    try {
      setIsLoading(true);
      
      // Converter AdminExam para ServiceExam
      const serviceExam: ServiceExam = {
        id: data.id || '',
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        duration: data.duration || 0,
        questionsCount: data.questions_count || 0,
        difficulty: data.difficulty || '',
        passingScore: 70, // Valor padrão
        active: true,
        isFree: data.price === 0
      };
      
      // Criar o exame no backend
      const createdServiceExam = await createExam(serviceExam);
      
      // Converter de volta para AdminExam
      const createdAdminExam: AdminExam = {
        id: createdServiceExam.id,
        title: createdServiceExam.title,
        description: createdServiceExam.description,
        price: createdServiceExam.price,
        duration: createdServiceExam.duration,
        questions_count: createdServiceExam.questionsCount,
        difficulty: createdServiceExam.difficulty,
        created_at: createdServiceExam.createdAt || new Date().toISOString(),
        updated_at: createdServiceExam.createdAt || new Date().toISOString(),
        category: '',  // Campo obrigatório em AdminExam
        image_url: ''  // Campo obrigatório em AdminExam
      };
      
      // Atualizar o estado local
      setExams(prevExams => [...prevExams, createdAdminExam]);
      
      // Notificar o componente pai
      if (onExamCreated) {
        onExamCreated(createdAdminExam);
      }
      
      toast({
        title: "Sucesso",
        description: "Simulado criado com sucesso!",
      });
      
      // Fechar o formulário
      setFormOpen(false);
    } catch (error) {
      console.error('Erro ao criar simulado:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar simulado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExam = async (data: Partial<AdminExam>) => {
    if (!selectedExam) return;
    try {
      setIsLoading(true);
      const updatedAdminExam = { ...selectedExam, ...data };
      
      // Converter AdminExam para ServiceExam
      const serviceExam: ServiceExam = {
        id: updatedAdminExam.id,
        title: updatedAdminExam.title,
        description: updatedAdminExam.description,
        price: updatedAdminExam.price,
        duration: updatedAdminExam.duration,
        questionsCount: updatedAdminExam.questions_count,
        difficulty: updatedAdminExam.difficulty,
        passingScore: 70, // Valor padrão
        active: true,
        isFree: updatedAdminExam.price === 0
      };
      
      // Atualizar o exame no backend
      const resultServiceExam = await updateExam(serviceExam.id, serviceExam);
      
      // Converter de volta para AdminExam
      const resultAdminExam: AdminExam = {
        id: resultServiceExam.id,
        title: resultServiceExam.title,
        description: resultServiceExam.description,
        price: resultServiceExam.price,
        duration: resultServiceExam.duration,
        questions_count: resultServiceExam.questionsCount,
        difficulty: resultServiceExam.difficulty,
        created_at: resultServiceExam.createdAt || updatedAdminExam.created_at,
        updated_at: new Date().toISOString(),
        category: updatedAdminExam.category,
        image_url: updatedAdminExam.image_url
      };
      
      // Atualizar o estado local
      setExams(prevExams => 
        prevExams.map(exam => 
          exam.id === resultAdminExam.id ? resultAdminExam : exam
        )
      );
      
      // Notificar o componente pai
      if (onExamUpdated) {
        onExamUpdated(resultAdminExam);
      }
      
      toast({
        title: "Sucesso",
        description: "Simulado atualizado com sucesso!",
      });
      
      // Fechar o formulário
      setFormOpen(false);
      setSelectedExam(null);
    } catch (error) {
      console.error('Erro ao atualizar simulado:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar simulado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedExam(null);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      setIsLoading(true);
      
      // Excluir o exame no backend
      await deleteExam(examToDelete);
      
      // Atualizar o estado local
      setExams(prevExams => 
        prevExams.filter(exam => exam.id !== examToDelete)
      );
      
      // Notificar o componente pai
      if (propOnDelete) {
        await propOnDelete(examToDelete);
      }
      
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
    } finally {
      setIsLoading(false);
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
            
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm text-muted-foreground">Carregando simulados...</span>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Questões</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Dificuldade</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell>{exam.questions_count}</TableCell>
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
