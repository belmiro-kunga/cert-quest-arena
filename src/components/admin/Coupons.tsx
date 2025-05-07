import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Tag, Percent, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/admin';
import { CouponForm } from './CouponForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Coupon } from '@/types/admin';

export const Coupons: React.FC = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar cupons
  const fetchCoupons = async () => {
    try {
      const data = await listCoupons();
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar cupons:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cupons',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filtrar cupons
  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(search.toLowerCase()) ||
    coupon.description.toLowerCase().includes(search.toLowerCase())
  );

  // Criar/Atualizar cupom
  const handleSubmit = async (data: Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedCoupon) {
        // Atualizar
        const updatedCoupon = await updateCoupon(selectedCoupon.id, data);
        setCoupons(prev =>
          prev.map(coupon =>
            coupon.id === selectedCoupon.id
              ? updatedCoupon
              : coupon
          )
        );
      } else {
        // Criar
        const newCoupon = await createCoupon(data);
        setCoupons(prev => [newCoupon, ...prev]);
      }

      setShowForm(false);
      setSelectedCoupon(null);
    } catch (error: any) {
      console.error('Erro ao salvar cupom:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o cupom',
        variant: 'destructive',
      });
    }
  };

  // Excluir cupom
  const handleDelete = async () => {
    if (!couponToDelete) return;

    try {
      await deleteCoupon(couponToDelete);

      setCoupons(prev => prev.filter(coupon => coupon.id !== couponToDelete));
      setDeleteDialogOpen(false);
      setCouponToDelete(null);

      toast({
        title: 'Sucesso',
        description: 'Cupom excluído com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir cupom:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cupom',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedCoupon(null);
  };

  const confirmDelete = (couponId: string) => {
    setCouponToDelete(couponId);
    setDeleteDialogOpen(true);
  };
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
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Cupom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cupons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Carregando cupons...
                    </TableCell>
                  </TableRow>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nenhum cupom encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
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
                            onClick={() => handleEdit(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => confirmDelete(coupon.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      {showForm && (
        <CouponForm
          coupon={selectedCoupon}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cupom</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
