export const config = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    plans: {
      free: {
        priceId: 'price_1POgOmGeBG5vJPOJDdIzLROL',
        quota: {
          TASKS: 5,
        },
      },
      pro: {
        priceId: 'price_1POgPNGeBG5vJPOJ6WDMkSGp',
        quota: {
          TASKS: 100,
        },
      },
    },
  },
}
