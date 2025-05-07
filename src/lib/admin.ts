import { supabase } from './supabase';
import type { Coupon } from '@/types/admin';

export const createCoupon = async (coupon: Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code: coupon.code.toUpperCase(),
      description: coupon.description,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      valid_from: coupon.validFrom,
      valid_until: coupon.validUntil,
      usage_limit: coupon.usageLimit,
      min_purchase_amount: coupon.minPurchaseAmount,
      max_discount_amount: coupon.maxDiscountAmount,
      applicable_exams: coupon.applicableExams,
      active: coupon.active
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCoupon = async (id: string, coupon: Partial<Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>>) => {
  const updates: any = {};
  
  if (coupon.code) updates.code = coupon.code.toUpperCase();
  if (coupon.description !== undefined) updates.description = coupon.description;
  if (coupon.discountType) updates.discount_type = coupon.discountType;
  if (coupon.discountValue !== undefined) updates.discount_value = coupon.discountValue;
  if (coupon.validFrom) updates.valid_from = coupon.validFrom;
  if (coupon.validUntil) updates.valid_until = coupon.validUntil;
  if (coupon.usageLimit !== undefined) updates.usage_limit = coupon.usageLimit;
  if (coupon.minPurchaseAmount !== undefined) updates.min_purchase_amount = coupon.minPurchaseAmount;
  if (coupon.maxDiscountAmount !== undefined) updates.max_discount_amount = coupon.maxDiscountAmount;
  if (coupon.applicableExams) updates.applicable_exams = coupon.applicableExams;
  if (coupon.active !== undefined) updates.active = coupon.active;

  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCoupon = async (id: string) => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const listCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getCouponUsage = async (couponId: string) => {
  const { data, error } = await supabase
    .from('coupon_usage')
    .select(`
      id,
      used_at,
      profiles:user_id (
        name,
        email
      ),
      exams:exam_id (
        title
      )
    `)
    .eq('coupon_id', couponId)
    .order('used_at', { ascending: false });

  if (error) throw error;
  return data;
};
