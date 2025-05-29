
export interface Simulado {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'aws' | 'azure' | 'gcp' | 'cisco' | 'comptia';
  language: 'pt' | 'en' | 'fr' | 'es';
  preco_usd: number;
  is_gratis: boolean;
  duracao_minutos: number;
  nivel_dificuldade: string;
  ativo: boolean;
  numero_questoes: number;
  pontuacao_minima: number;
  data_criacao: string;
  data_atualizacao: string;
  subscription_tier: 'free' | 'basic' | 'premium';
  subscription_currency: string;
  title?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SimuladoInsert {
  titulo: string;
  descricao: string;
  categoria: 'aws' | 'azure' | 'gcp' | 'cisco' | 'comptia';
  language?: 'pt' | 'en' | 'fr' | 'es';
  preco_usd?: number;
  is_gratis?: boolean;
  duracao_minutos?: number;
  nivel_dificuldade?: string;
  ativo?: boolean;
  numero_questoes?: number;
  pontuacao_minima?: number;
  subscription_tier?: 'free' | 'basic' | 'premium';
  subscription_currency?: string;
}

export interface SimuladoUpdate {
  titulo?: string;
  descricao?: string;
  categoria?: 'aws' | 'azure' | 'gcp' | 'cisco' | 'comptia';
  language?: 'pt' | 'en' | 'fr' | 'es';
  preco_usd?: number;
  is_gratis?: boolean;
  duracao_minutos?: number;
  nivel_dificuldade?: string;
  ativo?: boolean;
  numero_questoes?: number;
  pontuacao_minima?: number;
  subscription_tier?: 'free' | 'basic' | 'premium';
  subscription_currency?: string;
}

class SimuladoServiceClass {
  async getAllSimulados(): Promise<Simulado[]> {
    // Mock implementation - replace with actual API call
    return [
      {
        id: '1',
        titulo: 'AWS Solutions Architect Associate',
        descricao: 'Complete AWS SAA practice exam',
        categoria: 'aws',
        language: 'pt',
        preco_usd: 29.99,
        is_gratis: false,
        duracao_minutos: 130,
        nivel_dificuldade: 'Médio',
        ativo: true,
        numero_questoes: 65,
        pontuacao_minima: 720,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
        subscription_tier: 'premium',
        subscription_currency: 'USD'
      }
    ];
  }

  async getSimuladoById(id: string): Promise<Simulado | null> {
    // Mock implementation - replace with actual API call
    const simulados = await this.getAllSimulados();
    return simulados.find(s => s.id === id) || null;
  }

  async createSimulado(simulado: SimuladoInsert): Promise<Simulado> {
    // Mock implementation - replace with actual API call
    const newSimulado: Simulado = {
      id: Date.now().toString(),
      titulo: simulado.titulo,
      descricao: simulado.descricao,
      categoria: simulado.categoria,
      language: simulado.language || 'pt',
      preco_usd: simulado.preco_usd || 0,
      is_gratis: simulado.is_gratis || true,
      duracao_minutos: simulado.duracao_minutos || 60,
      nivel_dificuldade: simulado.nivel_dificuldade || 'Médio',
      ativo: simulado.ativo || true,
      numero_questoes: simulado.numero_questoes || 10,
      pontuacao_minima: simulado.pontuacao_minima || 70,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
      subscription_tier: simulado.subscription_tier || 'free',
      subscription_currency: simulado.subscription_currency || 'USD'
    };
    return newSimulado;
  }

  async updateSimulado(id: string, simulado: SimuladoUpdate): Promise<Simulado> {
    // Mock implementation - replace with actual API call
    const existing = await this.getSimuladoById(id);
    if (!existing) {
      throw new Error('Simulado not found');
    }
    
    const updated: Simulado = {
      ...existing,
      ...simulado,
      data_atualizacao: new Date().toISOString()
    };
    return updated;
  }

  async deleteSimulado(id: string): Promise<boolean> {
    // Mock implementation - replace with actual API call
    console.log('Deleting simulado:', id);
    return true;
  }

  async getActiveSimulados(): Promise<Simulado[]> {
    const simulados = await this.getAllSimulados();
    return simulados.filter(s => s.ativo);
  }

  async toggleSimuladoStatus(id: string, isActive: boolean): Promise<Simulado | null> {
    return this.updateSimulado(id, { ativo: isActive });
  }

  async getSimuladosByCategory(category: string): Promise<Simulado[]> {
    const simulados = await this.getAllSimulados();
    return simulados.filter(s => s.categoria === category);
  }

  async searchSimulados(query: string): Promise<Simulado[]> {
    const simulados = await this.getAllSimulados();
    return simulados.filter(s => 
      s.titulo.toLowerCase().includes(query.toLowerCase()) ||
      s.descricao.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const simuladoService = new SimuladoServiceClass();

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  questionsCount: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  passingScore: number;
  active: boolean;
  isFree: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getExams = async (): Promise<Exam[]> => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createExam = async (exam: Exam): Promise<Exam> => {
  // Mock implementation - replace with actual API call
  return { ...exam, id: Date.now().toString(), createdAt: new Date().toISOString() };
};

export const updateExam = async (id: string, exam: Exam): Promise<Exam> => {
  // Mock implementation - replace with actual API call
  return { ...exam, id, updatedAt: new Date().toISOString() };
};

export const deleteExam = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting exam:', id);
};
