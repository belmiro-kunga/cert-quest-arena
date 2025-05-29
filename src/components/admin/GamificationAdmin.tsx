
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AchievementForm } from './AchievementForm';
import { Achievement } from '@/types/admin';
import { Plus, Edit, Trash } from 'lucide-react';
import { createAchievement, updateAchievement, deleteAchievement, getAchievements } from '@/services/achievementService';
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
        title: serviceAchievement.title,
        description: serviceAchievement.description,
        type: serviceAchievement.type,
        xp: serviceAchievement.xp,
        icon: serviceAchievement.icon,
        level: serviceAchievement.level,
        requirement: serviceAchievement.requirement,
        progress: serviceAchievement.progress,
        unlocked: serviceAchievement.unlocked,
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
      achievement.title.toLowerCase().includes(searchLower) ||
      achievement.description.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (formData: any) => {
    try {
      const achievementData = {
        title: formData.title || '',
        description: formData.description || '',
        type: formData.type || 'certification',
        xp: formData.xp || 0,
        icon: formData.icon || '',
        name: formData.name || formData.title || '',
        points: formData.points || 0,
        category: formData.category || '',
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        requirements: formData.requirements || ''
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

  const handleDelete = async () => {
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

  const handleEdit = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowForm(true);
  };

  const confirmDelete = (achievement: Achievement) => {
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
                Gerenciar conquistas e gamificação
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
                    <TableCell>Tipo</TableCell>
                    <TableCell>XP</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>{achievement.title}</TableCell>
                      <TableCell>{achievement.type}</TableCell>
                      <TableCell>{achievement.xp}</TableCell>
                      <TableCell>{achievement.is_active ? 'Sim' : 'Não'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(achievement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(achievement)}
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

      {/* Achievement Form */}
      {showForm && (
        <AchievementForm
          achievement={selectedAchievement}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedAchievement(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
