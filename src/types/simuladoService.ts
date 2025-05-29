
export interface SimuladoBase {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_questions: number;
  passing_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price: number;
  category: string;
  tags: string[];
  image_url?: string;
}

export interface Simulado extends SimuladoBase {
  questions_count: number;
  language: 'pt' | 'en' | 'fr' | 'es';
  difficulty: 'easy' | 'medium' | 'hard';
  is_gratis?: boolean;
  preco_usd?: number;
}

export interface SimuladoWithQuestions extends SimuladoBase {
  questions: QuestionDB[];
}

export interface QuestionDB {
  id: string;
  simulado_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

export interface SimuladoFromDB {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'aws' | 'azure' | 'gcp' | 'cisco' | 'comptia';
  language: 'pt' | 'en' | 'fr' | 'es';
  preco_usd: number;
  is_gratis: boolean;
  duracao_minutos: number;
  nivel_dificuldade: string;
  total_questoes: number;
  nota_aprovacao: number;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao?: string;
  updated_at?: string;
}

// Helper function to convert DB format to Simulado format
export function convertSimuladoFromDB(dbSimulado: SimuladoFromDB): Simulado {
  return {
    id: dbSimulado.id,
    title: dbSimulado.titulo,
    description: dbSimulado.descricao,
    category: dbSimulado.categoria,
    language: dbSimulado.language,
    price: dbSimulado.preco_usd,
    is_gratis: dbSimulado.is_gratis,
    duration: dbSimulado.duracao_minutos,
    difficulty: mapDifficulty(dbSimulado.nivel_dificuldade),
    total_questions: dbSimulado.total_questoes,
    passing_score: dbSimulado.nota_aprovacao,
    is_active: dbSimulado.ativo,
    created_at: dbSimulado.data_criacao,
    updated_at: dbSimulado.data_atualizacao || dbSimulado.updated_at || dbSimulado.data_criacao,
    questions_count: dbSimulado.total_questoes,
    tags: [],
    preco_usd: dbSimulado.preco_usd
  };
}

function mapDifficulty(nivel: string): 'easy' | 'medium' | 'hard' {
  switch (nivel.toLowerCase()) {
    case 'fácil':
    case 'facil':
    case 'easy':
      return 'easy';
    case 'difícil':
    case 'dificil':
    case 'hard':
      return 'hard';
    case 'médio':
    case 'medio':
    case 'medium':
    default:
      return 'medium';
  }
}
