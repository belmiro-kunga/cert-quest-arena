
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Flashcard } from '@/types/admin';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (data: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'status' | 'interval' | 'repetitions' | 'easeFactor' | 'nextReview'>) => Promise<void>;
  onCancel: () => void;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  flashcard,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    front: string;
    back: string;
    lastReviewedAt: string | null;
  }>({
    front: '',
    back: '',
    lastReviewedAt: null
  });

  useEffect(() => {
    if (flashcard) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
        lastReviewedAt: flashcard.lastReviewedAt
      });
    }
  }, [flashcard]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validações
      if (!formData.front.trim()) {
        throw new Error('O frente do flashcard é obrigatória');
      }
      
      if (!formData.back.trim()) {
        throw new Error('O verso do flashcard é obrigatório');
      }

      await onSubmit(formData);
      toast({
        title: 'Sucesso',
        description: `Flashcard ${flashcard ? 'atualizado' : 'criado'} com sucesso!`
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar o flashcard',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{flashcard ? 'Editar' : 'Criar'} Flashcard</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para {flashcard ? 'editar o' : 'criar um novo'} flashcard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Frente</Label>
            <Textarea
              id="front"
              value={formData.front}
              onChange={(e) => handleInputChange('front', e.target.value)}
              placeholder="Digite o conteúdo da frente do flashcard"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Verso</Label>
            <Textarea
              id="back"
              value={formData.back}
              onChange={(e) => handleInputChange('back', e.target.value)}
              placeholder="Digite o conteúdo do verso do flashcard"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : flashcard ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
