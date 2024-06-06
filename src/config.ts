export const config = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    webhookSecret: '',
    plans: {
      free: {
        priceId: 'price_1POgOmGeBG5vJPOJDdIzLROL',
        quota: {
          TASK: 5,
        },
      },
      pro: {
        priceId: 'price_1POgPNGeBG5vJPOJ6WDMkSGp',
        quota: {
          TASK: 100,
        },
      },
    },
  },
}
