import type { Database } from './supabase';

export type SimuladoBase = Database['public']['Tables']['simulados']['Row'];
export type SimuladoInsert = Database['public']['Tables']['simulados']['Insert'];
export type SimuladoUpdate = Database['public']['Tables']['simulados']['Update'];

export interface Simulado extends Omit<SimuladoBase, 'language'> {
  questions_count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  language: string;
}

export interface SimuladoWithQuestions extends Simulado {
  questions: Database['public']['Tables']['questions']['Row'][];
}

export interface SimuladoService {
  getAllSimulados(): Promise<Simulado[]>;
  getSimuladoById(id: string): Promise<SimuladoWithQuestions | null>;
  createSimulado(simulado: SimuladoInsert): Promise<Simulado | null>;
  updateSimulado(id: string, simulado: SimuladoUpdate): Promise<Simulado | null>;
  deleteSimulado(id: string): Promise<boolean>;
  getActiveSimulados(): Promise<Simulado[]>;
  toggleSimuladoStatus(id: string, isActive: boolean): Promise<Simulado | null>;
  getSimuladosByCategory(category: string): Promise<Simulado[]>;
  searchSimulados(query: string): Promise<Simulado[]>;
} 