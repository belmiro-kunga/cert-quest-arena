export interface Purchase {
  id: string;
  userId: string;
  simuladoId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  paymentMethod: 'credit_card' | 'pix' | 'bank_transfer';
  purchaseDate: Date;
  expirationDate: Date;
  accessCode?: string;
  transactionId?: string;
}

export interface SimuladoAccess {
  id: string;
  userId: string;
  simuladoId: string;
  purchaseId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  lastAccess?: Date;
  progress?: {
    completedQuestions: number;
    totalQuestions: number;
    score?: number;
  };
} 