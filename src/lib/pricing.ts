// Shared by the product page (display) and the checkout API (source of truth).
// The server always recomputes prices from these tables and the Sanity base
// price; whatever the browser sends as a price is ignored.

export const SIZES = [
  { label: 'Small',  description: '8–10 stems',  multiplier: 1   },
  { label: 'Medium', description: '14–16 stems', multiplier: 1.4 },
  { label: 'Large',  description: '20–24 stems', multiplier: 1.8 },
] as const

export const ADDONS = [
  { id: 'vase', label: 'Glass Vase',   price: 18 },
  { id: 'choc', label: 'Chocolates',   price: 12 },
  { id: 'wrap', label: 'Premium Wrap', price: 8  },
] as const

export type SizeLabel = (typeof SIZES)[number]['label']
export type AddonId = (typeof ADDONS)[number]['id']

export const SIZE_LABELS = SIZES.map(s => s.label) as [SizeLabel, ...SizeLabel[]]
export const ADDON_IDS = ADDONS.map(a => a.id) as [AddonId, ...AddonId[]]

/** Unit price in whole dollars for a product configuration. */
export function unitPrice(basePrice: number, size: SizeLabel, addonIds: readonly string[]): number {
  const sizeDef = SIZES.find(s => s.label === size) ?? SIZES[0]
  const addonTotal = ADDONS.filter(a => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0)
  return Math.round(basePrice * sizeDef.multiplier) + addonTotal
}

export function addonLabels(addonIds: readonly string[]): string[] {
  return ADDONS.filter(a => addonIds.includes(a.id)).map(a => a.label)
}

// ── Subscriptions ───────────────────────────────────────────────────

export const PLANS = {
  weekly:   { name: 'Weekly',    price: 45, interval: 'WEEKLY',   stripe: { interval: 'week',  count: 1 }, perYear: 52 },
  biweekly: { name: 'Bi-Weekly', price: 65, interval: 'BIWEEKLY', stripe: { interval: 'week',  count: 2 }, perYear: 26 },
  monthly:  { name: 'Monthly',   price: 95, interval: 'MONTHLY',  stripe: { interval: 'month', count: 1 }, perYear: 12 },
} as const

export type PlanId = keyof typeof PLANS
export const PLAN_IDS = Object.keys(PLANS) as [PlanId, ...PlanId[]]

export const ANNUAL_DISCOUNT = 0.85

/** Price per delivery in whole dollars, as shown on the subscriptions page. */
export function planDeliveryPrice(plan: PlanId, cycle: 'monthly' | 'annual'): number {
  const base = PLANS[plan].price
  return cycle === 'annual' ? Math.round(base * ANNUAL_DISCOUNT) : base
}

/** What Stripe charges per billing period, in whole dollars. */
export function planBillingAmount(plan: PlanId, cycle: 'monthly' | 'annual'): number {
  const perDelivery = planDeliveryPrice(plan, cycle)
  return cycle === 'annual' ? perDelivery * PLANS[plan].perYear : perDelivery
}
