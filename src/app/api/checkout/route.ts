import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendOrderEmails } from '@/lib/email'
import { generateOrderRef, toOrderPayload } from '@/lib/orders'
import { addonLabels, unitPrice } from '@/lib/pricing'
import { getProductsByIds } from '@/lib/products'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'
import { getStripe, siteUrl } from '@/lib/stripe'
import { checkoutRequest, fieldErrors } from '@/lib/validation'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req.headers)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (!(await rateLimit(`checkout:${clientIp(req.headers)}`, 15, 10 * 60))) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
  }

  const parsed = checkoutRequest.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check your details.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }
  const { delivery, items } = parsed.data

  // Prices come from Sanity, never from the browser
  let products
  try {
    products = await getProductsByIds([...new Set(items.map(i => i.productId))])
  } catch (err) {
    console.error('Catalog lookup failed:', err)
    return NextResponse.json({ error: 'The shop is temporarily unavailable.' }, { status: 503 })
  }

  const lines = []
  for (const item of items) {
    const product = products.get(item.productId)
    if (!product || !product.inStock || !(product.price > 0)) {
      return NextResponse.json({ error: `${product?.name ?? 'An item in your bag'} is no longer available.` }, { status: 409 })
    }
    lines.push({
      productId: product._id,
      productName: product.name,
      size: item.size,
      addons: item.addons,
      quantity: item.quantity,
      unitPriceCents: unitPrice(product.price, item.size, item.addons) * 100,
      message: item.message || null,
      deliveryDate: item.deliveryDate || null,
    })
  }
  const totalCents = lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0)

  const session = await auth()
  const stripe = getStripe()

  const order = await db.order.create({
    data: {
      ref: generateOrderRef(),
      status: stripe ? 'PENDING_PAYMENT' : 'REQUESTED',
      userId: session?.user?.id ?? null,
      customerName: `${delivery.firstName} ${delivery.lastName}`,
      customerEmail: delivery.email,
      customerPhone: delivery.phone || null,
      address: delivery.address,
      city: delivery.city,
      postcode: delivery.postcode,
      notes: delivery.notes || null,
      totalCents,
      items: { create: lines },
    },
    include: { items: true },
  })

  if (!stripe) {
    // No online payments yet: record the request and email the shop
    await sendOrderEmails(toOrderPayload(order)).catch(err => console.error('Order email failed:', err))
    return NextResponse.json({ orderRef: order.ref })
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: delivery.email,
      client_reference_id: order.id,
      metadata: { orderId: order.id },
      payment_intent_data: { metadata: { orderId: order.id } },
      line_items: lines.map(l => ({
        quantity: l.quantity,
        price_data: {
          currency: order.currency,
          unit_amount: l.unitPriceCents,
          product_data: {
            name: `${l.productName} · ${l.size}`,
            ...(l.addons.length ? { description: `With ${addonLabels(l.addons).join(', ')}` } : {}),
          },
        },
      })),
      success_url: `${siteUrl()}/checkout/success?ref=${order.ref}`,
      cancel_url: `${siteUrl()}/checkout?cancelled=1`,
    })
    await db.order.update({ where: { id: order.id }, data: { stripeSessionId: checkout.id } })
    return NextResponse.json({ orderRef: order.ref, url: checkout.url })
  } catch (err) {
    console.error('Stripe session failed:', err)
    await db.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } })
    return NextResponse.json({ error: 'Payment could not be started. Please try again.' }, { status: 502 })
  }
}
