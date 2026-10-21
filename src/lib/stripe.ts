import 'server-only'
import Stripe from 'stripe'

let stripe: Stripe | null = null

/** Returns null when Stripe isn't configured; checkout then falls back to order requests. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY)
  return stripe
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}
