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
  resposta_correta?: string;
  explicacao?: string;
  url_referencia?: string;
  referencia_ativa?: boolean;
}

export interface SimuladoResult {
  simuladoId: string;
  answers: Record<number, string>;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passedExam: boolean;
  completedAt: string;
}
