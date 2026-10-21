import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// The signed-in customer's own orders. Orders are created via /api/checkout.
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      ref: true, status: true, totalCents: true, currency: true, createdAt: true,
      items: { select: { productName: true, size: true, quantity: true, unitPriceCents: true, deliveryDate: true } },
    },
  })
  return NextResponse.json({ orders })
}
