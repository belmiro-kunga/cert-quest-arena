import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash, Loader2, CreditCard, Settings, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PaymentGateway,
  PaymentGatewayConfig,
  getPaymentGateways,
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
  testGatewayConnection
} from '@/services/paymentService';

export const PaymentGateways: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [gatewayToDelete, setGatewayToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentGatewayConfig>>({
    name: '',
    type: 'paypal',
    isEnabled: true,
    credentials: {
      environment: 'sandbox',
    },
  });
  const { toast } = useToast();

  const fetchGateways = async () => {
    setIsLoading(true);
    try {
      const data = await getPaymentGateways();
      setGateways(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar gateways de pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleOpenForm = (gateway: PaymentGateway | null = null) => {
    if (gateway) {
      setSelectedGateway(gateway);
      setFormData({
        name: gateway.name,
        type: gateway.type,
        isEnabled: gateway.isEnabled,
        credentials: gateway.credentials,
      });
    } else {
      setSelectedGateway(null);
      setFormData({
        name: '',
        type: 'paypal',
        isEnabled: true,
        credentials: {
          environment: 'sandbox',
        },
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedGateway(null);
    setFormData({
      name: '',
      type: 'paypal',
      isEnabled: true,
      credentials: {
        environment: 'sandbox',
      },
    });
    setIsFormOpen(false);
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (selectedGateway) {
        await updatePaymentGateway(selectedGateway.id, formData);
        toast({
          title: "Sucesso",
          description: "Gateway de pagamento atualizado com sucesso!",
        });
      } else {
        await createPaymentGateway(formData as Omit<PaymentGatewayConfig, 'id'>);
        toast({
          title: "Sucesso",
          description: "Gateway de pagamento criado com sucesso!",
        });
      }
      await fetchGateways();
      handleCloseForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar gateway de pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async (gateway: PaymentGateway) => {
    try {
      const isConnected = await testGatewayConnection(gateway.type, gateway.credentials);
      toast({
        title: isConnected ? "Sucesso" : "Erro",
        description: isConnected
          ? "Conexão com o gateway estabelecida com sucesso!"
          : "Falha ao conectar com o gateway.",
        variant: isConnected ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao testar conexão com o gateway.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setGatewayToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (gatewayToDelete) {
      setIsDeleting(true);
      try {
        await deletePaymentGateway(gatewayToDelete);
        toast({
          title: "Sucesso",
          description: "Gateway de pagamento excluído com sucesso!",
        });
        await fetchGateways();
        setGatewayToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir gateway de pagamento.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'paypal':
        return '💳 PayPal';
      case 'stripe':
        return '💳 Stripe';
      case 'google_pay':
        return '💳 Google Pay';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gateways de Pagamento</CardTitle>
            <CardDescription>
              Configure os gateways de pagamento disponíveis na plataforma.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenForm(null)} disabled={isLoading || isSubmitting}>
            <Plus className="mr-2 h-4 w-4" /> Novo Gateway
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Carregando gateways...</p>
            </div>
          ) : gateways.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum gateway de pagamento configurado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ambiente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gateways.map((gateway) => (
                  <TableRow key={gateway.id}>
                    <TableCell className="font-medium">{gateway.name}</TableCell>
                    <TableCell>{getGatewayIcon(gateway.type)}</TableCell>
                    <TableCell>
                      {gateway.credentials.environment === 'production' ? 'Produção' : 'Sandbox'}
                    </TableCell>
                    <TableCell>
                      {gateway.isEnabled ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Ativo
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" /> Inativo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTestConnection(gateway)}
                        title="Testar Conexão"
                        disabled={isSubmitting}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(gateway)}
                        title="Editar"
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(gateway.id)}
                        title="Excluir"
                        className="text-red-500 hover:text-red-600"
                        disabled={isSubmitting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGateway ? 'Editar Gateway' : 'Novo Gateway'}
            </DialogTitle>
            <DialogDescription>
              {selectedGateway
                ? 'Edite as configurações do gateway de pagamento.'
                : 'Configure um novo gateway de pagamento.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: PayPal Principal"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={formData.type}
                onValueChange={(value: 'paypal' | 'stripe' | 'google_pay') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="google_pay">Google Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ambiente</label>
              <Select
                value={formData.credentials?.environment}
                onValueChange={(value: 'sandbox' | 'production') =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      environment: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Teste)</SelectItem>
                  <SelectItem value="production">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'paypal' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client ID</label>
                  <Input
                    value={formData.credentials?.clientId || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          clientId: e.target.value,
                        },
                      })
                    }
                    placeholder="PayPal Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret Key</label>
                  <Input
                    type="password"
                    value={formData.credentials?.secretKey || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          secretKey: e.target.value,
                        },
                      })
                    }
                    placeholder="PayPal Secret Key"
                  />
                </div>
              </>
            )}

            {formData.type === 'stripe' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Public Key</label>
                  <Input
                    value={formData.credentials?.publicKey || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          publicKey: e.target.value,
                        },
                      })
                    }
                    placeholder="Stripe Public Key"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret Key</label>
                  <Input
                    type="password"
                    value={formData.credentials?.secretKey || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          secretKey: e.target.value,
                        },
                      })
                    }
                    placeholder="Stripe Secret Key"
                  />
                </div>
              </>
            )}

            {formData.type === 'google_pay' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Merchant ID</label>
                  <Input
                    value={formData.credentials?.merchantId || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          merchantId: e.target.value,
                        },
                      })
                    }
                    placeholder="Google Pay Merchant ID"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isEnabled: checked })
                }
              />
              <label className="text-sm font-medium">Gateway Ativo</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm}>
              Cancelar
            </Button>
            <Button onClick={handleFormSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedGateway ? 'Salvar Alterações' : 'Criar Gateway'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este gateway de pagamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 