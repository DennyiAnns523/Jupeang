import { z } from 'zod'
import { ADDON_IDS, PLAN_IDS, SIZE_LABELS } from './pricing'
import { isValidDeliveryDate } from './delivery'

const trimmed = (max: number) => z.string({ error: 'Required' }).trim().max(max)

export const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(254)

export const password = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(128, 'Use at most 128 characters')

export const deliveryDetails = z.object({
  firstName: trimmed(60).min(1, 'Required'),
  lastName:  trimmed(60).min(1, 'Required'),
  email,
  phone:     trimmed(30).regex(/^[+\d\s().-]*$/, 'Enter a valid phone number').optional().default(''),
  address:   trimmed(200).min(3, 'Required'),
  city:      trimmed(80).min(1, 'Required'),
  postcode:  trimmed(20).min(2, 'Required'),
  notes:     trimmed(500).optional().default(''),
})

export const cartLine = z.object({
  productId:    z.string().min(1).max(100).regex(/^[\w.-]+$/),
  size:         z.enum(SIZE_LABELS),
  addons:       z.array(z.enum(ADDON_IDS)).max(ADDON_IDS.length).transform(a => [...new Set(a)]),
  quantity:     z.number().int().min(1).max(20),
  message:      trimmed(300).optional().default(''),
  deliveryDate: z.string().optional().default('')
    .refine(d => d === '' || isValidDeliveryDate(d), 'Choose a delivery date within the next 90 days'),
})

export const checkoutRequest = z.object({
  delivery: deliveryDetails,
  items: z.array(cartLine).min(1, 'Your bag is empty').max(30),
})

export const signupInput = z.object({
  name: trimmed(80).min(2, 'Enter your name'),
  email,
  password,
})

export const loginInput = z.object({
  email,
  password: z.string().min(1).max(128),
})

export const profileInput = z.object({
  name:  trimmed(80).min(2, 'Enter your name'),
  phone: trimmed(30).regex(/^[+\d\s().-]*$/, 'Enter a valid phone number'),
})

export const passwordChangeInput = z.object({
  currentPassword: z.string().max(128),
  newPassword: password,
})

export const subscriptionInput = z.object({
  plan:          z.enum(PLAN_IDS),
  cycle:         z.enum(['monthly', 'annual']),
  recipientName: trimmed(120).min(2, 'Required'),
  address:       trimmed(200).min(3, 'Required'),
  city:          trimmed(80).min(1, 'Required'),
  postcode:      trimmed(20).min(2, 'Required'),
  notes:         trimmed(500).optional().default(''),
})

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
