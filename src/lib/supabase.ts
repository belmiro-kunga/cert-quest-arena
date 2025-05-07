
import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the other Supabase client
const SUPABASE_URL = "https://zspfwjmesflujextcvco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcGZ3am1lc2ZsdWpleHRjdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjcyOTcsImV4cCI6MjA2MjEwMzI5N30.DGGoB0lAtYKlz8vYtmPeMoXIIL1oUnNMVF4Jv5vY7Mg";

console.log("Creating Supabase client in lib/supabase.ts with URL:", SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos úteis para o sistema
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  phone?: string;
  plan_type: 'free' | 'premium' | 'enterprise';
  attempts_left: number;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user';
}

// Helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
};

// Funções para gerenciar cupons
export const getCoupon = async (code: string) => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();
  
  if (error) throw error;
  return data;
};

export const validateCoupon = async (code: string, examId: string, totalAmount: number) => {
  try {
    const coupon = await getCoupon(code);
    
    if (!coupon) {
      throw new Error('Cupom não encontrado');
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      throw new Error('Cupom expirado');
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Limite de uso do cupom atingido');
    }

    if (!coupon.active) {
      throw new Error('Cupom inativo');
    }

    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
      throw new Error(`Valor mínimo para uso do cupom: R$ ${coupon.minPurchaseAmount}`);
    }

    if (!coupon.applicableExams.includes('all') && !coupon.applicableExams.includes(examId)) {
      throw new Error('Cupom não é válido para este simulado');
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (totalAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount,
      coupon
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message
    };
  }
};

export const applyCoupon = async (code: string, examId: string, userId: string) => {
  const { data: coupon, error } = await supabase
    .from('coupons')
    .update({
      usage_count: supabase.rpc('increment_usage_count', { coupon_code: code.toUpperCase() })
    })
    .eq('code', code.toUpperCase())
    .select()
    .single();

  if (error) throw error;

  // Registrar o uso do cupom
  const { error: usageError } = await supabase
    .from('coupon_usage')
    .insert({
      coupon_id: coupon.id,
      user_id: userId,
      exam_id: examId,
      used_at: new Date().toISOString()
    });

  if (usageError) throw usageError;

  return coupon;
};
