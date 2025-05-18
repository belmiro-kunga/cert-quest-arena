import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Check, X, RefreshCw, Eye } from 'lucide-react';
import { paymentService, Transaction } from '@/services/paymentService';
import { toast } from '@/components/ui/use-toast';

interface PaymentTransactionsTableProps {
  onViewDetails?: (transaction: Transaction) => void;
}

const PaymentTransactionsTable: React.FC<PaymentTransactionsTableProps> = ({ onViewDetails }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filtrar transações com base no status e termo de busca
    let filtered = transactions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.userName?.toLowerCase().includes(query) ||
        transaction.userEmail?.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  }, [statusFilter, searchQuery, transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleApprove = async (transactionId: string) => {
    try {
      const success = await paymentService.approveTransaction(transactionId);
      if (success) {
        toast({
          title: 'Sucesso',
          description: 'Transação aprovada com sucesso',
        });
        
        // Atualizar a lista de transações
        setTransactions(transactions.map(t => 
          t.id === transactionId ? { ...t, status: 'completed' } : t
        ));
      }
    } catch (error) {
      console.error('Erro ao aprovar transação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao aprovar transação',
        variant: 'destructive',
      });
    }
  };

  const handleRefund = async (transactionId: string) => {
    try {
      const success = await paymentService.refundTransaction(transactionId);
      if (success) {
        toast({
          title: 'Sucesso',
          description: 'Reembolso processado com sucesso',
        });
        
        // Atualizar a lista de transações
        setTransactions(transactions.map(t => 
          t.id === transactionId ? { ...t, status: 'refunded' } : t
        ));
      }
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar reembolso',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Transações de Pagamento</CardTitle>
        <CardDescription>Visualize e gerencie todas as transações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, email ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.userName}</span>
                          <span className="text-sm text-muted-foreground">{transaction.userEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                      <TableCell>{formatDate(transaction.paymentDate || transaction.createdAt)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onViewDetails?.(transaction)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {transaction.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApprove(transaction.id)}
                              title="Aprovar"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          
                          {transaction.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRefund(transaction.id)}
                              title="Rejeitar"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          
                          {transaction.status === 'completed' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRefund(transaction.id)}
                              title="Reembolsar"
                            >
                              <RefreshCw className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentTransactionsTable; 