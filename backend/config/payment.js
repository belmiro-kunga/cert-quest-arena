const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');

// Configuração do PayPal
let paypalClient;
if (process.env.NODE_ENV === 'production') {
    paypalClient = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
} else {
    paypalClient = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
}
const paypalInstance = new paypal.core.PayPalHttpClient(paypalClient);

module.exports = {
    stripe,
    paypalInstance
}; 