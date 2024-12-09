'use strict';

const Stripe = require('stripe');
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
    async dynamicCheckout(ctx) {
        try {
            const { productId, options, finalPrice, userEmail } = ctx.request.body;

            if (!productId || !finalPrice || !userEmail) {
                return ctx.badRequest('Product ID, final price, and user email are required');
            }

            // Инициализация Stripe с использованием ключа из конфигурации
            const stripeSettings = await strapi.plugin('strapi-stripe').service('stripeService').initialize();
            const stripeKey = stripeSettings.isLiveMode
                ? process.env.STRAPI_ADMIN_LIVE_STRIPE_SECRET_KEY
                : process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY;
            const stripe = new Stripe(stripeKey);

            // Создание Checkout Session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd', // Укажите нужную валюту
                            product_data: {
                                name: `Custom Product ${productId}`,
                                description: `Dynamic options: ${options ? options.join(', ') : ''}`,
                            },
                            unit_amount: finalPrice * 100, // Цена в центах
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${stripeSettings.checkoutSuccessUrl}?sessionId={CHECKOUT_SESSION_ID}`,
                cancel_url: `${stripeSettings.checkoutCancelUrl}`,
                customer_email: userEmail,
            });

            ctx.send({ sessionId: session.id, url: session.url });
        } catch (error) {
            strapi.log.error('Stripe Error:', error);
            ctx.internalServerError('Unable to create dynamic price session');
        }
    },
};