import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Tag, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableExams: string[];
  active: boolean;
}

interface CouponsProps {
  coupons: Coupon[];
  onSelect: (couponId: string) => void;
  onDelete: (couponId: string) => void;
}

export const Coupons: React.FC<CouponsProps> = ({
  coupons,
  onSelect,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cupons Promocionais</CardTitle>
              <CardDescription>
                Gerenciar cupons de desconto
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Cupom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar cupons..."
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono uppercase">{coupon.code}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <Percent className="h-4 w-4" />
                            {coupon.discountValue}%
                            {coupon.maxDiscountAmount && (
                              <span className="text-xs text-muted-foreground">
                                (max: R$ {coupon.maxDiscountAmount})
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <Tag className="h-4 w-4" />
                            R$ {coupon.discountValue.toFixed(2)}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(coupon.validFrom).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          até {new Date(coupon.validUntil).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {coupon.usageCount}/{coupon.usageLimit}
                        <div className="w-full bg-secondary h-1.5 rounded-full mt-1">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {coupon.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelect(coupon.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDelete(coupon.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Cupom</CardTitle>
          <CardDescription>
            Criar um novo cupom promocional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Código do Cupom</label>
                <Input placeholder="Ex: BLACKFRIDAY2025" className="uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Desconto</label>
                <select className="w-full p-2 border rounded">
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor do Desconto</label>
                <Input type="number" placeholder="15" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Limite de Uso</label>
                <Input type="number" placeholder="100" min="1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data Inicial</label>
                <Input type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Final</label>
                <Input type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input placeholder="Descreva o propósito deste cupom" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor Mínimo da Compra (R$)</label>
                <Input type="number" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Desconto Máximo (R$)</label>
                <Input type="number" placeholder="0.00" min="0" step="0.01" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Simulados Aplicáveis</label>
              <select className="w-full p-2 border rounded" multiple>
                <option value="all">Todos os Simulados</option>
                <option value="aws">AWS Cloud Practitioner</option>
                <option value="azure">Azure Fundamentals AZ-900</option>
                <option value="aws-saa">AWS Solutions Architect Associate</option>
              </select>
              <span className="text-xs text-muted-foreground">
                Ctrl + Clique para selecionar múltiplos simulados
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Cupom</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
