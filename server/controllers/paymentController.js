const { stripe, paypalInstance } = require('../config/payment');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');
const paypal = require('@paypal/checkout-server-sdk');

const pool = mysql.createPool(dbConfig);

const paymentController = {
    // Criar sessão de pagamento
    async createPaymentSession(req, res) {
        const { method, orderId, amount } = req.body;
        
        try {
            const connection = await pool.getConnection();
            
            // Buscar informações do pedido
            const [order] = await connection.execute(
                'SELECT * FROM orders WHERE id = ?',
                [orderId]
            );

            if (!order.length) {
                connection.release();
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }

            let paymentIntent;

            switch (method) {
                case 'STRIPE':
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: Math.round(amount * 100), // Stripe usa centavos
                        currency: 'brl',
                        metadata: { orderId }
                    });
                    break;

                case 'PAYPAL':
                    const request = new paypal.orders.OrdersCreateRequest();
                    request.prefer("return=representation");
                    request.requestBody({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            amount: {
                                currency_code: 'BRL',
                                value: amount.toString()
                            },
                            reference_id: orderId.toString()
                        }]
                    });
                    paymentIntent = await paypalInstance.execute(request);
                    break;

                default:
                    return res.status(400).json({ error: 'Método de pagamento não suportado' });
            }

            // Registrar a transação
            await connection.execute(
                'INSERT INTO payment_transactions (order_id, payment_method_id, transaction_id, amount, status, payment_data) VALUES (?, (SELECT id FROM payment_methods WHERE code = ?), ?, ?, ?, ?)',
                [
                    orderId,
                    method,
                    paymentIntent.id || paymentIntent.response?.id,
                    amount,
                    'pending',
                    JSON.stringify(paymentIntent)
                ]
            );

            connection.release();
            res.json({ paymentIntent });

        } catch (error) {
            console.error('Erro ao criar sessão de pagamento:', error);
            res.status(500).json({ error: 'Erro ao processar pagamento' });
        }
    },

    // Confirmar pagamento
    async confirmPayment(req, res) {
        const { paymentId, method } = req.body;

        try {
            const connection = await pool.getConnection();

            // Buscar transação
            const [transaction] = await connection.execute(
                'SELECT * FROM payment_transactions WHERE transaction_id = ?',
                [paymentId]
            );

            if (!transaction.length) {
                connection.release();
                return res.status(404).json({ error: 'Transação não encontrada' });
            }

            let paymentConfirmation;

            switch (method) {
                case 'STRIPE':
                    paymentConfirmation = await stripe.paymentIntents.confirm(paymentId);
                    break;

                case 'PAYPAL':
                    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
                    paymentConfirmation = await paypalInstance.execute(request);
                    break;

                default:
                    return res.status(400).json({ error: 'Método de pagamento não suportado' });
            }

            // Atualizar status da transação
            await connection.execute(
                'UPDATE payment_transactions SET status = ?, payment_data = ? WHERE transaction_id = ?',
                [
                    'completed',
                    JSON.stringify(paymentConfirmation),
                    paymentId
                ]
            );

            // Atualizar status do pedido
            await connection.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['aprovado', transaction[0].order_id]
            );

            connection.release();
            res.json({ success: true, paymentConfirmation });

        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error);
            res.status(500).json({ error: 'Erro ao confirmar pagamento' });
        }
    },

    // Webhook para atualizações de pagamento
    async handleWebhook(req, res) {
        const signature = req.headers['stripe-signature'] || 
                         req.headers['paypal-transmission-sig'];
        
        try {
            let event;

            switch (true) {
                case !!req.headers['stripe-signature']:
                    event = stripe.webhooks.constructEvent(
                        req.body,
                        signature,
                        process.env.STRIPE_WEBHOOK_SECRET
                    );
                    break;

                case !!req.headers['paypal-transmission-sig']:
                    // Verificação do webhook do PayPal
                    // Implementar verificação específica do PayPal se necessário
                    event = req.body;
                    break;

                default:
                    return res.status(400).json({ error: 'Assinatura do webhook não reconhecida' });
            }

            const connection = await pool.getConnection();

            // Processar o evento e atualizar o status da transação
            let transactionId, newStatus;

            switch (event.type) {
                case 'payment_intent.succeeded':
                case 'PAYMENT.CAPTURE.COMPLETED':
                    newStatus = 'completed';
                    break;
                case 'payment_intent.payment_failed':
                case 'PAYMENT.CAPTURE.DENIED':
                    newStatus = 'failed';
                    break;
                default:
                    newStatus = 'processing';
            }

            transactionId = event.data?.object?.id || event.resource?.id;

            if (transactionId) {
                await connection.execute(
                    'UPDATE payment_transactions SET status = ?, payment_data = ? WHERE transaction_id = ?',
                    [newStatus, JSON.stringify(event), transactionId]
                );

                // Atualizar status do pedido se necessário
                if (newStatus === 'completed') {
                    await connection.execute(
                        `UPDATE orders o 
                         JOIN payment_transactions pt ON o.id = pt.order_id 
                         SET o.status = 'aprovado' 
                         WHERE pt.transaction_id = ?`,
                        [transactionId]
                    );
                }
            }

            connection.release();
            res.json({ received: true });

        } catch (error) {
            console.error('Erro no webhook:', error);
            res.status(400).json({ error: 'Erro no webhook' });
        }
    }
};

module.exports = paymentController; 