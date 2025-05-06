import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Payment } from '@/types/payment';
import axios from 'axios';
import { formatCurrency } from '@/lib/utils';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Adiciona o token de autenticação em todas as requisições
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchPayments = async () => {
    try {
      const response = await api.get('/api/admin/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      toast.error('Não foi possível carregar os pagamentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>ID da Transação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.userName}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>{payment.transactionId || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
