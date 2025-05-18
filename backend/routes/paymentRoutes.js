const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, requireRole } = require('../middleware/auth');

// Middleware para autenticação de administrador
const adminAuth = [auth, requireRole('admin')];

// Obter todas as transações (admin only)
router.get('/', adminAuth, paymentController.getPayments);

// Estatísticas de pagamento (admin only)
router.get('/statistics', adminAuth, async (req, res) => {
  try {
    // No futuro, implementar busca de estatísticas do banco de dados
    // Por enquanto, retorna dados mockados
    res.json({
      totalRevenue: 12580.75,
      totalTransactions: 143,
      pendingTransactions: 12,
      refundedTransactions: 8,
      revenueByDay: [
        { date: '2023-05-01', amount: 1200.50 },
        { date: '2023-05-02', amount: 980.25 },
        { date: '2023-05-03', amount: 1450.00 },
        { date: '2023-05-04', amount: 875.00 },
        { date: '2023-05-05', amount: 1320.75 },
        { date: '2023-05-06', amount: 950.25 },
        { date: '2023-05-07', amount: 1100.00 }
      ],
      paymentMethodDistribution: [
        { method: 'Visa', count: 58 },
        { method: 'Mastercard', count: 42 },
        { method: 'PayPal', count: 25 },
        { method: 'Stripe', count: 15 },
        { method: 'Google Pay', count: 3 }
      ]
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas de pagamento:', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de pagamento' });
  }
});

// Obter configurações de métodos de pagamento (admin only)
router.get('/methods', adminAuth, async (req, res) => {
  try {
    // No futuro, implementar busca de métodos de pagamento do banco de dados
    // Por enquanto, retorna dados mockados
    res.json([
      { id: 'visa', name: 'Visa', enabled: true, processingFee: 2.5 },
      { id: 'mastercard', name: 'Mastercard', enabled: true, processingFee: 2.5 },
      { id: 'stripe', name: 'Stripe', enabled: true, processingFee: 2.9 },
      { id: 'paypal', name: 'PayPal', enabled: true, processingFee: 3.5 },
      { id: 'googlepay', name: 'Google Pay', enabled: true, processingFee: 2.2 }
    ]);
  } catch (err) {
    console.error('Erro ao buscar métodos de pagamento:', err);
    res.status(500).json({ error: 'Erro ao buscar métodos de pagamento' });
  }
});

// Salvar configurações de métodos de pagamento (admin only)
router.post('/methods', adminAuth, async (req, res) => {
  try {
    const { methods } = req.body;
    
    // No futuro, implementar salvamento no banco de dados
    // Por enquanto, apenas log e retorna sucesso
    console.log('Métodos de pagamento atualizados:', methods);
    
    res.json({ success: true, message: 'Métodos de pagamento atualizados com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar métodos de pagamento:', err);
    res.status(500).json({ error: 'Erro ao atualizar métodos de pagamento' });
  }
});

// Obter política de reembolso (admin only)
router.get('/refund-policy', adminAuth, async (req, res) => {
  try {
    // No futuro, implementar busca da política de reembolso do banco de dados
    // Por enquanto, retorna dados mockados
    res.json({
      refundPeriod: 14,
      refundPolicy: 'Política padrão de reembolso de 14 dias.',
      automaticRefunds: false,
      refundNotifications: true,
      partialRefunds: false,
      processingTime: 3,
      refundMethod: 'original',
      minAmount: 0,
      maxAmount: 0,
      refundFees: false,
      additionalNotes: ''
    });
  } catch (err) {
    console.error('Erro ao buscar política de reembolso:', err);
    res.status(500).json({ error: 'Erro ao buscar política de reembolso' });
  }
});

// Salvar política de reembolso (admin only)
router.post('/refund-policy', adminAuth, async (req, res) => {
  try {
    const policy = req.body;
    
    // No futuro, implementar salvamento no banco de dados
    // Por enquanto, apenas log e retorna sucesso
    console.log('Política de reembolso atualizada:', policy);
    
    res.json({ success: true, message: 'Política de reembolso atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar política de reembolso:', err);
    res.status(500).json({ error: 'Erro ao atualizar política de reembolso' });
  }
});

// Criar sessão de pagamento
router.post('/sessions', auth, paymentController.createPaymentSession);

// Aprovar transação (admin only)
router.post('/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // No futuro, implementar aprovação no banco de dados
    // Por enquanto, apenas log e retorna sucesso
    console.log('Transação aprovada:', id);
    
    res.json({ success: true, message: 'Transação aprovada com sucesso' });
  } catch (err) {
    console.error('Erro ao aprovar transação:', err);
    res.status(500).json({ error: 'Erro ao aprovar transação' });
  }
});

// Reembolsar transação (admin only)
router.post('/:id/refund', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    // No futuro, implementar reembolso no banco de dados
    // Por enquanto, apenas log e retorna sucesso
    console.log('Transação reembolsada:', id, 'Valor:', amount || 'total');
    
    res.json({ success: true, message: 'Transação reembolsada com sucesso' });
  } catch (err) {
    console.error('Erro ao reembolsar transação:', err);
    res.status(500).json({ error: 'Erro ao reembolsar transação' });
  }
});

// Webhook de pagamento
router.post('/webhook', paymentController.handleWebhook);

module.exports = router; 