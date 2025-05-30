// Tipos centralizados para fluxo de Simulado

export interface Alternativa {
  id: string;
  texto: string;
  correta?: boolean;
}

export interface Questao {
  id: number;
  simulado_id: number;
  enunciado: string;
  alternativas: Alternativa[];
  resposta_correta?: string | string[];
  explicacao?: string;
  url_referencia?: string;
  referencia_ativa?: boolean;
  tipo?: 'multiple_choice' | 'single_choice' | 'drag_and_drop' | 'practical_scenario' | 'fill_in_blank' | 'command_line' | 'network_topology';
}

export interface SimuladoResult {
  simuladoId: string;
  answers: Record<number, string | string[]>;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passedExam: boolean;
  completedAt: string;
}
