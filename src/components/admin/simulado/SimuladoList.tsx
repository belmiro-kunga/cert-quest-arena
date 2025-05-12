import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Simulado } from '@/services/simuladoService';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SimuladoListProps {
  simulados: Simulado[];
  onEdit: (simulado: Simulado) => void;
  onDelete: (simulado: Simulado) => void;
  onManageQuestions: (simulado: Simulado) => void;
}

const SimuladoList: React.FC<SimuladoListProps> = ({ 
  simulados, 
  onEdit, 
  onDelete,
  onManageQuestions 
}) => {
  // Função para formatar a data de criação
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data desconhecida';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (ativo?: boolean) => {
    if (ativo === undefined) return null;
    
    return ativo ? (
      <Badge variant="default" className="bg-green-500">Ativo</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500">Inativo</Badge>
    );
  };

  // Função para renderizar o badge de dificuldade
  const renderDifficultyBadge = (nivel?: string) => {
    if (!nivel) return null;
    
    const colorMap: Record<string, string> = {
      'Fácil': 'bg-green-500',
      'Médio': 'bg-yellow-500',
      'Difícil': 'bg-orange-500',
      'Avançado': 'bg-red-500'
    };
    
    const bgColor = colorMap[nivel] || 'bg-blue-500';
    
    return (
      <Badge variant="secondary" className={bgColor}>
        {nivel}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Dificuldade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {simulados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhum simulado encontrado. Crie um novo simulado para começar.
              </TableCell>
            </TableRow>
          ) : (
            simulados.map((simulado) => (
              <TableRow key={simulado.id}>
                <TableCell className="font-medium">{simulado.titulo}</TableCell>
                <TableCell>{simulado.duracao_minutos} minutos</TableCell>
                <TableCell>{renderDifficultyBadge(simulado.nivel_dificuldade)}</TableCell>
                <TableCell>{renderStatusBadge(simulado.ativo)}</TableCell>
                <TableCell>{formatDate(simulado.data_criacao)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(simulado)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageQuestions(simulado)}>
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="16"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        Questões
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(simulado)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimuladoList;
