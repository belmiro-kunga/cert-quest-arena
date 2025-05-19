import { supabase } from '@/lib/supabase';
import { Exam } from '@/types/admin';

// Types
export type Currency = 'BRL' | 'USD' | 'EUR';
export type SubscriptionDuration = 30 | 90 | 180 | 365;

export interface SimuladoInPacote {
  id: string;
  price: number;
  title?: string;
  description?: string;
}

// Interface para os pacotes de simulados
export interface Pacote {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  preco_usd: number;
  is_gratis: boolean;
  duracao_dias: number;
  ativo: boolean;
  is_subscription: boolean;
  subscription_duration: SubscriptionDuration;
  subscription_price?: number;
  subscription_currency: Currency;
  simulados: SimuladoInPacote[];
  porcentagem_desconto: number;
  categoria: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  image_url?: string;
}

// Interface para criação/atualização de pacotes
export interface PacoteInput {
  titulo: string;
  descricao: string;
  preco_usd: number;
  preco?: number;
  is_gratis: boolean;
  duracao_dias?: number;
  ativo?: boolean;
  is_subscription?: boolean;
  subscription_duration?: SubscriptionDuration;
  subscription_price?: number;
  subscription_currency?: Currency;
  categoria?: string;
  porcentagem_desconto: number;
  simulado_ids?: string[];
  tags?: string[];
  image_url?: string;
}

// Add interface for Simulado
interface Simulado {
  id: string;
  title: string;
  category: string;
  price_usd: number;
  is_active: boolean;
}

// Custom error types
export class PacoteError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'PacoteError';
  }
}

export class PacoteNotFoundError extends PacoteError {
  constructor(id: string) {
    super(`Pacote não encontrado: ${id}`, 'PACOTE_NOT_FOUND');
  }
}

export class PacoteValidationError extends PacoteError {
  constructor(message: string, details?: any) {
    super(message, 'PACOTE_VALIDATION_ERROR', details);
  }
}

// Service class for better organization and dependency injection
export class PacoteService {
  private static instance: PacoteService;
  private readonly tableName = 'pacotes';

  private constructor() {}

  public static getInstance(): PacoteService {
    if (!PacoteService.instance) {
      PacoteService.instance = new PacoteService();
    }
    return PacoteService.instance;
  }

