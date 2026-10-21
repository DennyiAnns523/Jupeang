import Link from 'next/link'
import { db } from '@/lib/db'
import { formatMoney } from '@/lib/orders'
import { addonLabels } from '@/lib/pricing'
import { requireUser } from '@/lib/session'
import StatusBadge from '../StatusBadge'

export const metadata = { title: 'My orders — Jupeang' }

export default async function OrdersPage() {
  const user = await requireUser('/account/orders')
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { items: true },
  })

  if (orders.length === 0) {
    return (
      <p className="pt-muted">
        No orders yet. <Link className="pt-link" href="/collections">Visit the shop</Link>
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {orders.map(order => (
        <article key={order.id} className="pt-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <p className="pt-eyebrow" style={{ marginBottom: 4 }}>{order.ref}</p>
              <span className="pt-muted">
                {order.createdAt.toLocaleDateString('en-US', { dateStyle: 'long' })} · {order.city}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StatusBadge status={order.status} />
              <div className="pt-subtitle" style={{ margin: '8px 0 0' }}>{formatMoney(order.totalCents, order.currency)}</div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {order.items.map(item => (
              <li key={item.id} className="pt-muted" style={{ borderTop: '1px solid var(--color-border)', padding: '8px 0' }}>
                {item.productName} · {item.size} × {item.quantity}
                {item.addons.length > 0 && ` · ${addonLabels(item.addons).join(', ')}`}
                {item.deliveryDate && ` · delivery ${item.deliveryDate}`}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
