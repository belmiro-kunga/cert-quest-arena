export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  transactionId?: string;
}
