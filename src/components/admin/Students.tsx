import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, UserPlus } from 'lucide-react';
import { Student } from '@/types/admin';
import { StudentForm } from './StudentForm';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentsProps {
  students: Student[];
  onCreateStudent: (data: Partial<Student>) => Promise<void>;
  onUpdateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onEnrollExam: (studentId: string, examId: string) => Promise<void>;
  availableExams: Array<{ id: string; title: string; }>;
}

export const Students: React.FC<StudentsProps> = ({
  students,
  onCreateStudent,
  onUpdateStudent,
  onDeleteStudent,
  onEnrollExam,
  availableExams
}) => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateStudent = async (data: Partial<Student>) => {
    try {
      await onCreateStudent(data);
      toast({
        title: "Sucesso",
        description: "Aluno criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar aluno.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (data: Partial<Student>) => {
    if (!selectedStudent) return;
    try {
      await onUpdateStudent(selectedStudent.id, data);
      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluno.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await onDeleteStudent(studentToDelete);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno.",
        variant: "destructive",
      });
    }
  };

  const handleEnrollExam = async (studentId: string, examId: string) => {
    try {
      await onEnrollExam(studentId, examId);
      toast({
        title: "Sucesso",
        description: "Aluno inscrito no simulado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao inscrever aluno no simulado.",
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
              <CardTitle>Alunos</CardTitle>
              <CardDescription>
                Gerenciar alunos cadastrados
              </CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedStudent(undefined);
              setFormOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Novo Aluno
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar alunos..."
                className="max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant={student.provider === 'email' ? 'default' : 'secondary'}>
                        {student.provider || 'email'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.plan_type === 'premium' ? 'default' : 'outline'}>
                        {student.plan_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.attempts_left}</TableCell>
                    <TableCell>
                      {student.lastActive ? format(new Date(student.lastActive), 'Pp', { locale: ptBR }) : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(student);
                            setFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setStudentToDelete(student.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {availableExams.map(exam => (
                              <DropdownMenuItem
                                key={exam.id}
                                onClick={() => handleEnrollExam(student.id, exam.id)}
                              >
                                Inscrever em {exam.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StudentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={selectedStudent ? handleUpdateStudent : handleCreateStudent}
        student={selectedStudent}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o aluno
              e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
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
