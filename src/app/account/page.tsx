import Link from 'next/link'
import { db } from '@/lib/db'
import { formatMoney } from '@/lib/orders'
import { PLANS } from '@/lib/pricing'
import { requireUser } from '@/lib/session'
import { openBillingPortalAction } from './actions'
import StatusBadge from './StatusBadge'

export const metadata = { title: 'My account — Üli' }

const PLAN_NAMES = Object.fromEntries(Object.values(PLANS).map(p => [p.interval, p.name]))

export default async function AccountPage() {
  const user = await requireUser('/account')
  const [orders, subscriptions] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, ref: true, status: true, totalCents: true, currency: true, createdAt: true },
    }),
    db.subscription.findMany({
      where: { userId: user.id, status: { not: 'CANCELED' } },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  const hasBilling = subscriptions.some(s => s.stripeCustomerId)

  return (
    <>
      <section className="pt-section">
        <h2 className="pt-subtitle">Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="pt-muted">
            No flower subscriptions yet. <Link className="pt-link" href="/subscriptions">Explore plans</Link>
          </p>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr><th>Plan</th><th>Status</th><th>Price</th><th>Delivering to</th><th>Renews</th></tr>
              </thead>
              <tbody>
                {subscriptions.map(s => (
                  <tr key={s.id}>
                    <td>{PLAN_NAMES[s.plan]}{s.cycle === 'ANNUAL' ? ' (annual)' : ''}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>{formatMoney(s.priceCents)}</td>
                    <td>{s.recipientName}, {s.city}</td>
                    <td>
                      {s.currentPeriodEnd?.toLocaleDateString('en-US', { dateStyle: 'medium' }) ?? '—'}
                      {s.cancelAtPeriodEnd && ' (ends)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hasBilling && (
          <form action={openBillingPortalAction} className="pt-actions">
            <button className="pt-button pt-button-ghost">Pause, cancel or update card</button>
          </form>
        )}
      </section>

      <section className="pt-section">
        <h2 className="pt-subtitle">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="pt-muted">
            You haven&apos;t placed an order yet. <Link className="pt-link" href="/collections">Visit the shop</Link>
          </p>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.ref}</td>
                    <td>{o.createdAt.toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{formatMoney(o.totalCents, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="pt-muted"><Link className="pt-link" href="/account/orders">All orders</Link></p>
      </section>
    </>
  )
}
