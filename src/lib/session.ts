import 'server-only'
import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import { auth } from './auth'
import { db } from './db'

/** The signed-in user, freshly loaded from the database (or null). */
export const getCurrentUser = cache(async () => {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null
  return db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, phone: true, role: true, passwordHash: true, createdAt: true },
  })
})

export async function requireUser(returnTo = '/account') {
  const user = await getCurrentUser()
  if (!user) redirect(`/auth/login?callbackUrl=${encodeURIComponent(returnTo)}`)
  return user
}

/** Non-admins get a 404 so the admin area isn't advertised. */
export async function requireAdmin() {
  const user = await requireUser('/admin')
  if (user.role !== 'ADMIN') notFound()
  return user
}
