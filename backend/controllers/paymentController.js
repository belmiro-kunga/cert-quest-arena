const { stripe, paypalInstance } = require('../config/payment');
const { Pool } = require('pg');
const paypal = require('@paypal/checkout-server-sdk');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'simulado',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const paymentController = {
    // Buscar todos os pagamentos
    async getPayments(req, res) {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM payments ORDER BY created_at DESC');
            res.json(result.rows);
        } catch (err) {
            console.error('Erro ao buscar pagamentos:', err);
            res.status(500).json({ error: 'Erro ao buscar pagamentos' });
        } finally {
            client.release();
        }
    },

    // Criar sessão de pagamento
    async createPaymentSession(req, res) {
        const { pedido_id, valor_total, items } = req.body;
        const client = await pool.connect();
        
        try {
            // Criar sessão no Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: items.map(item => ({
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: item.title,
                            description: item.description,
                        },
                        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                })),
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            });

            // Registrar pagamento no banco
            await client.query(
                'INSERT INTO payments (pedido_id, valor, status, provider, provider_payment_id) VALUES ($1, $2, $3, $4, $5)',
                [pedido_id, valor_total, 'pending', 'stripe', session.id]
            );

            res.json({ sessionId: session.id });
        } catch (err) {
            console.error('Erro ao criar sessão de pagamento:', err);
            res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
        } finally {
            client.release();
        }
    },

    // Webhook para atualizações de pagamento
    async handleWebhook(req, res) {
        const client = await pool.connect();
        try {
            const event = req.body;
            
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    await client.query(
                        'UPDATE payments SET status = $1 WHERE provider_payment_id = $2',
                        ['completed', session.id]
                    );
                    break;
                    
                case 'checkout.session.expired':
                    await client.query(
                        'UPDATE payments SET status = $1 WHERE provider_payment_id = $2',
                        ['expired', event.data.object.id]
                    );
                    break;
            }
            
            res.json({ received: true });
        } catch (err) {
            console.error('Erro ao processar webhook:', err);
            res.status(500).json({ error: 'Erro ao processar webhook' });
        } finally {
            client.release();
        }
    }
};

module.exports = paymentController; 