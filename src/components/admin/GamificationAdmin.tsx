
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types/admin';
import { AchievementForm } from './AchievementForm';
import { Plus, Edit, Trash } from 'lucide-react';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '@/services/achievementService';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GamificationAdmin: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await getAchievements();
      // Convert service achievements to admin achievements
      const adminAchievements: Achievement[] = data.map(serviceAchievement => ({
        id: serviceAchievement.id,
        title: serviceAchievement.name || 'Achievement',
        description: serviceAchievement.description,
        type: 'certification' as const,
        xp: serviceAchievement.points || 0,
        icon: serviceAchievement.category || 'trophy',
        level: 'bronze' as const,
        requirement: 1,
        progress: 0,
        unlocked: false,
        name: serviceAchievement.name,
        points: serviceAchievement.points,
        category: serviceAchievement.category,
        is_active: serviceAchievement.is_active,
        requirements: serviceAchievement.requirements,
        created_at: serviceAchievement.created_at,
        updated_at: serviceAchievement.updated_at
      }));
      setAchievements(adminAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const searchLower = searchTerm.toLowerCase();
    return (
      achievement.title?.toLowerCase().includes(searchLower) ||
      achievement.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (formData: any) => {
    try {
      const achievementData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        points: formData.points,
        is_active: formData.is_active,
        requirements: formData.requirements
      };

      if (selectedAchievement) {
        await updateAchievement(selectedAchievement.id, achievementData);
      } else {
        await createAchievement(achievementData);
      }
      setShowForm(false);
      setSelectedAchievement(null);
      loadAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const handleDeleteAchievement = async () => {
    try {
      if (achievementToDelete) {
        await deleteAchievement(achievementToDelete.id);
        setAchievements(prev => prev.filter(achievement => achievement.id !== achievementToDelete.id));
      }
      setDeleteDialogOpen(false);
      setAchievementToDelete(null);
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowForm(true);
  };

  const confirmDeleteAchievement = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conquistas</CardTitle>
              <CardDescription>
                Gerenciar sistema de conquistas e gamificação
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nova Conquista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar conquistas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>XP</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>{achievement.title}</TableCell>
                      <TableCell>{achievement.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{achievement.type}</Badge>
                      </TableCell>
                      <TableCell>{achievement.xp}</TableCell>
                      <TableCell>
                        <Badge variant={achievement.is_active ? "default" : "secondary"}>
                          {achievement.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAchievement(achievement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteAchievement(achievement)}
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
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      {showForm && (
        <AchievementForm
          achievement={selectedAchievement}
          onSubmit={handleSubmit}
        />
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conquista</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conquista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAchievement}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
