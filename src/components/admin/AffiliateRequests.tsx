import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

interface AffiliateRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
}

// Dados de exemplo
const MOCK_REQUESTS: AffiliateRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Test User',
    userEmail: 'user@certquest.com',
    status: 'pending',
    applicationDate: '2025-05-11',
  },
];

export const AffiliateRequests = () => {
  const handleApprove = (requestId: string) => {
    // Aqui você implementaria a lógica real de aprovação
    toast({
      title: "Solicitação aprovada",
      description: "O usuário foi notificado por email",
    });
  };

  const handleReject = (requestId: string) => {
    // Aqui você implementaria a lógica real de rejeição
    toast({
      title: "Solicitação rejeitada",
      description: "O usuário foi notificado por email",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Afiliados</CardTitle>
        <CardDescription>
          Gerencie as solicitações de novos afiliados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_REQUESTS.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.userName}</TableCell>
                <TableCell>{request.userEmail}</TableCell>
                <TableCell>
                  {format(new Date(request.applicationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === 'pending'
                        ? 'default'
                        : request.status === 'approved'
                        ? 'success'
                        : 'destructive'
                    }
                  >
                    {request.status === 'pending'
                      ? 'Pendente'
                      : request.status === 'approved'
                      ? 'Aprovado'
                      : 'Rejeitado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
