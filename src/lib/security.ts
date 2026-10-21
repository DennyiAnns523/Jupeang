import 'server-only'
import { db } from './db'

type HeaderSource = { get(name: string): string | null }

export function clientIp(headers: HeaderSource): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') ?? 'unknown'
}

/**
 * CSRF guard for JSON API routes: the request must come from our own origin.
 * (Server actions get the same check from Next.js automatically.)
 */
export function isSameOrigin(headers: HeaderSource): boolean {
  const origin = headers.get('origin')
  if (!origin) return false
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** Only allow redirects to paths on this site, never `//evil.com` or `https://…`. */
export function safeRedirectPath(value: unknown, fallback = '/account'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}

/**
 * Fixed-window rate limit backed by Postgres, so it holds across serverless
 * instances. Returns true when the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const rows = await db.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimit" ("key", "count", "expiresAt")
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
      ON CONFLICT ("key") DO UPDATE SET
        "count"     = CASE WHEN "RateLimit"."expiresAt" < now() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "expiresAt" = CASE WHEN "RateLimit"."expiresAt" < now()
                        THEN now() + make_interval(secs => ${windowSeconds})
                        ELSE "RateLimit"."expiresAt" END
      RETURNING "count"`
    return rows[0].count <= limit
  } catch (err) {
    // Fail open: a rate-limiter outage shouldn't take the shop down
    console.error('Rate limit check failed:', err)
    return true
  }
}
