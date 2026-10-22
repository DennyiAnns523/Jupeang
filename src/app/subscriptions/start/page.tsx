import Link from 'next/link'
import { PLAN_IDS, PLANS, planBillingAmount, planDeliveryPrice, type PlanId } from '@/lib/pricing'
import { requireUser } from '@/lib/session'
import StartForm from './StartForm'

export const metadata = { title: 'Start your subscription — Üli' }

export default async function StartSubscriptionPage({ searchParams }: {
  searchParams: Promise<{ plan?: string; cycle?: string }>
}) {
  const params = await searchParams
  const plan: PlanId = PLAN_IDS.find(p => p === params.plan) ?? 'biweekly'
  const cycle = params.cycle === 'annual' ? 'annual' : 'monthly'
  const user = await requireUser(`/subscriptions/start?plan=${plan}&cycle=${cycle}`)

  const perDelivery = planDeliveryPrice(plan, cycle)
  const billed = planBillingAmount(plan, cycle)

  return (
    <main className="pt-page pt-center">
      <div className="pt-card" style={{ width: 'min(620px, 100%)' }}>
        <Link href="/subscriptions" className="pt-link" style={{ fontSize: '0.75rem' }}>← Change plan</Link>
        <p className="pt-eyebrow" style={{ marginTop: 24 }}>{PLANS[plan].name} subscription</p>
        <h1 className="pt-title">Where should we deliver?</h1>
        <p className="pt-muted" style={{ marginTop: 0 }}>
          ${perDelivery} per delivery{cycle === 'annual' ? `, billed $${billed} yearly` : ''}. Deliveries run Tuesday to Saturday.
          You can pause or cancel anytime from your account.
        </p>
        <StartForm plan={plan} cycle={cycle} defaultName={user.name ?? ''} />
      </div>
    </main>
  )
}
