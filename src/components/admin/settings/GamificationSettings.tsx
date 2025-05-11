'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy, Star, Target, Award } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Schemas
const achievementSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  points: z.number().min(0),
  icon: z.string(),
  enabled: z.boolean(),
  requirements: z.array(z.string()),
  rewards: z.array(z.string())
});

const levelSchema = z.object({
  number: z.number().min(1),
  name: z.string().min(3),
  pointsRequired: z.number().min(0),
  rewards: z.array(z.string()),
  badge: z.string()
});

const pointsConfigSchema = z.object({
  enabled: z.boolean(),
  activityPoints: z.object({
    completion: z.number().min(0),
    participation: z.number().min(0),
    feedback: z.number().min(0),
    referral: z.number().min(0),
    streak: z.number().min(0)
  }),
  expirationDays: z.number().min(0).optional(),
  minimumRedeemable: z.number().min(0)
});

const rewardsConfigSchema = z.object({
  enabled: z.boolean(),
  types: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    pointsCost: z.number().min(0),
    available: z.boolean()
  })),
  expirationDays: z.number().min(0).optional(),
  automaticRedemption: z.boolean()
});

const gamificationSettingsSchema = z.object({
  achievements: z.array(achievementSchema),
  levels: z.array(levelSchema),
  points: pointsConfigSchema,
  rewards: rewardsConfigSchema,
  general: z.object({
    enabled: z.boolean(),
    showLeaderboard: z.boolean(),
    showProgress: z.boolean(),
    notifyAchievements: z.boolean()
  })
});

type FormValues = z.infer<typeof gamificationSettingsSchema>;

const defaultAchievements = [
  {
    id: 'first-cert',
    name: 'Primeira Certificação',
    description: 'Complete sua primeira certificação',
    points: 100,
    icon: 'trophy',
    enabled: true,
    requirements: ['Completar uma certificação'],
    rewards: ['Distintivo Iniciante']
  },
  {
    id: 'perfect-score',
    name: 'Nota Perfeita',
    description: 'Obtenha 100% em uma avaliação',
    points: 200,
    icon: 'star',
    enabled: true,
    requirements: ['Obter 100% em qualquer avaliação'],
    rewards: ['Distintivo Excelência']
  }
];

const defaultLevels = [
  {
    number: 1,
    name: 'Iniciante',
    pointsRequired: 0,
    rewards: ['Acesso a recursos básicos'],
    badge: 'bronze'
  },
  {
    number: 2,
    name: 'Intermediário',
    pointsRequired: 500,
    rewards: ['Acesso a recursos avançados'],
    badge: 'silver'
  },
  {
    number: 3,
    name: 'Avançado',
    pointsRequired: 1000,
    rewards: ['Acesso a recursos premium'],
    badge: 'gold'
  }
];

export function GamificationSettings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(gamificationSettingsSchema),
    defaultValues: {
      achievements: defaultAchievements,
      levels: defaultLevels,
      points: {
        enabled: true,
        activityPoints: {
          completion: 100,
          participation: 10,
          feedback: 5,
          referral: 50,
          streak: 20
        },
        expirationDays: 365,
        minimumRedeemable: 500
      },
      rewards: {
        enabled: true,
        types: [
          {
            id: 'discount',
            name: 'Desconto em Certificações',
            description: 'Obtenha desconto em novas certificações',
            pointsCost: 1000,
            available: true
          },
          {
            id: 'premium',
            name: 'Acesso Premium',
            description: 'Acesso a conteúdo exclusivo',
            pointsCost: 2000,
            available: true
          }
        ],
        expirationDays: 90,
        automaticRedemption: false
      },
      general: {
        enabled: true,
        showLeaderboard: true,
        showProgress: true,
        notifyAchievements: true
      }
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // TODO: Implement API call to save settings
      console.log('Saving gamification settings:', data);
      toast({
        title: 'Sucesso',
        description: 'Configurações de gamificação atualizadas com sucesso.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as configurações de gamificação.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Tabs defaultValue="achievements" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="achievements" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Conquistas
        </TabsTrigger>
        <TabsTrigger value="levels" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Níveis
        </TabsTrigger>
        <TabsTrigger value="points" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Pontos
        </TabsTrigger>
        <TabsTrigger value="rewards" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Recompensas
        </TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="achievements" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Conquistas</CardTitle>
                <CardDescription>Gerencie as conquistas disponíveis na plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('achievements').map((achievement, index) => (
                  <Card key={achievement.id}>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name={`achievements.${index}.enabled`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>{achievement.name}</FormLabel>
                              <FormDescription>
                                {achievement.description}
                              </FormDescription>
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
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="levels" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Níveis</CardTitle>
                <CardDescription>Configure os níveis e suas recompensas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('levels').map((level, index) => (
                  <Card key={level.number}>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name={`levels.${index}.pointsRequired`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nível {level.number} - {level.name}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Pontos necessários para atingir este nível
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="points" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pontos</CardTitle>
                <CardDescription>Configure o sistema de pontuação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="points.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Sistema de Pontos</FormLabel>
                        <FormDescription>
                          Ativar ou desativar o sistema de pontos
                        </FormDescription>
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

                <FormField
                  control={form.control}
                  name="points.activityPoints.completion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontos por Conclusão</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Pontos ganhos ao completar uma certificação
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Recompensas</CardTitle>
                <CardDescription>Configure as recompensas disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="rewards.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Sistema de Recompensas</FormLabel>
                        <FormDescription>
                          Ativar ou desativar o sistema de recompensas
                        </FormDescription>
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

                {form.watch('rewards.types').map((reward, index) => (
                  <Card key={reward.id}>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name={`rewards.types.${index}.available`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>{reward.name}</FormLabel>
                              <FormDescription>
                                {reward.description} - {reward.pointsCost} pontos
                              </FormDescription>
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
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <Button type="submit" className="w-full">
            Salvar Configurações
          </Button>
        </form>
      </Form>
    </Tabs>
  );
}
