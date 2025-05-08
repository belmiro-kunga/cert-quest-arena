
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Coupon } from '@/types/admin';

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  coupon,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date().toISOString().split('T')[0],
    usageLimit: 100,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    applicableExams: [],
    active: true
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        ...coupon,
        validFrom: typeof coupon.validFrom === 'string' ? coupon.validFrom.split('T')[0] : new Date(coupon.validFrom).toISOString().split('T')[0],
        validUntil: typeof coupon.validUntil === 'string' ? coupon.validUntil.split('T')[0] : new Date(coupon.validUntil).toISOString().split('T')[0]
      });
    }
  }, [coupon]);

  const handleChange = (field: keyof Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validações
      if (!formData.code) {
        throw new Error('O código do cupom é obrigatório');
      }
      
      if (!formData.discountValue || formData.discountValue <= 0) {
        throw new Error('O valor do desconto deve ser maior que zero');
      }

      if (formData.discountType === 'percentage' && formData.discountValue > 100) {
        throw new Error('O desconto em porcentagem não pode ser maior que 100%');
      }

      if (new Date(formData.validUntil) < new Date(formData.validFrom)) {
        throw new Error('A data final deve ser posterior à data inicial');
      }

      await onSubmit(formData);
      toast({
        title: 'Sucesso',
        description: `Cupom ${coupon ? 'atualizado' : 'criado'} com sucesso!`
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar o cupom',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon ? 'Editar Cupom' : 'Novo Cupom'}</CardTitle>
        <CardDescription>
          {coupon ? 'Altere os dados do cupom' : 'Preencha os dados para criar um novo cupom'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Cupom</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={e => handleChange('code', e.target.value.toUpperCase())}
                placeholder="Ex: BLACKFRIDAY2025"
                className="uppercase"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountType">Tipo de Desconto</Label>
              <Select
                value={formData.discountType}
                onValueChange={value => handleChange('discountType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountValue">Valor do Desconto</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={e => handleChange('discountValue', parseFloat(e.target.value))}
                min="0"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                max={formData.discountType === 'percentage' ? '100' : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Limite de Uso</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={e => handleChange('usageLimit', parseInt(e.target.value))}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Data Inicial</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={e => handleChange('validFrom', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Data Final</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={e => handleChange('validUntil', e.target.value)}
                min={formData.validFrom}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPurchaseAmount">Valor Mínimo da Compra (R$)</Label>
              <Input
                id="minPurchaseAmount"
                type="number"
                value={formData.minPurchaseAmount}
                onChange={e => handleChange('minPurchaseAmount', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Desconto Máximo (R$)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={e => handleChange('maxDiscountAmount', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Descreva o cupom e suas condições"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={checked => handleChange('active', checked)}
            />
            <Label htmlFor="active">Cupom Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : coupon ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
