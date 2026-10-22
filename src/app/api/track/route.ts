import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i
const SKIP = /^\/(admin|studio|api)(\/|$)/

function deviceOf(ua: string) {
  if (/ipad|tablet/i.test(ua)) return 'tablet'
  if (/mobi|android|iphone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function referrerHost(value: unknown, ownHost: string | null) {
  if (typeof value !== 'string' || !value) return null
  try {
    const host = new URL(value).hostname.replace(/^www\./, '').replace(/^(l|lm|m)\./, '')
    return host && host !== ownHost?.replace(/^www\./, '').split(':')[0] ? host.slice(0, 100) : null
  } catch {
    return null
  }
}

// Records one page view. Called by <VisitTracker /> on every page change.
export async function POST(request: Request) {
  const headers = request.headers
  const ua = headers.get('user-agent') ?? ''
  if (!isSameOrigin(headers) || BOTS.test(ua)) return new NextResponse(null, { status: 204 })

  const body = await request.json().catch(() => null)
  const path = typeof body?.path === 'string' ? body.path.split('?')[0].slice(0, 200) : ''
  if (!path.startsWith('/') || SKIP.test(path)) return new NextResponse(null, { status: 204 })

  const ip = clientIp(headers)
  if (!(await rateLimit(`track:${ip}`, 60, 60))) return new NextResponse(null, { status: 204 })

  // A daily-rotating hash: unique per visitor per day, never stored as an IP
  const day = new Date().toISOString().slice(0, 10)
  const visitor = createHash('sha256')
    .update(`${process.env.AUTH_SECRET ?? ''}|${day}|${ip}|${ua}`)
    .digest('hex')
    .slice(0, 24)

  try {
    await db.pageView.create({
      data: {
        path,
        referrer: referrerHost(body?.referrer, headers.get('x-forwarded-host') ?? headers.get('host')),
        device: deviceOf(ua),
        country: headers.get('x-vercel-ip-country')?.slice(0, 2) || null,
        visitor,
      },
    })
  } catch (err) {
    console.error('Could not record page view:', err)
  }
  return new NextResponse(null, { status: 204 })
}
