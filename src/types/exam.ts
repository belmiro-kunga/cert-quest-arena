export type QuestionType = 'multiple_choice' | 'single_choice' | 'drag_and_drop' | 'practical_scenario';

export interface BaseQuestion {
  id?: string;
  text: string;
  explanation: string;
  audioExplanationUrl?: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Avançado';
  tags: string[];
  points: number;
  url_referencia?: string;
  referencia_ativa?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctOptions: string[];
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice';
  options: string[];
  correctOption: number;
}

export interface DragAndDropItem {
  text: string;
  category?: string;
  hint?: string;
}

export interface DragAndDropCategory {
  name: string;
  description?: string;
}

export interface DragAndDropQuestion extends BaseQuestion {
  type: 'drag_and_drop';
  dragAndDropType: 'ordering' | 'matching';
  dragAndDropItems: DragAndDropItem[];
  dragAndDropCategories?: DragAndDropCategory[];
  correctOrder?: number[];
}

export interface PracticalScenarioQuestion extends BaseQuestion {
  type: 'practical_scenario';
  scenario: {
    description: string;
    initialState: any;
    expectedOutcome: any;
    validationSteps: {
      description: string;
      validator: string;
    }[];
  };
}

export type Question =
  | MultipleChoiceQuestion
  | SingleChoiceQuestion
  | DragAndDropQuestion
  | PracticalScenarioQuestion;

export interface Exam {
  id?: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}