  // Validation helpers
  private validatePacoteInput(input: PacoteInput): void {
    const errors: string[] = [];

    if (!input.titulo?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!input.descricao?.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (typeof input.preco_usd !== 'number' || input.preco_usd < 0) {
      errors.push('Preço USD inválido');
    }

    if (typeof input.porcentagem_desconto !== 'number' || 
        input.porcentagem_desconto < 0 || 
        input.porcentagem_desconto > 100) {
      errors.push('Porcentagem de desconto deve estar entre 0 e 100');
    }

    if (errors.length > 0) {
      throw new PacoteValidationError('Dados do pacote inválidos', errors);
    }
  }

  // CRUD operations
  public async getAllPacotes(activeOnly: boolean = true): Promise<Pacote[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*');

      if (activeOnly) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar pacotes:', error);
        return this.getFallbackPacotes();
      }

      if (!data || data.length === 0) {
        console.log('Nenhum pacote encontrado, usando dados de fallback');
        return this.getFallbackPacotes();
      }

      return data as Pacote[];
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
      return this.getFallbackPacotes();
    }
  }

  public async getPacoteById(id: string): Promise<Pacote> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erro ao buscar pacote ${id}:`, error);
        return this.getFallbackPacoteById(id);
      }

      if (!data) {
        throw new PacoteNotFoundError(id);
      }

      return data as Pacote;
    } catch (error) {
      if (error instanceof PacoteNotFoundError) {
        throw error;
      }
      console.error(`Erro ao buscar pacote ${id}:`, error);
      return this.getFallbackPacoteById(id);
    }
  }

  public async getPacotesByCategoria(categoria: string): Promise<Pacote[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('categoria', categoria)
        .eq('ativo', true);

      if (error) {
        console.error(`Erro ao buscar pacotes da categoria ${categoria}:`, error);
        return this.getFallbackPacotesByCategoria(categoria);
      }

      if (!data || data.length === 0) {
        return this.getFallbackPacotesByCategoria(categoria);
      }

      return data as Pacote[];
    } catch (error) {
      console.error(`Erro ao buscar pacotes da categoria ${categoria}:`, error);
      return this.getFallbackPacotesByCategoria(categoria);
    }
  }

  public async createPacote(input: PacoteInput): Promise<Pacote> {
    try {
      this.validatePacoteInput(input);

      const pacoteData = {
        ...input,
        preco: input.preco_usd,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ativo: input.ativo ?? true
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([pacoteData])
        .select()
        .single();

      if (error) {
        throw new PacoteError('Erro ao criar pacote', 'CREATE_ERROR', error);
      }

      if (!data) {
        throw new PacoteError('Pacote não foi criado', 'CREATE_ERROR');
      }

      return data as Pacote;
    } catch (error) {
      if (error instanceof PacoteError) {
        throw error;
      }
      throw new PacoteError('Erro ao criar pacote', 'CREATE_ERROR', error);
    }
  }

  public async updatePacote(id: string, input: PacoteInput): Promise<Pacote> {
    try {
      this.validatePacoteInput(input);

      const updateData = {
        ...input,
        preco: input.preco_usd,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new PacoteError(`Erro ao atualizar pacote ${id}`, 'UPDATE_ERROR', error);
      }

      if (!data) {
        throw new PacoteNotFoundError(id);
      }

      return data as Pacote;
    } catch (error) {
      if (error instanceof PacoteError) {
        throw error;
      }
      throw new PacoteError(`Erro ao atualizar pacote ${id}`, 'UPDATE_ERROR', error);
    }
  }

  public async deletePacote(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new PacoteError(`Erro ao excluir pacote ${id}`, 'DELETE_ERROR', error);
      }
    } catch (error) {
      if (error instanceof PacoteError) {
        throw error;
      }
      throw new PacoteError(`Erro ao excluir pacote ${id}`, 'DELETE_ERROR', error);
    }
  }

  // Price calculation methods
  public calcularPrecoTotalSemDesconto(pacote: Pacote): number {
    if (pacote.is_gratis) return 0;

    if (typeof pacote.preco_usd === 'number' && pacote.preco_usd > 0) {
      return pacote.preco_usd;
    }

    if (typeof pacote.preco === 'number' && pacote.preco > 0) {
      return pacote.preco;
    }

    if (Array.isArray(pacote.simulados) && pacote.simulados.length > 0) {
      return pacote.simulados.reduce((total, simulado) => total + (simulado.price || 0), 0);
    }

    return 0;
  }

  public calcularPrecoTotalComDesconto(pacote: Pacote): number {
    if (pacote.is_gratis) return 0;

    const precoTotal = this.calcularPrecoTotalSemDesconto(pacote);
    const desconto = (precoTotal * (pacote.porcentagem_desconto || 0)) / 100;
    return Math.max(0, precoTotal - desconto);
  }

  public calcularEconomia(pacote: Pacote): number {
    if (pacote.is_gratis) return 0;

    const precoTotalSemDesconto = this.calcularPrecoTotalSemDesconto(pacote);
    const precoTotalComDesconto = this.calcularPrecoTotalComDesconto(pacote);
    return Math.max(0, precoTotalSemDesconto - precoTotalComDesconto);
  }

  // Fallback data methods
  private getFallbackPacotes(): Pacote[] {
    return [
      {
        id: 1,
        titulo: 'Pacote AWS Certified Solutions Architect',
        descricao: 'Prepare-se para a certificação AWS Solutions Architect com este pacote completo de simulados.',
        preco: 199.90,
        preco_usd: 39.99,
        is_gratis: false,
        duracao_dias: 90,
        ativo: true,
        is_subscription: false,
        subscription_duration: 365,
        subscription_currency: 'BRL',
        simulados: [
          { id: 'aws-saa-01', price: 79.90 },
          { id: 'aws-saa-02', price: 79.90 },
          { id: 'aws-saa-03', price: 79.90 }
        ],
        porcentagem_desconto: 20,
        categoria: 'aws',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        titulo: 'Pacote Microsoft Azure Administrator',
        descricao: 'Domine as habilidades necessárias para a certificação Azure Administrator com simulados práticos.',
        preco: 179.90,
        preco_usd: 35.99,
        is_gratis: false,
        duracao_dias: 90,
        ativo: true,
        is_subscription: false,
        subscription_duration: 365,
        subscription_currency: 'BRL',
        simulados: [
          { id: 'azure-admin-01', price: 69.90 },
          { id: 'azure-admin-02', price: 69.90 },
          { id: 'azure-admin-03', price: 69.90 }
        ],
        porcentagem_desconto: 15,
        categoria: 'azure',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private getFallbackPacoteById(id: string): Pacote {
    const fallbackPacote = this.getFallbackPacotes().find(p => p.id.toString() === id);
    if (!fallbackPacote) {
      throw new PacoteNotFoundError(id);
    }
    return fallbackPacote;
  }

  private getFallbackPacotesByCategoria(categoria: string): Pacote[] {
    const pacotes = this.getFallbackPacotes().filter(p => p.categoria === categoria);
    return pacotes.length > 0 ? pacotes : this.getFallbackPacotes();
  }

  public async criarPacotesAutomaticos(): Promise<{ message: string; pacotes: Pacote[] }> {
    try {
      // Buscar todos os simulados ativos
      const { data: simulados, error: simuladosError } = await supabase
        .from('simulados')
        .select('*')
        .eq('is_active', true);

      if (simuladosError) {
        throw new PacoteError('Erro ao buscar simulados', 'FETCH_ERROR', simuladosError);
      }

      if (!simulados || simulados.length === 0) {
        throw new PacoteError('Nenhum simulado encontrado', 'NO_SIMULADOS');
      }

      // Agrupar simulados por categoria
      const simuladosPorCategoria = (simulados as Simulado[]).reduce((acc, simulado) => {
        const categoria = simulado.category || 'outros';
        if (!acc[categoria]) {
          acc[categoria] = [];
        }
        acc[categoria].push(simulado);
        return acc;
      }, {} as Record<string, Simulado[]>);

      const pacotesCriados: Pacote[] = [];

      // Criar pacotes para cada categoria
      for (const [categoria, simuladosCategoria] of Object.entries(simuladosPorCategoria)) {
        if (simuladosCategoria.length < 2) continue; // Pular categorias com menos de 2 simulados

        const pacoteInput: PacoteInput = {
          titulo: `Pacote ${categoria.toUpperCase()}`,
          descricao: `Pacote completo de simulados para certificação ${categoria.toUpperCase()}`,
          preco_usd: simuladosCategoria.reduce((total, sim) => total + (sim.price_usd || 0), 0),
          is_gratis: false,
          duracao_dias: 90,
          ativo: true,
          is_subscription: false,
          subscription_duration: 365,
          subscription_currency: 'BRL',
          categoria,
          porcentagem_desconto: 20,
          simulado_ids: simuladosCategoria.map(s => s.id),
          tags: [categoria, 'pacote', 'certificação']
        };

        try {
          const pacote = await this.createPacote(pacoteInput);
          pacotesCriados.push(pacote);
        } catch (error) {
          console.error(`Erro ao criar pacote para categoria ${categoria}:`, error);
          // Continuar com a próxima categoria mesmo se houver erro
        }
      }

      return {
        message: `Criados ${pacotesCriados.length} pacotes automaticamente`,
        pacotes: pacotesCriados
      };
    } catch (error) {
      if (error instanceof PacoteError) {
        throw error;
      }
      throw new PacoteError('Erro ao criar pacotes automáticos', 'CREATE_ERROR', error);
    }
  }
}

// Export singleton instance
export const pacoteService = PacoteService.getInstance();

// Export helper functions that use the service instance
export const getAllPacotes = (activeOnly?: boolean) => pacoteService.getAllPacotes(activeOnly);
export const getPacoteById = (id: string) => pacoteService.getPacoteById(id);
export const getPacotesByCategoria = (categoria: string) => pacoteService.getPacotesByCategoria(categoria);
export const createPacote = (input: PacoteInput) => pacoteService.createPacote(input);
export const updatePacote = (id: string, input: PacoteInput) => pacoteService.updatePacote(id, input);
export const deletePacote = (id: string) => pacoteService.deletePacote(id);
export const calcularPrecoTotalSemDesconto = (pacote: Pacote) => pacoteService.calcularPrecoTotalSemDesconto(pacote);
export const calcularPrecoTotalComDesconto = (pacote: Pacote) => pacoteService.calcularPrecoTotalComDesconto(pacote);
export const calcularEconomia = (pacote: Pacote) => pacoteService.calcularEconomia(pacote);
export const criarPacotesAutomaticos = () => pacoteService.criarPacotesAutomaticos();
