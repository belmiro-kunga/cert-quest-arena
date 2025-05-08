import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { AchievementForm, AchievementFormData } from './AchievementForm'; 
import { Achievement, AchievementType, PointActionConfig, PointActionKey } from '@/types/admin'; 
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
import { Input } from "@/components/ui/input";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '@/services/achievementService'; 

const mockPointActionConfigs: PointActionConfig[] = [
  {
    id: 'review_flashcard',
    name: 'Revisar um Flashcard',
    points: 5,
    description: 'Pontos ganhos por cada flashcard revisado.'
  },
  {
    id: 'complete_flashcard_session',
    name: 'Completar Sessão de Flashcards',
    points: 25,
    description: 'Pontos ganhos ao completar uma sessão de revisão de flashcards.'
  },
  {
    id: 'start_exam',
    name: 'Iniciar um Simulado',
    points: 10,
    description: 'Pontos ganhos ao iniciar um simulado (para incentivar tentativas).'
  },
  {
    id: 'complete_exam',
    name: 'Completar um Simulado',
    points: 50,
    description: 'Pontos ganhos ao finalizar um simulado, independentemente da nota.'
  },
  {
    id: 'daily_login',
    name: 'Login Diário',
    points: 15,
    description: 'Pontos ganhos por fazer login na plataforma uma vez ao dia.'
  }
];

export const GamificationAdmin: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [isSubmittingAchievement, setIsSubmittingAchievement] = useState(false);
  const [isDeletingAchievement, setIsDeletingAchievement] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<string | null>(null);
  const [pointActionConfigs, setPointActionConfigs] = useState<PointActionConfig[]>(mockPointActionConfigs);
  const [hasUnsavedPointChanges, setHasUnsavedPointChanges] = useState(false);
  const { toast } = useToast();

  const fetchAndSetAchievements = async () => {
    setIsLoadingAchievements(true);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao buscar conquistas.", variant: "destructive" });
    } finally {
      setIsLoadingAchievements(false);
    }
  };

  useEffect(() => {
    fetchAndSetAchievements();
  }, []);

  const handleOpenForm = (achievement: Achievement | null = null) => {
    setSelectedAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedAchievement(null);
    setIsFormOpen(false);
  };

  const handleFormSubmit = async (data: AchievementFormData) => {
    setIsSubmittingAchievement(true);
    try {
      if (selectedAchievement && selectedAchievement.id) {
        await updateAchievement(selectedAchievement.id, data);
        toast({ title: "Sucesso", description: "Conquista atualizada com sucesso!" });
      } else {
        await createAchievement(data);
        toast({ title: "Sucesso", description: "Conquista criada com sucesso!" });
      }
      await fetchAndSetAchievements(); 
      handleCloseForm();
    } catch (error) {
      toast({ title: "Erro", description: `Falha ao salvar conquista.`, variant: "destructive" });
    } finally {
      setIsSubmittingAchievement(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setAchievementToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (achievementToDelete) {
      setIsDeletingAchievement(true);
      try {
        await deleteAchievement(achievementToDelete);
        toast({ title: "Sucesso", description: "Conquista excluída com sucesso!" });
        await fetchAndSetAchievements(); 
        setAchievementToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({ title: "Erro", description: "Falha ao excluir conquista.", variant: "destructive" });
      } finally {
        setIsDeletingAchievement(false);
      }
    }
  };

  const handlePointChange = (actionId: PointActionKey, newPoints: string) => {
    const points = parseInt(newPoints, 10);
    if (!isNaN(points) && points >= 0) {
      setPointActionConfigs(prevConfigs => 
        prevConfigs.map(config => 
          config.id === actionId ? { ...config, points: points } : config
        )
      );
      if (!hasUnsavedPointChanges) setHasUnsavedPointChanges(true);
    } else if (newPoints === "") { 
        setPointActionConfigs(prevConfigs => 
            prevConfigs.map(config => 
              config.id === actionId ? { ...config, points: 0 } : config 
            )
        );
        if (!hasUnsavedPointChanges) setHasUnsavedPointChanges(true);
    }
  };

  const handleSavePointChanges = () => {
    console.log("Saving point changes:", pointActionConfigs);
    setHasUnsavedPointChanges(false);
    toast({ title: "Sucesso", description: "Configurações de pontos salvas com sucesso! (Mock)" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciamento de Conquistas</CardTitle>
            <CardDescription>
              Crie, edite e gerencie as conquistas disponíveis para os alunos.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenForm(null)} disabled={isLoadingAchievements || isSubmittingAchievement}>
            <Plus className="mr-2 h-4 w-4" /> Nova Conquista
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingAchievements ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Carregando conquistas...</p>
            </div>
          ) : achievements.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhuma conquista cadastrada ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Ícone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((ach) => (
                  <TableRow key={ach.id}>
                    <TableCell className="font-medium">{ach.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{ach.description}</TableCell>
                    <TableCell>{ach.type.charAt(0).toUpperCase() + ach.type.slice(1)}</TableCell>
                    <TableCell>{ach.xp}</TableCell>
                    <TableCell>{ach.icon}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(ach)} title="Editar" disabled={isSubmittingAchievement || isDeletingAchievement}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(ach.id)} title="Excluir" className="text-red-500 hover:text-red-600" disabled={isSubmittingAchievement || isDeletingAchievement}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <AchievementForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          achievement={selectedAchievement || undefined}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conquista? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingAchievement}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={isDeletingAchievement}>
              {isDeletingAchievement && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Pontos por Ação</CardTitle>
          <CardDescription>
            Defina quantos pontos os alunos ganham por diferentes ações na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pointActionConfigs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhuma configuração de ponto cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right w-[120px]">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointActionConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-md">{config.description}</TableCell>
                    <TableCell className="text-right">
                      <Input 
                        type="number"
                        value={config.points.toString()} 
                        onChange={(e) => handlePointChange(config.id, e.target.value)}
                        className="w-20 text-right h-8"
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {hasUnsavedPointChanges && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSavePointChanges} disabled={isLoadingAchievements}>
                Salvar Alterações de Pontos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
