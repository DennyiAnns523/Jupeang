'use server'

import { headers } from 'next/headers'
import { AuthError, CredentialsSignin } from 'next-auth'
import bcrypt from 'bcryptjs'
import { BCRYPT_COST, signIn, signOut } from '@/lib/auth'
import { db } from '@/lib/db'
import { clientIp, rateLimit, safeRedirectPath } from '@/lib/security'
import { fieldErrors, signupInput } from '@/lib/validation'

export type FormState = { error?: string; fields?: Record<string, string>; ok?: string } | undefined

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeRedirectPath(formData.get('callbackUrl')),
    })
  } catch (err) {
    if (err instanceof CredentialsSignin && err.code === 'rate_limited') {
      return { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }
    }
    if (err instanceof AuthError) return { error: 'Incorrect email or password.' }
    throw err // the success redirect
  }
}

export async function signupAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupInput.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { fields: fieldErrors(parsed.error) }
  const { name, email, password } = parsed.data

  if (!(await rateLimit(`signup:${clientIp(await headers())}`, 5, 60 * 60))) {
    return { error: 'Too many accounts created from this network. Please try again later.' }
  }
  if (await db.user.findUnique({ where: { email }, select: { id: true } })) {
    return { fields: { email: 'An account with this email already exists. Try signing in.' } }
  }

  await db.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, BCRYPT_COST) },
  })

  await signIn('credentials', { email, password, redirectTo: safeRedirectPath(formData.get('callbackUrl')) })
}

export async function googleSignInAction(formData: FormData) {
  await signIn('google', { redirectTo: safeRedirectPath(formData.get('callbackUrl')) })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
