import Link from 'next/link'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'

export const metadata = { title: 'Visitors — Üli', robots: { index: false } }

// Days are counted in the shop's own time zone
const TZ = 'Asia/Kolkata'
const RANGES = [7, 30, 90]
const KEEP_DAYS = 400

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home page',
  '/collections': 'Shop',
  '/about': 'Our story',
  '/garden': 'The journey',
  '/album': 'The album',
  '/terrace': 'The terrace',
  '/subscriptions': 'Subscriptions',
  '/checkout': 'Checkout',
}

const pageName = (path: string) =>
  PAGE_NAMES[path] ??
  (path.startsWith('/collections/') ? `Shop · ${path.slice(13).replace(/-/g, ' ')}` :
   path.startsWith('/garden/') ? `Journal · ${path.slice(8).replace(/-/g, ' ')}` : path)

type Row = { label: string | null; views: number; visitors: number }

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin()
  const requested = Number((await searchParams).days)
  const days = RANGES.includes(requested) ? requested : 30
  const since = new Date(Date.now() - days * 86_400_000)

  // Old rows aren't needed; trimming here keeps the table small without a cron job
  await db.pageView.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - KEEP_DAYS * 86_400_000) } } })

  const localDay = `to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE '${TZ}', 'YYYY-MM-DD')`
  const [daily, pages, referrers, devices, countries] = await Promise.all([
    db.$queryRawUnsafe<Row[]>(
      `SELECT ${localDay} AS label, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
       FROM "PageView" WHERE "createdAt" >= $1 GROUP BY 1 ORDER BY 1`, since),
    db.$queryRaw<Row[]>`
      SELECT path AS label, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
    db.$queryRaw<Row[]>`
      SELECT referrer AS label, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since} AND referrer IS NOT NULL GROUP BY 1 ORDER BY 3 DESC LIMIT 10`,
    db.$queryRaw<Row[]>`
      SELECT device AS label, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 3 DESC`,
    db.$queryRaw<Row[]>`
      SELECT country AS label, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since} AND country IS NOT NULL GROUP BY 1 ORDER BY 3 DESC LIMIT 10`,
  ])

  // One bar per day, including days with no visits
  const byDay = new Map(daily.map(d => [d.label, d]))
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ })
  const chart = Array.from({ length: days }, (_, i) => {
    const date = fmt.format(new Date(Date.now() - (days - 1 - i) * 86_400_000))
    return { date, views: byDay.get(date)?.views ?? 0, visitors: byDay.get(date)?.visitors ?? 0 }
  })
  const today = chart[chart.length - 1]
  const peak = Math.max(1, ...chart.map(d => d.visitors))
  const totalVisits = chart.reduce((n, d) => n + d.visitors, 0)
  const totalViews = chart.reduce((n, d) => n + d.views, 0)
  const deviceTotal = devices.reduce((n, d) => n + d.visitors, 0) || 1

  return (
    <>
      <h1 className="pt-title">Visitors</h1>
      <nav className="pt-filters" aria-label="Time range">
        {RANGES.map(r => (
          <Link key={r} href={`/admin/visitors?days=${r}`} aria-current={r === days ? 'page' : undefined}>
            Last {r} days
          </Link>
        ))}
      </nav>

      <div className="pt-stats">
        <div className="pt-stat"><strong>{today.visitors}</strong><span>Visitors today</span></div>
        <div className="pt-stat"><strong>{today.views}</strong><span>Pages viewed today</span></div>
        <div className="pt-stat"><strong>{totalVisits}</strong><span>Visits, last {days} days</span></div>
        <div className="pt-stat"><strong>{totalViews}</strong><span>Pages viewed, last {days} days</span></div>
      </div>

      <section className="pt-section">
        <h2 className="pt-subtitle">Visitors per day</h2>
        <div className="vs-chart" role="img" aria-label={`Visitors per day over the last ${days} days, peaking at ${peak}`}>
          {chart.map(d => (
            <div key={d.date} className="vs-bar" title={`${d.date}: ${d.visitors} visitors, ${d.views} pages`}>
              <span style={{ height: `${(d.visitors / peak) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="vs-axis pt-muted">
          <span>{chart[0].date}</span>
          <span>Busiest day: {peak} visitors</span>
          <span>Today</span>
        </div>
      </section>

      {totalViews === 0 ? (
        <p className="pt-muted">No visits recorded yet. They appear here as soon as people open the site.</p>
      ) : (
        <div className="vs-grid">
          <Breakdown title="Most viewed pages" rows={pages.map(p => ({ ...p, label: pageName(p.label ?? '') }))} column="Views" value="views" />
          <Breakdown
            title="Where visitors came from"
            rows={referrers}
            column="Visitors"
            value="visitors"
            empty="Everyone came directly: typed the address, used a bookmark, or tapped a link in a chat app."
          />
          <section className="pt-section">
            <h2 className="pt-subtitle">Phone or computer</h2>
            {devices.map(d => (
              <div key={d.label} className="vs-share">
                <span>{d.label === 'mobile' ? 'Phone' : d.label === 'tablet' ? 'Tablet' : 'Computer'}</span>
                <b style={{ width: `${(d.visitors / deviceTotal) * 100}%` }} />
                <span>{Math.round((d.visitors / deviceTotal) * 100)}%</span>
              </div>
            ))}
          </section>
          {countries.length > 0 && (
            <Breakdown
              title="Countries"
              rows={countries.map(c => ({ ...c, label: regionName(c.label) }))}
              column="Visitors"
              value="visitors"
            />
          )}
        </div>
      )}

      <p className="pt-muted" style={{ marginTop: 32 }}>
        No cookies and no IP addresses are stored. A &ldquo;visit&rdquo; is one person on one day, so
        someone who comes back tomorrow counts again. Admin pages aren&rsquo;t counted.
      </p>
    </>
  )
}

function regionName(code: string | null) {
  try {
    return (code && new Intl.DisplayNames(['en'], { type: 'region' }).of(code)) || code
  } catch {
    return code
  }
}

function Breakdown({ title, rows, column, value, empty }: {
  title: string
  rows: Row[]
  column: string
  value: 'views' | 'visitors'
  empty?: string
}) {
  return (
    <section className="pt-section">
      <h2 className="pt-subtitle">{title}</h2>
      {rows.length === 0 ? (
        <p className="pt-muted">{empty ?? 'Nothing yet.'}</p>
      ) : (
        <table className="pt-table">
          <thead><tr><th></th><th style={{ textAlign: 'right' }}>{column}</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td style={{ textAlign: 'right' }}>{r[value]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
