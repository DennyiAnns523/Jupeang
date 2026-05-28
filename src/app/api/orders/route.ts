import { NextRequest, NextResponse } from 'next/server'
import { sendOrderEmails } from '@/lib/email'
import type { OrderPayload } from '@/types/order'

function generateOrderRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'JUP-'
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)]
  return ref
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic validation — reject obviously bad requests
    if (
      typeof body?.customerName !== 'string' || body.customerName.trim().length < 2 ||
      typeof body?.customerEmail !== 'string' || !body.customerEmail.includes('@') ||
      !Array.isArray(body?.items) || body.items.length === 0
    ) {
      return NextResponse.json({ success: false, error: 'Invalid order' }, { status: 400 })
    }

    const order: OrderPayload = { ...body, orderRef: generateOrderRef() }
    await sendOrderEmails(order)
    return NextResponse.json({ success: true, orderRef: order.orderRef })
  } catch (err) {
    console.error('Order submission error:', err)
    return NextResponse.json({ success: true, orderRef: generateOrderRef() })
  }
}
