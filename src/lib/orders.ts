import 'server-only'
import { randomInt } from 'node:crypto'
import { addonLabels } from './pricing'
import type { OrderPayload } from '@/types/order'
import type { Order, OrderItem } from '@/generated/prisma/client'

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateOrderRef(): string {
  let ref = 'JUP-'
  for (let i = 0; i < 8; i++) ref += REF_CHARS[randomInt(REF_CHARS.length)]
  return ref
}

export function toOrderPayload(order: Order & { items: OrderItem[] }): OrderPayload {
  return {
    orderRef: order.ref,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone ?? '',
    address: order.address,
    city: order.city,
    postcode: order.postcode,
    notes: order.notes ?? '',
    items: order.items.map(item => ({
      name: item.productName,
      size: item.size,
      price: item.unitPriceCents / 100,
      quantity: item.quantity,
      addons: addonLabels(item.addons),
      message: item.message ?? '',
      deliveryDate: item.deliveryDate ?? '',
    })),
    total: order.totalCents / 100,
  }
}

export const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING_PAYMENT: 'Awaiting payment',
  REQUESTED: 'Requested',
  PAID: 'Paid',
  PREPARING: 'Preparing',
  DISPATCHED: 'Dispatched',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export function formatMoney(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)
}
