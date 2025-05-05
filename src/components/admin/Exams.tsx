
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Coins } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createExam, updateExam, deleteExam } from '@/services/examService';
import { Exam } from '@/types/admin';

interface ExamsProps {
  exams: Exam[];
  onSelect: (examId: string) => void;
  onDelete: (examId: string) => void;
  onExamCreated?: (exam: Exam) => void;
  onExamUpdated?: (exam: Exam) => void;
}

export const Exams: React.FC<ExamsProps> = ({
  exams,
  onSelect,
  onDelete,
  onExamCreated,
  onExamUpdated
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    discountEnds: '',
    questionsCount: 0,
    duration: 0,
    difficulty: 'Médio' as 'Fácil' | 'Médio' | 'Difícil',
  });

  // Filtrar exames baseado no termo de busca
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selecionar um exame para edição
  const handleSelectExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setFormData({
        title: exam.title,
        description: exam.description,
        price: exam.price,
        discountPercentage: exam.discountPercentage || 0,
        discountEnds: exam.discountExpiresAt ? new Date(exam.discountExpiresAt).toISOString().split('T')[0] : '',
        questionsCount: exam.questionsCount,
        duration: exam.duration,
        difficulty: exam.difficulty,
      });
      setSelectedExamId(examId);
      setIsEditing(true);
      onSelect(examId);
    }
  };

  // Handler para mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discountPercentage' || name === 'questionsCount' || name === 'duration' 
        ? parseFloat(value) 
        : value
    }));
  };

  // Limpar formulário
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      discountEnds: '',
      questionsCount: 0,
      duration: 0,
      difficulty: 'Médio',
    });
    setSelectedExamId(null);
    setIsEditing(false);
  };

  // Cancelar edição
  const handleCancel = () => {
    resetForm();
  };

  // Salvar simulado
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const examData = {
      ...formData,
      discountPrice: formData.discountPercentage > 0 
        ? formData.price - (formData.price * formData.discountPercentage / 100)
        : null,
      discountExpiresAt: formData.discountEnds ? new Date(formData.discountEnds) : null,
      purchases: 0,
      rating: 0,
      questions: [],
      passingScore: 70,
    };
    
    try {
      if (isEditing && selectedExamId) {
        // Atualizar simulado existente
        const updatedExam = await updateExam(selectedExamId, examData);
        if (updatedExam) {
          toast({
            title: "Simulado atualizado",
            description: "O simulado foi atualizado com sucesso.",
          });
          onExamUpdated && onExamUpdated(updatedExam);
        }
      } else {
        // Criar novo simulado
        const newExam = await createExam(examData);
        if (newExam) {
          toast({
            title: "Simulado criado",
            description: "O simulado foi criado com sucesso.",
          });
          onExamCreated && onExamCreated(newExam);
        }
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o simulado.",
        variant: "destructive",
      });
    }
  };

  // Excluir simulado
  const handleDeleteExam = async (examId: string) => {
    if (confirm("Tem certeza que deseja excluir este simulado?")) {
      const result = await deleteExam(examId);
      if (result) {
        toast({
          title: "Simulado excluído",
          description: "O simulado foi removido com sucesso.",
        });
        onDelete(examId);
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o simulado.",
          variant: "destructive",
        });
      }
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
                Gerenciar simulados disponíveis para venda
              </CardDescription>
            </div>
            <Button onClick={resetForm}>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Questões</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {exam.discountPrice ? (
                          <>
                            <div className="flex items-center">
                              <Coins className="mr-1 h-4 w-4 text-green-500" />
                              <span className="font-medium text-green-600">
                                {exam.discountPrice.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm line-through text-muted-foreground">
                                {exam.price.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                })}
                              </span>
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                                -{exam.discountPercentage}%
                              </span>
                            </div>
                            {exam.discountExpiresAt && (
                              <span className="text-xs text-muted-foreground">
                                Termina em {new Date(exam.discountExpiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center">
                            <Coins className="mr-1 h-4 w-4 text-yellow-500" />
                            {exam.price.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{exam.questionsCount}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.difficulty === 'Fácil'
                          ? 'bg-green-100 text-green-700'
                          : exam.difficulty === 'Médio'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {exam.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>{exam.purchases}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        {exam.rating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSelectExam(exam.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteExam(exam.id)}
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

      {/* Formulário de Criação/Edição */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Simulado" : "Adicionar Simulado"}</CardTitle>
          <CardDescription>
            {isEditing ? "Atualizar dados do simulado" : "Criar um novo simulado para venda"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSaveExam}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input 
                  name="title"
                  value={formData.title} 
                  onChange={handleInputChange}
                  placeholder="Ex: AWS Cloud Practitioner - Simulado 1" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço Regular (R$)</label>
                <Input 
                  type="number" 
                  name="price"
                  value={formData.price} 
                  onChange={handleInputChange}
                  placeholder="29.90" 
                  step="0.01" 
                  min="0" 
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Desconto (%)</label>
                <Input 
                  type="number" 
                  name="discountPercentage"
                  value={formData.discountPercentage} 
                  onChange={handleInputChange}
                  placeholder="15" 
                  min="0" 
                  max="100" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Final do Desconto</label>
                <Input 
                  type="date" 
                  name="discountEnds"
                  value={formData.discountEnds} 
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Textarea 
                name="description"
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Breve descrição do simulado" 
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número de Questões</label>
                <Input 
                  type="number" 
                  name="questionsCount"
                  value={formData.questionsCount} 
                  onChange={handleInputChange}
                  placeholder="65" 
                  min="1" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                <Input 
                  type="number" 
                  name="duration"
                  value={formData.duration} 
                  onChange={handleInputChange}
                  placeholder="120" 
                  min="1" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dificuldade</label>
                <select 
                  className="w-full p-2 border rounded"
                  name="difficulty"
                  value={formData.difficulty} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Atualizar" : "Salvar"} Simulado</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
