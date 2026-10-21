import Link from 'next/link'
import { db } from '@/lib/db'
import ClearCart from './ClearCart'

export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  // Only the reference and status are shown here: no personal details by ref
  const order = typeof ref === 'string' && /^JUP-[A-Z0-9]{6,10}$/.test(ref)
    ? await db.order.findUnique({ where: { ref }, select: { ref: true, status: true } })
    : null
  const paid = order && order.status !== 'PENDING_PAYMENT' && order.status !== 'CANCELLED'

  return (
    <main className="pt-page pt-center">
      <ClearCart />
      <div className="pt-card pt-narrow" style={{ textAlign: 'center' }}>
        <div className="pt-flower">✿</div>
        <h1 className="pt-title">{paid ? 'Thank you' : 'Confirming your payment'}</h1>
        {order && <p className="pt-eyebrow">{order.ref}</p>}
        <p className="pt-muted">
          {paid
            ? "Your payment was received and we're preparing your flowers with care. A confirmation email is on its way."
            : "We're waiting for confirmation from our payment provider. This usually takes a few seconds, and you'll receive an email once it's done."}
        </p>
        <div className="pt-actions" style={{ justifyContent: 'center' }}>
          <Link href="/account/orders" className="pt-button">View my orders</Link>
          <Link href="/collections" className="pt-button pt-button-ghost">Continue shopping</Link>
        </div>
      </div>
    </main>
  )
}
