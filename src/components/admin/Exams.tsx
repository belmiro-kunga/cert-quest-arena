import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Coins } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountEnds?: string;
  discountPercentage?: number;
  questionsCount: number;
  duration: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  purchases: number;
  rating: number;
}

interface ExamsProps {
  exams: Exam[];
  onSelect: (examId: string) => void;
  onDelete: (examId: string) => void;
}

export const Exams: React.FC<ExamsProps> = ({
  exams,
  onSelect,
  onDelete
}) => {
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
            <Button>
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
                {exams.map((exam) => (
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
                            {exam.discountEnds && (
                              <span className="text-xs text-muted-foreground">
                                Termina em {new Date(exam.discountEnds).toLocaleDateString()}
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
                          onClick={() => onSelect(exam.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDelete(exam.id)}
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
          <CardTitle>Adicionar Simulado</CardTitle>
          <CardDescription>
            Criar um novo simulado para venda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input placeholder="Ex: AWS Cloud Practitioner - Simulado 1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço Regular (R$)</label>
                <Input type="number" placeholder="29.90" step="0.01" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Desconto (%)</label>
                <Input type="number" placeholder="15" min="0" max="100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Final do Desconto</label>
                <Input type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input placeholder="Breve descrição do simulado" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número de Questões</label>
                <Input type="number" placeholder="65" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                <Input type="number" placeholder="120" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dificuldade</label>
                <select className="w-full p-2 border rounded">
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Simulado</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
