// Delivery date rules shared by the product page and the checkout API.
// Dates are compared as YYYY-MM-DD strings in UTC.

export const MAX_DAYS_AHEAD = 90

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function deliveryWindow(now = new Date()): { minDate: string; maxDate: string } {
  const min = new Date(now)
  min.setUTCDate(min.getUTCDate() + 1)
  const max = new Date(now)
  max.setUTCDate(max.getUTCDate() + MAX_DAYS_AHEAD)
  return { minDate: isoDate(min), maxDate: isoDate(max) }
}

export function isValidDeliveryDate(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) return false
  const { minDate, maxDate } = deliveryWindow(now)
  return value >= minDate && value <= maxDate
}
