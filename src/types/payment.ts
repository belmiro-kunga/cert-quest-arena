
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

export interface PaymentWithProfile extends Payment {
  profile?: {
    name: string;
  }
}
