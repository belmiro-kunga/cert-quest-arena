import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Achievement, AchievementType } from '@/types/admin';

const achievementTypes = ['certification', 'streak', 'mastery', 'special'] as const;

const formSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(achievementTypes, { errorMap: () => ({ message: 'Selecione um tipo válido.' }) }),
  xp: z.number().min(0, 'XP não pode ser negativo').positive('XP deve ser um número positivo'),
  icon: z.string().min(2, 'Ícone deve ter pelo menos 2 caracteres (ex: Trophy, Star)'),
});

export type AchievementFormData = z.infer<typeof formSchema>;

interface AchievementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AchievementFormData) => Promise<void>;
  achievement?: Partial<Achievement>; // Partial because ID is not in form, and other fields might be optional initially
}

export const AchievementForm: React.FC<AchievementFormProps> = ({
  open,
  onClose,
  onSubmit,
  achievement
}) => {
  const form = useForm<AchievementFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: achievement?.title || '',
      description: achievement?.description || '',
      type: achievement?.type || 'special',
      xp: achievement?.xp || 0,
      icon: achievement?.icon || '',
    }
  });

  const handleSubmit = async (data: AchievementFormData) => {
    try {
      await onSubmit(data);
      form.reset(); 
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conquista:', error);
      // Potentially show a toast message here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{achievement?.id ? 'Editar Conquista' : 'Nova Conquista'}</DialogTitle>
          <DialogDescription>
            {achievement?.id ? 'Edite as informações da conquista.' : 'Preencha as informações para criar uma nova conquista.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mestre dos Flashcards" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Concedida por dominar 100 flashcards." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {achievementTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="xp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XP (Pontos)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Trophy, Star, BookOpen" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome do ícone (ex: Lucide Icons). Pode ser implementado visualmente depois.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{achievement?.id ? 'Salvar Alterações' : 'Criar Conquista'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
