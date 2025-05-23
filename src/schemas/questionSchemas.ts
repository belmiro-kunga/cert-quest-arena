import * as z from 'zod';

export const baseQuestionSchema = z.object({
  text: z.string().min(1, 'O enunciado é obrigatório'),
  explanation: z.string().min(1, 'A explicação é obrigatória'),
  audioExplanationUrl: z.string().optional(),
  category: z.string().min(1, 'A categoria é obrigatória'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil', 'Avançado']),
  tags: z.array(z.string()),
  points: z.number().min(1, 'A pontuação deve ser maior que 0'),
  url_referencia: z.string().optional(),
  referencia_ativa: z.boolean().optional().default(true),
});

export const multipleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal('multiple_choice'),
  options: z.array(z.string()).min(2, 'Adicione pelo menos 2 opções'),
  correctOptions: z.array(z.string()).default([]),
});

export const singleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal('single_choice'),
  options: z.array(z.string()).min(2, 'Adicione pelo menos 2 opções'),
  correctOption: z.number(),
});

export const dragAndDropSchema = baseQuestionSchema.extend({
  type: z.literal('drag_and_drop'),
  dragAndDropType: z.enum(['ordering', 'matching']),
  dragAndDropItems: z.array(z.object({
    text: z.string().min(1, 'O texto do item é obrigatório'),
    category: z.string().optional(),
    hint: z.string().optional()
  })).min(2, 'Adicione pelo menos 2 itens'),
  dragAndDropCategories: z.array(z.object({
    name: z.string().min(1, 'O nome da categoria é obrigatório'),
    description: z.string().optional()
  })).optional(),
  correctOrder: z.array(z.number()).optional(),
});

export const practicalScenarioSchema = baseQuestionSchema.extend({
  type: z.literal('practical_scenario'),
  scenario: z.object({
    description: z.string(),
    initialState: z.any(),
    expectedOutcome: z.any(),
    validationSteps: z.array(z.object({
      description: z.string(),
      validator: z.string(),
    })),
  }),
});

export const fillInBlankSchema = baseQuestionSchema.extend({
  type: z.literal('fill_in_blank'),
  blanks: z.array(z.object({
    id: z.string(),
    correctAnswers: z.array(z.string()),
    caseSensitive: z.boolean(),
  })),
});

export const commandLineSchema = baseQuestionSchema.extend({
  type: z.literal('command_line'),
  commands: z.array(z.object({
    command: z.string(),
    expectedOutput: z.string(),
  })).min(1, 'Adicione pelo menos um comando'),
});

export const networkTopologySchema = baseQuestionSchema.extend({
  type: z.literal('network_topology'),
  devices: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  })).min(2, 'Adicione pelo menos 2 dispositivos'),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['ethernet', 'serial', 'fiber', 'wireless']),
  })),
  tasks: z.array(z.object({
    description: z.string(),
    validator: z.string(),
  })),
});

export const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceSchema,
  singleChoiceSchema,
  dragAndDropSchema,
  practicalScenarioSchema,
  fillInBlankSchema,
  commandLineSchema,
  networkTopologySchema,
]);
