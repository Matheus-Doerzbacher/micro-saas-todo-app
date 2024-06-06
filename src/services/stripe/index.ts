import Stripe from 'stripe'

import { config } from '@/config'
import { prisma } from '../database'

// import { prisma } from '../database'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

export const createStripeCustomer = async (input: {
  name?: string
  email: string
}) => {
  const customer = await getStripeCustomerByEmail(input.email)
  if (customer) return customer

  const createdCustomer = await stripe.customers.create({
    email: input.email,
    name: input.name,
  })

  const createdCustomerSubscription = await stripe.subscriptions.create({
    customer: createdCustomer.id,
    items: [
      {
        price: config.stripe.plans.free.priceId,
      },
    ],
  })

  await prisma.user.update({
    where: { email: input.email },
    data: {
      stripeCustomerId: createdCustomer.id,
      stripeSubscriptionId: createdCustomerSubscription.id,
      stripeSubscriptionStatus: createdCustomerSubscription.status,
      stripePriceId: config.stripe.plans.free.priceId,
    },
  })

  return createdCustomer
}

export const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  userStripeSubscriptionId: string,
) => {
  try {
    const customer = await createStripeCustomer({
      email: userEmail,
    })

    const subscription = await stripe.subscriptionItems.list({
      subscription: userStripeSubscriptionId,
      limit: 1,
    })

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `http://localhost:3000/app/settings/billing`,
      flow_data: {
        type: 'subscription_update_confirm',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: `http://localhost:3000/app/settings/billing?success=true`,
          },
        },
        subscription_update_confirm: {
          subscription: userStripeSubscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: config.stripe.plans.pro.priceId,
              quantity: 1,
            },
          ],
        },
      },
    })
    return {
      url: session.url,
    }
  } catch (error) {
    throw new Error('Error to create checkout session')
  }
}

export const changeToFreeSubscription = async (userEmail: string) => {
  try {
    const customer = await getStripeCustomerByEmail(userEmail)
    if (!customer) {
      throw new Error('Customer not found')
    }

    const currentSubscription = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    })

    if (currentSubscription.data.length === 0) {
      throw new Error('No active subscription found')
    }

    const subscriptionId = currentSubscription.data[0].id

    // Cancel current subscription
    await stripe.subscriptions.cancel(subscriptionId)

    // Create new subscription with the free plan
    const newSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: config.stripe.plans.free.priceId }],
    })

    // Update user data in the database
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        stripeSubscriptionId: newSubscription.id,
        stripeSubscriptionStatus: newSubscription.status,
        stripePriceId: config.stripe.plans.free.priceId,
      },
    })

    return newSubscription
  } catch (error) {
    throw new Error(`Failed to change to free subscription: ${error.message}`)
  }
}

export const handleProcessWebhookUpdatedSubscription = async (event: {
  object: Stripe.Subscription
}) => {
  const stripeCustomerId = event.object.customer as string
  const stripeSubscriptionId = event.object.id as string
  const stripeSubscriptionStatus = event.object.status
  const stripePriceId = event.object.items.data[0].price.id

  const userExists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          stripeSubscriptionId,
        },
        {
          stripeCustomerId,
        },
      ],
    },
    select: {
      id: true,
    },
  })

  if (!userExists) {
    throw new Error('user of stripeCustomerId not found')
  }

  await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus,
      stripePriceId,
    },
  })
}

type Plan = {
  priceId: string
  quota: {
    TASKS: number
  }
}

type Plans = {
  [key: string]: Plan
}

export const getPlanByPrice = (priceId: string) => {
  const plans = config.stripe.plans

  const plankey = Object.keys(plans).find(
    (key) => plans[key].priceId === priceId,
  ) as keyof Plans | undefined

  const plan = plankey ? plans[plankey] : null

  if (!plan) {
    throw new Error(`Plan not found for priceId: ${priceId}`)
  }

  return {
    name: plankey,
    quota: plan.quota,
  }
}

export const getUserCurrentPlan = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const planDetails = getPlanByPrice(user.stripePriceId)

  const tasksCount = await prisma.todo.count({
    where: { userId },
  })

  const availableTasks = planDetails.quota.TASKS
  const usagePercentage = (tasksCount / availableTasks) * 100

  return {
    name: planDetails.name,
    quota: {
      TASKS: {
        available: availableTasks,
        current: tasksCount,
        usage: usagePercentage,
      },
    },
  }
}
