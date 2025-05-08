import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlashcardForm } from './FlashcardForm';
import { Flashcard, FlashcardStatus } from '@/types/admin';
import { Plus, Edit, Trash } from 'lucide-react';
import { createFlashcard, updateFlashcard, deleteFlashcard, listFlashcards } from '@/lib/flashcards';
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

interface FlashcardFormData {
  front: string;
  back: string;
  lastReviewedAt: Date | null;
}

export const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<Flashcard | null>(null);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const data = await listFlashcards();
      setFlashcards(data);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const filteredFlashcards = flashcards.filter(flashcard => {
    const searchLower = searchTerm.toLowerCase();
    return (
      flashcard.front.toLowerCase().includes(searchLower) ||
      flashcard.back.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (formData: FlashcardFormData) => {
    try {
      if (selectedFlashcard) {
        await updateFlashcard(selectedFlashcard.id, {
          ...selectedFlashcard,
          front: formData.front,
          back: formData.back,
          lastReviewedAt: formData.lastReviewedAt
        });
      } else {
        await createFlashcard({
          front: formData.front,
          back: formData.back,
          status: 'new' as FlashcardStatus,
          interval: 0,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReviewedAt: null
        });
      }
      setShowForm(false);
      setSelectedFlashcard(null);
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (flashcardToDelete) {
        await deleteFlashcard(flashcardToDelete.id);
        setFlashcards(prev => prev.filter(flashcard => flashcard.id !== flashcardToDelete.id));
      }
      setDeleteDialogOpen(false);
      setFlashcardToDelete(null);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setShowForm(true);
  };

  const confirmDelete = (flashcard: Flashcard) => {
    setFlashcardToDelete(flashcard);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flashcards</CardTitle>
              <CardDescription>
                Gerenciar flashcards para revisão espaçada
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Flashcard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar flashcards..."
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
                    <TableCell>Frente</TableCell>
                    <TableCell>Verso</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlashcards.map((flashcard) => (
                    <TableRow key={flashcard.id}>
                      <TableCell>{flashcard.front}</TableCell>
                      <TableCell>{flashcard.back}</TableCell>
                      <TableCell>{flashcard.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(flashcard)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(flashcard)}
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
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{selectedFlashcard ? 'Editar' : 'Novo'} Flashcard</CardTitle>
          </CardHeader>
          <CardContent>
            <FlashcardForm
              flashcard={selectedFlashcard}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedFlashcard(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Flashcard</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este flashcard?
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
