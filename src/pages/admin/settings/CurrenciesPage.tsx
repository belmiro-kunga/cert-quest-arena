import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { currencyService, Currency, CreateCurrencyData } from '@/services/currencyService';
import { useToast } from '@/components/ui/use-toast';

const currencySchema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(3, 'Código deve ter no máximo 3 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório'),
  symbol: z.string().min(1, 'Símbolo é obrigatório'),
});

type CurrencyFormData = z.infer<typeof currencySchema>;

const CurrenciesPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
    },
  });

  const loadCurrencies = async () => {
    try {
      const data = await currencyService.getCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error('Erro ao carregar moedas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as moedas.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);

  const handleCreate = async (data: CurrencyFormData) => {
    try {
      await currencyService.createCurrency(data);
      setIsCreateDialogOpen(false);
      form.reset();
      loadCurrencies();
      toast({
        title: 'Sucesso',
        description: 'Moeda criada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao criar moeda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a moeda.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (data: CurrencyFormData) => {
    if (!selectedCurrency) return;

    try {
      await currencyService.updateCurrency(selectedCurrency.id, data);
      setIsEditDialogOpen(false);
      setSelectedCurrency(null);
      form.reset();
      loadCurrencies();
      toast({
        title: 'Sucesso',
        description: 'Moeda atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a moeda.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCurrency) return;

    try {
      await currencyService.deleteCurrency(selectedCurrency.id);
      setIsDeleteDialogOpen(false);
      setSelectedCurrency(null);
      loadCurrencies();
      toast({
        title: 'Sucesso',
        description: 'Moeda excluída com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir moeda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a moeda.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (currency: Currency) => {
    try {
      await currencyService.toggleCurrencyStatus(currency.id, !currency.is_active);
      loadCurrencies();
      toast({
        title: 'Sucesso',
        description: `Moeda ${currency.is_active ? 'desativada' : 'ativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status da moeda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da moeda.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (currency: Currency) => {
    setSelectedCurrency(currency);
    form.reset({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Moedas</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Moeda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Moeda</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  {...form.register('code')}
                  placeholder="Ex: USD"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ex: Dólar Americano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Símbolo</Label>
                <Input
                  id="symbol"
                  {...form.register('symbol')}
                  placeholder="Ex: $"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Moedas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.id}>
                  <TableCell>{currency.code}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>
                    <Switch
                      checked={currency.is_active}
                      onCheckedChange={() => handleToggleStatus(currency)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(currency)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(currency)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Moeda</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código</Label>
              <Input
                id="edit-code"
                {...form.register('code')}
                placeholder="Ex: USD"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                {...form.register('name')}
                placeholder="Ex: Dólar Americano"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-symbol">Símbolo</Label>
              <Input
                id="edit-symbol"
                {...form.register('symbol')}
                placeholder="Ex: $"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Moeda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a moeda {selectedCurrency?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CurrenciesPage; 