
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Achievement } from '@/types/admin';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['certification', 'streak', 'mastery', 'special']),
  xp: z.number().min(0, 'XP must be positive'),
  icon: z.string().min(1, 'Icon is required'),
  level: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  requirement: z.number().min(0).optional(),
  name: z.string().min(1, 'Name is required'),
  points: z.number().min(0, 'Points must be positive'),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean(),
  requirements: z.string().min(1, 'Requirements are required')
});

type FormData = z.infer<typeof achievementSchema>;

export interface AchievementFormProps {
  achievement?: Achievement;
  onSubmit: (data: FormData) => Promise<void>;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({ 
  achievement, 
  onSubmit 
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: achievement?.title || '',
      description: achievement?.description || '',
      type: achievement?.type || 'certification',
      xp: achievement?.xp || 0,
      icon: achievement?.icon || '',
      level: achievement?.level || 'bronze',
      requirement: achievement?.requirement || 0,
      name: achievement?.name || '',
      points: achievement?.points || 0,
      category: achievement?.category || '',
      is_active: achievement?.is_active || true,
      requirements: achievement?.requirements || ''
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{achievement ? 'Editar Conquista' : 'Nova Conquista'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="certification">Certificação</SelectItem>
                      <SelectItem value="streak">Sequência</SelectItem>
                      <SelectItem value="mastery">Maestria</SelectItem>
                      <SelectItem value="special">Especial</SelectItem>
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
                  <FormLabel>XP</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">
              {achievement ? 'Atualizar' : 'Criar'} Conquista
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
