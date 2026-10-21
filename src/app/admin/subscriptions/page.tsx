import { db } from '@/lib/db'
import { formatMoney } from '@/lib/orders'
import { PLANS } from '@/lib/pricing'
import { requireAdmin } from '@/lib/session'
import StatusBadge from '../../account/StatusBadge'

const PLAN_NAMES = Object.fromEntries(Object.values(PLANS).map(p => [p.interval, p.name]))

export default async function AdminSubscriptionsPage() {
  await requireAdmin()
  const subscriptions = await db.subscription.findMany({
    where: { status: { not: 'INCOMPLETE' } },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { user: { select: { email: true, name: true } } },
  })

  return (
    <>
      <h1 className="pt-title">Subscriptions</h1>
      <p className="pt-muted">Pauses, cancellations and refunds are handled in the Stripe dashboard.</p>
      {subscriptions.length === 0 ? (
        <p className="pt-muted">No subscriptions yet.</p>
      ) : (
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr><th>Customer</th><th>Plan</th><th>Status</th><th>Price</th><th>Deliver to</th><th>Renews</th></tr>
            </thead>
            <tbody>
              {subscriptions.map(s => (
                <tr key={s.id}>
                  <td>{s.user.name}<br /><span className="pt-muted">{s.user.email}</span></td>
                  <td>{PLAN_NAMES[s.plan]}{s.cycle === 'ANNUAL' ? ' (annual)' : ''}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{formatMoney(s.priceCents)}</td>
                  <td>{s.recipientName}<br /><span className="pt-muted">{s.address}, {s.city} {s.postcode}</span>{s.notes && <><br /><span className="pt-muted">{s.notes}</span></>}</td>
                  <td>{s.currentPeriodEnd?.toLocaleDateString('en-US', { dateStyle: 'medium' }) ?? '—'}{s.cancelAtPeriodEnd && ' (ends)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
