import { supabase } from '@/lib/supabase';
import { emailService } from './emailService';

export interface Simulated {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  questions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulatedPurchase {
  id: string;
  userId: string;
  simulatedId: string;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export const simulatedService = {
  async getSimulateds(): Promise<Simulated[]> {
    const { data, error } = await supabase
      .from('simulateds')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Erro ao buscar simulados:', error);
      throw error;
    }

    return data.map(simulated => ({
      id: simulated.id,
      name: simulated.name,
      description: simulated.description,
      price: simulated.price,
      duration: simulated.duration,
      questions: simulated.questions,
      isActive: simulated.is_active,
      createdAt: simulated.created_at,
      updatedAt: simulated.updated_at,
    }));
  },

  async getSimulatedById(id: string): Promise<Simulated> {
    const { data, error } = await supabase
      .from('simulateds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar simulado:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      questions: data.questions,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async purchaseSimulated(userId: string, simulatedId: string): Promise<SimulatedPurchase> {
    try {
      // Busca o simulado
      const simulated = await this.getSimulatedById(simulatedId);

      // Cria o registro de compra
      const { data: purchase, error: purchaseError } = await supabase
        .from('simulated_purchases')
        .insert({
          user_id: userId,
          simulated_id: simulatedId,
          price: simulated.price,
          status: 'completed',
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Erro ao registrar compra:', purchaseError);
        throw purchaseError;
      }

      // Busca os dados do usuário
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (userProfile) {
        // Envia email de notificação
        await emailService.sendSimulatedPurchaseNotification(
          userProfile.email,
          userProfile.name,
          simulated.name,
          simulated.price
        );
      }

      return {
        id: purchase.id,
        userId: purchase.user_id,
        simulatedId: purchase.simulated_id,
        price: purchase.price,
        status: purchase.status,
        createdAt: purchase.created_at,
        updatedAt: purchase.updated_at,
      };
    } catch (error) {
      console.error('Erro ao comprar simulado:', error);
      throw error;
    }
  },

  async getUserPurchases(userId: string): Promise<SimulatedPurchase[]> {
    const { data, error } = await supabase
      .from('simulated_purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar compras do usuário:', error);
      throw error;
    }

    return data.map(purchase => ({
      id: purchase.id,
      userId: purchase.user_id,
      simulatedId: purchase.simulated_id,
      price: purchase.price,
      status: purchase.status,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at,
    }));
  },
}; 