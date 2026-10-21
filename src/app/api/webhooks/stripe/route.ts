import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { sendOrderEmails } from '@/lib/email'
import { toOrderPayload } from '@/lib/orders'
import { getStripe } from '@/lib/stripe'
import type { SubscriptionStatus } from '@/generated/prisma/client'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  // Signature check needs the exact raw body
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (await db.stripeEvent.findUnique({ where: { id: event.id } })) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    await handleEvent(stripe, event)
  } catch (err) {
    console.error(`Webhook ${event.type} failed:`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 }) // Stripe will retry
  }

  await db.stripeEvent.create({ data: { id: event.id, type: event.type } }).catch(() => {})
  return NextResponse.json({ received: true })
}

async function handleEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object
      if (session.mode === 'payment' && session.payment_status === 'paid') await markOrderPaid(session)
      if (session.mode === 'subscription') await activateSubscription(stripe, session)
      break
    }
    case 'checkout.session.expired':
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object
      if (session.mode === 'payment') {
        await db.order.updateMany({
          where: { stripeSessionId: session.id, status: 'PENDING_PAYMENT' },
          data: { status: 'CANCELLED' },
        })
      } else {
        await db.subscription.updateMany({
          where: { stripeSessionId: session.id, status: 'INCOMPLETE' },
          data: { status: 'CANCELED' },
        })
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
    case 'customer.subscription.resumed':
      await syncSubscription(event.data.object)
      break
  }
}

async function markOrderPaid(session: Stripe.Checkout.Session) {
  // Only the first transition sends emails, so retries are harmless
  const { count } = await db.order.updateMany({
    where: { stripeSessionId: session.id, status: 'PENDING_PAYMENT' },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      stripePaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
    },
  })
  if (count === 0) return
  const order = await db.order.findUnique({ where: { stripeSessionId: session.id }, include: { items: true } })
  if (order) await sendOrderEmails(toOrderPayload(order), { paid: true }).catch(err => console.error('Order email failed:', err))
}

async function activateSubscription(stripe: Stripe, session: Stripe.Checkout.Session) {
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
  if (!subscriptionId) return
  const sub = await stripe.subscriptions.retrieve(subscriptionId)
  await db.subscription.updateMany({
    where: { stripeSessionId: session.id },
    data: {
      stripeSubscriptionId: sub.id,
      stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
      ...subscriptionFields(sub),
    },
  })
}

async function syncSubscription(sub: Stripe.Subscription) {
  await db.subscription.updateMany({ where: { stripeSubscriptionId: sub.id }, data: subscriptionFields(sub) })
}

function subscriptionFields(sub: Stripe.Subscription) {
  const periodEnd = sub.items.data[0]?.current_period_end
  return {
    status: mapStatus(sub),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
  }
}

function mapStatus(sub: Stripe.Subscription): SubscriptionStatus {
  if (sub.pause_collection || sub.status === 'paused') return 'PAUSED'
  switch (sub.status) {
    case 'active':
    case 'trialing':
      return 'ACTIVE'
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE'
    case 'canceled':
    case 'incomplete_expired':
      return 'CANCELED'
    default:
      return 'INCOMPLETE'
  }
}
