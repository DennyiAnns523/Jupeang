import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { formatMoney, STATUS_LABELS } from '@/lib/orders'
import { addonLabels } from '@/lib/pricing'
import { requireAdmin } from '@/lib/session'
import StatusBadge from '../../../account/StatusBadge'
import { updateOrderStatusAction } from '../../actions'

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { email: true } } },
  })
  if (!order) notFound()

  return (
    <>
      <Link href="/admin" className="pt-link" style={{ fontSize: '0.75rem' }}>← All orders</Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', margin: '16px 0 32px' }}>
        <h1 className="pt-title" style={{ margin: 0 }}>{order.ref}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="pt-grid-2" style={{ gap: 32, alignItems: 'start' }}>
        <section className="pt-card">
          <h2 className="pt-subtitle">Customer</h2>
          <dl className="pt-dl">
            <dt>Name</dt><dd>{order.customerName}</dd>
            <dt>Email</dt><dd><a className="pt-link" href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></dd>
            {order.customerPhone && <><dt>Phone</dt><dd>{order.customerPhone}</dd></>}
            <dt>Account</dt><dd>{order.user ? order.user.email : 'Guest checkout'}</dd>
            <dt>Address</dt><dd>{order.address}<br />{order.city}, {order.postcode}</dd>
            {order.notes && <><dt>Notes</dt><dd>{order.notes}</dd></>}
          </dl>
        </section>

        <section className="pt-card">
          <h2 className="pt-subtitle">Status</h2>
          <form action={updateOrderStatusAction} className="pt-form">
            <input type="hidden" name="orderId" value={order.id} />
            <select className="pt-input" name="status" defaultValue={order.status} aria-label="Order status">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div><button className="pt-button">Update status</button></div>
          </form>
          <dl className="pt-dl" style={{ marginTop: 24 }}>
            <dt>Placed</dt><dd>{order.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</dd>
            {order.paidAt && <><dt>Paid</dt><dd>{order.paidAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</dd></>}
            {order.stripePaymentId && <><dt>Payment</dt><dd>{order.stripePaymentId}</dd></>}
          </dl>
        </section>
      </div>

      <section className="pt-section" style={{ marginTop: 40 }}>
        <h2 className="pt-subtitle">Items</h2>
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Each</th><th>Delivery</th><th>Card message</th></tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.productName} · {item.size}
                    {item.addons.length > 0 && <><br /><span className="pt-muted">{addonLabels(item.addons).join(', ')}</span></>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.unitPriceCents, order.currency)}</td>
                  <td>{item.deliveryDate ?? '—'}</td>
                  <td>{item.message ? `“${item.message}”` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pt-subtitle" style={{ textAlign: 'right', marginTop: 16 }}>Total {formatMoney(order.totalCents, order.currency)}</p>
      </section>
    </>
  )
}
