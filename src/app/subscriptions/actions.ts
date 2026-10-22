'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { PLANS, planBillingAmount } from '@/lib/pricing'
import { rateLimit } from '@/lib/security'
import { requireUser } from '@/lib/session'
import { getStripe, siteUrl } from '@/lib/stripe'
import { fieldErrors, subscriptionInput } from '@/lib/validation'
import type { FormState } from '../auth/actions'

export async function startSubscriptionAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser('/subscriptions')
  const parsed = subscriptionInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { fields: fieldErrors(parsed.error) }
  const input = parsed.data

  const stripe = getStripe()
  if (!stripe) return { error: 'Online subscriptions are not available yet. Please contact us to subscribe.' }
  if (!(await rateLimit(`subscribe:${user.id}`, 10, 60 * 60))) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  const plan = PLANS[input.plan]
  const amount = planBillingAmount(input.plan, input.cycle)

  // Reuse the customer's Stripe record so the billing portal shows everything
  const previous = await db.subscription.findFirst({
    where: { userId: user.id, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  })

  const subscription = await db.subscription.create({
    data: {
      userId: user.id,
      plan: plan.interval,
      cycle: input.cycle === 'annual' ? 'ANNUAL' : 'STANDARD',
      priceCents: amount * 100,
      recipientName: input.recipientName,
      address: input.address,
      city: input.city,
      postcode: input.postcode,
      notes: input.notes || null,
    },
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(previous?.stripeCustomerId ? { customer: previous.stripeCustomerId } : { customer_email: user.email }),
    client_reference_id: subscription.id,
    metadata: { subscriptionId: subscription.id },
    subscription_data: { metadata: { subscriptionId: subscription.id, userId: user.id } },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: amount * 100,
        recurring: input.cycle === 'annual'
          ? { interval: 'year' }
          : { interval: plan.stripe.interval, interval_count: plan.stripe.count },
        product_data: { name: `Üli ${plan.name} flowers${input.cycle === 'annual' ? ' (annual)' : ''}` },
      },
    }],
    success_url: `${siteUrl()}/account?subscribed=1`,
    cancel_url: `${siteUrl()}/subscriptions`,
  })

  await db.subscription.update({ where: { id: subscription.id }, data: { stripeSessionId: session.id } })
  redirect(session.url!)
}
