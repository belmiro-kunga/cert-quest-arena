
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'drag_and_drop' | 'fill_in_blank' | 'practical_scenario' | 'command_line' | 'network_topology';
  options?: string[];
  correctOption?: string;
  correctOptions?: string[];
  points: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  explanation: string;
  explanationLinks?: ExplanationLink[];
  correctPlacements?: any[];
  blanks?: any[];
}

export interface ExplanationLink {
  text: string;
  url: string;
  title?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
}
