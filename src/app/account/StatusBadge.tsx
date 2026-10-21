import { STATUS_LABELS } from '@/lib/orders'
import type { OrderStatus, SubscriptionStatus } from '@/generated/prisma/client'

const GOOD = new Set(['PAID', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'ACTIVE'])
const WARN = new Set(['PENDING_PAYMENT', 'PAST_DUE', 'INCOMPLETE'])

const SUB_LABELS: Record<SubscriptionStatus, string> = {
  INCOMPLETE: 'Awaiting payment',
  ACTIVE: 'Active',
  PAST_DUE: 'Payment due',
  PAUSED: 'Paused',
  CANCELED: 'Cancelled',
}

export default function StatusBadge({ status }: { status: OrderStatus | SubscriptionStatus }) {
  const label = status in STATUS_LABELS
    ? STATUS_LABELS[status as OrderStatus]
    : SUB_LABELS[status as SubscriptionStatus]
  const tone = GOOD.has(status) ? 'good' : WARN.has(status) ? 'warn' : undefined
  return <span className="pt-badge" data-tone={tone}>{label}</span>
}
