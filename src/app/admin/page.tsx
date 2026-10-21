import Link from 'next/link'
import { db } from '@/lib/db'
import { formatMoney, STATUS_LABELS } from '@/lib/orders'
import { requireAdmin } from '@/lib/session'
import StatusBadge from '../account/StatusBadge'
import type { OrderStatus } from '@/generated/prisma/client'

const PAGE_SIZE = 25
const STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[]

export default async function AdminOrdersPage({ searchParams }: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = STATUSES.find(s => s === params.status)
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const q = (params.q ?? '').trim().slice(0, 100)

  const where = {
    ...(status ? { status } : {}),
    ...(q ? {
      OR: [
        { ref: { contains: q, mode: 'insensitive' as const } },
        { customerEmail: { contains: q, mode: 'insensitive' as const } },
        { customerName: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const [orders, total, toFulfil, revenue, activeSubs] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, ref: true, status: true, customerName: true, customerEmail: true,
        totalCents: true, currency: true, createdAt: true, _count: { select: { items: true } },
      },
    }),
    db.order.count({ where }),
    db.order.count({ where: { status: { in: ['PAID', 'REQUESTED', 'PREPARING'] } } }),
    db.order.aggregate({
      where: { status: { in: ['PAID', 'PREPARING', 'DISPATCHED', 'DELIVERED'] }, paidAt: { gte: monthStart } },
      _sum: { totalCents: true },
    }),
    db.subscription.count({ where: { status: 'ACTIVE' } }),
  ])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const href = (next: { status?: string; page?: number }) => {
    const sp = new URLSearchParams()
    const s = 'status' in next ? next.status : status
    if (s) sp.set('status', s)
    if (q) sp.set('q', q)
    if (next.page && next.page > 1) sp.set('page', String(next.page))
    const qs = sp.toString()
    return qs ? `/admin?${qs}` : '/admin'
  }

  return (
    <>
      <h1 className="pt-title">Orders</h1>
      <div className="pt-stats">
        <div className="pt-stat"><strong>{toFulfil}</strong><span>To fulfil</span></div>
        <div className="pt-stat"><strong>{formatMoney(revenue._sum.totalCents ?? 0)}</strong><span>Paid this month</span></div>
        <div className="pt-stat"><strong>{activeSubs}</strong><span>Active subscriptions</span></div>
      </div>

      <form className="pt-form" style={{ flexDirection: 'row', marginBottom: 16, maxWidth: 520 }}>
        {status && <input type="hidden" name="status" value={status} />}
        <input className="pt-input" name="q" defaultValue={q} placeholder="Search ref, name or email" aria-label="Search orders" />
        <button className="pt-button pt-button-ghost">Search</button>
      </form>

      <nav className="pt-filters" aria-label="Filter by status">
        <Link href={href({ status: undefined })} aria-current={!status ? 'page' : undefined}>All</Link>
        {STATUSES.map(s => (
          <Link key={s} href={href({ status: s })} aria-current={status === s ? 'page' : undefined}>{STATUS_LABELS[s]}</Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="pt-muted">No orders match.</p>
      ) : (
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr><th>Ref</th><th>Placed</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`}>{o.ref}</Link></td>
                  <td>{o.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{o.customerName}<br /><span className="pt-muted">{o.customerEmail}</span></td>
                  <td>{o._count.items}</td>
                  <td>{formatMoney(o.totalCents, o.currency)}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="pt-actions">
          {page > 1 && <Link className="pt-button pt-button-ghost" href={href({ page: page - 1 })}>Previous</Link>}
          <span className="pt-muted" style={{ alignSelf: 'center' }}>Page {page} of {pages}</span>
          {page < pages && <Link className="pt-button pt-button-ghost" href={href({ page: page + 1 })}>Next</Link>}
        </div>
      )}
    </>
  )
}
