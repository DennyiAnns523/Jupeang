import { Resend } from 'resend'
import type { OrderPayload } from '@/types/order'

function formatItems(items: OrderPayload['items']): string {
  return items.map(item => {
    const lines = [`  • ${item.name} · ${item.size} × ${item.quantity}  —  $${item.price * item.quantity}`]
    if (item.addons.length) lines.push(`    Add-ons: ${item.addons.join(', ')}`)
    if (item.message)       lines.push(`    Card: "${item.message}"`)
    if (item.deliveryDate)  lines.push(`    Delivery: ${item.deliveryDate}`)
    return lines.join('\n')
  }).join('\n\n')
}

export async function sendOrderEmails(order: OrderPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Email not configured yet — print to server console so nothing is lost
    console.log('\n───── NEW ORDER REQUEST ─────')
    console.log(`Ref:      ${order.orderRef}`)
    console.log(`Customer: ${order.customerName} <${order.customerEmail}>`)
    console.log(`Phone:    ${order.customerPhone}`)
    console.log(`Address:  ${order.address}, ${order.city} ${order.postcode}`)
    if (order.notes) console.log(`Notes:    ${order.notes}`)
    console.log('\nItems:')
    console.log(formatItems(order.items))
    console.log(`\nTotal: $${order.total}`)
    console.log('─────────────────────────────\n')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const ownerEmail = process.env.OWNER_EMAIL ?? ''
  const fromAddr = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'

  const itemsText = formatItems(order.items)

  if (ownerEmail) {
    await resend.emails.send({
      from: fromAddr,
      to: ownerEmail,
      subject: `New Order Request ${order.orderRef} — ${order.customerName}`,
      text: [
        'NEW ORDER REQUEST — JUPEANG',
        `Order: ${order.orderRef}`,
        '',
        `Customer: ${order.customerName}`,
        `Email:    ${order.customerEmail}`,
        `Phone:    ${order.customerPhone}`,
        '',
        'Delivery Address:',
        order.address,
        `${order.city}, ${order.postcode}`,
        order.notes ? `Notes: ${order.notes}` : '',
        '',
        'ORDER ITEMS',
        '──────────────────────────────',
        itemsText,
        '',
        `TOTAL: $${order.total}`,
        '──────────────────────────────',
        'Reply to this email to reach the customer.',
      ].filter(Boolean).join('\n'),
    })
  }

  await resend.emails.send({
    from: fromAddr,
    to: order.customerEmail,
    subject: `Your Jupeang order request — ${order.orderRef}`,
    text: [
      `Hi ${order.customerName.split(' ')[0]},`,
      '',
      `Thank you for your order request. We've received it and will contact you at ${order.customerEmail} within 2 hours to confirm and arrange payment.`,
      '',
      `YOUR ORDER  ${order.orderRef}`,
      '──────────────────────────────',
      itemsText,
      '',
      `Total:    $${order.total}`,
      `Delivery: ${order.address}, ${order.city} ${order.postcode}`,
      '──────────────────────────────',
      '',
      'Questions? Just reply to this email.',
      '',
      'With care,',
      'Jupeang',
    ].join('\n'),
  })
}
