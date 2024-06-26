'use server'

import { auth } from '@/services/auth'
import { createCheckoutSession } from '@/services/stripe'
import { redirect } from 'next/navigation'

export async function createCheckoutSessionAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Não autorizado',
      data: null,
    }
  }

  const chechkoutSession = await createCheckoutSession(
    session.user.id,
    session.user.email,
    session.user.stripeSubscriptionId as string,
  )

  if (!chechkoutSession.url) return
  redirect(chechkoutSession.url)
}
