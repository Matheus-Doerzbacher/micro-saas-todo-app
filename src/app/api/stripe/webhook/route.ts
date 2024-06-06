import {
  handleProcessWebhookUpdatedSubscription,
  stripe,
} from '@/services/stripe'
import { headers } from 'next/headers'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY as string,
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Webhook Error: ${error.message}`)
      return new Response(`Webhook Error: ${error.message}`, {
        status: 400,
      })
    } else {
      console.error('Webhook Error: Unknown error')
      return new Response('Webhook Error: Unknown error', {
        status: 400,
      })
    }
  }
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleProcessWebhookUpdatedSubscription(event.data)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new Response(`{ "received": true }`, { status: 200 })
}
