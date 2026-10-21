'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { BCRYPT_COST } from '@/lib/auth'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/security'
import { requireUser } from '@/lib/session'
import { getStripe, siteUrl } from '@/lib/stripe'
import { fieldErrors, passwordChangeInput, profileInput } from '@/lib/validation'
import type { FormState } from '../auth/actions'

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser('/account/settings')
  const parsed = profileInput.safeParse({ name: formData.get('name'), phone: formData.get('phone') ?? '' })
  if (!parsed.success) return { fields: fieldErrors(parsed.error) }

  await db.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  })
  revalidatePath('/account', 'layout')
  return { ok: 'Your details were saved.' }
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser('/account/settings')
  const parsed = passwordChangeInput.safeParse({
    currentPassword: formData.get('currentPassword') ?? '',
    newPassword: formData.get('newPassword'),
  })
  if (!parsed.success) return { fields: fieldErrors(parsed.error) }

  if (!(await rateLimit(`password:${user.id}`, 5, 15 * 60))) {
    return { error: 'Too many attempts. Please wait 15 minutes.' }
  }
  // Accounts created with Google have no password yet and may set one
  if (user.passwordHash && !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return { fields: { currentPassword: 'Current password is incorrect.' } }
  }

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, BCRYPT_COST) },
  })
  return { ok: 'Your password was changed.' }
}

/** Stripe's hosted portal handles pausing, cancelling and card updates. */
export async function openBillingPortalAction() {
  const user = await requireUser('/account')
  const stripe = getStripe()
  const sub = await db.subscription.findFirst({
    where: { userId: user.id, stripeCustomerId: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: { stripeCustomerId: true },
  })
  if (!stripe || !sub?.stripeCustomerId) redirect('/account')

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${siteUrl()}/account`,
  })
  redirect(portal.url)
}
