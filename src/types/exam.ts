
export type QuestionType = 'multiple_choice' | 'single_choice' | 'drag_and_drop' | 'practical_scenario' | 'fill_in_blank' | 'command_line' | 'network_topology';

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

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill_in_blank';
  blanks: {
    id: string;
    correctAnswers: string[];
    caseSensitive: boolean;
  }[];
}

export interface CommandLineQuestion extends BaseQuestion {
  type: 'command_line';
  commands: {
    command: string;
    expectedOutput: string;
  }[];
}

export interface NetworkTopologyQuestion extends BaseQuestion {
  type: 'network_topology';
  devices: {
    id: string;
    name: string;
    type: string;
  }[];
  connections: {
    from: string;
    to: string;
    type: 'ethernet' | 'serial' | 'fiber' | 'wireless';
  }[];
  tasks: {
    description: string;
    validator: string;
  }[];
}

export type Question =
  | MultipleChoiceQuestion
  | SingleChoiceQuestion
  | DragAndDropQuestion
  | PracticalScenarioQuestion
  | FillInBlankQuestion
  | CommandLineQuestion
  | NetworkTopologyQuestion;

export interface Exam {
  id?: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}
