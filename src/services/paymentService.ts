export interface PaymentStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  revenueByDay: Array<{ date: string; revenue: number }>;
  paymentMethodDistribution: Array<{ method: string; count: number; percentage: number }>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  userId: string;
  userEmail: string;
  description: string;
  paymentDate: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  config: {
    apiKey?: string;
    merchantId?: string;
    stripeApiKey?: string;
    paypalEmail?: string;
    googlePayMerchantId?: string;
    [key: string]: any;
  };
}

export interface RefundPolicy {
  refundPeriod: number;
  refundPolicy: string;
  automaticRefunds: boolean;
  refundNotifications: boolean;
  additionalNotes: string;
  partialRefunds: boolean;
  refundReasons: string[];
  processingTime: number;
  refundMethod: 'original' | 'transfer';
  minAmount: number;
  maxAmount: number;
  refundFees: boolean;
  adminApprovalRequired: boolean;
  partialRefundsAllowed: boolean;
  refundProcessingTime: number;
  refundFeeDeduction: number;
  blacklistOnRefund: boolean;
}

const paymentService = {
  async getPaymentStatistics(): Promise<PaymentStatistics> {
    // Mock implementation
    return {
      totalRevenue: 15000,
      monthlyRevenue: 3500,
      totalTransactions: 45,
      pendingTransactions: 3,
      refundedTransactions: 2,
      successfulPayments: 40,
      failedPayments: 3,
      averageOrderValue: 150,
      revenueByDay: [
        { date: '2024-01-01', revenue: 500 },
        { date: '2024-01-02', revenue: 750 },
        { date: '2024-01-03', revenue: 600 }
      ],
      paymentMethodDistribution: [
        { method: 'credit_card', count: 25, percentage: 62.5 },
        { method: 'pix', count: 10, percentage: 25 },
        { method: 'boleto', count: 5, percentage: 12.5 }
      ]
    };
  },

  async getTransactions(): Promise<Transaction[]> {
    // Mock implementation
    return [
      {
        id: '1',
        amount: 150,
        currency: 'BRL',
        status: 'completed',
        paymentMethod: 'credit_card',
        userId: 'user1',
        userEmail: 'user@example.com',
        description: 'Simulado AWS SAA',
        paymentDate: '2024-01-15T10:30:00Z',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      }
    ];
  },

  async approveTransaction(transactionId: string): Promise<void> {
    console.log('Approving transaction:', transactionId);
  },

  async refundTransaction(transactionId: string): Promise<void> {
    console.log('Refunding transaction:', transactionId);
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Mock implementation
    return [
      {
        id: 'stripe',
        name: 'Stripe',
        enabled: true,
        processingFee: 2.9,
        config: {
          apiKey: '',
          merchantId: ''
        }
      },
      {
        id: 'paypal',
        name: 'PayPal',
        enabled: false,
        processingFee: 3.5,
        config: {
          paypalEmail: ''
        }
      }
    ];
  },

  async savePaymentMethods(methods: PaymentMethod[]): Promise<void> {
    console.log('Saving payment methods:', methods);
  },

  async getRefundPolicy(): Promise<RefundPolicy> {
    // Mock implementation
    return {
      refundPeriod: 30,
      refundPolicy: 'full',
      automaticRefunds: false,
      refundNotifications: true,
      additionalNotes: '',
      partialRefunds: true,
      refundReasons: ['Insatisfação', 'Problema técnico', 'Duplicação'],
      processingTime: 5,
      refundMethod: 'original',
      minAmount: 10,
      maxAmount: 1000,
      refundFees: false,
      adminApprovalRequired: true,
      partialRefundsAllowed: true,
      refundProcessingTime: 5,
      refundFeeDeduction: 0,
      blacklistOnRefund: false
    };
  },

  async saveRefundPolicy(policy: RefundPolicy): Promise<void> {
    console.log('Saving refund policy:', policy);
  }
};

export default paymentService;
