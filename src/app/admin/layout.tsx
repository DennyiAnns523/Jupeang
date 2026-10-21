import Link from 'next/link'
import { requireAdmin } from '@/lib/session'

export const metadata = { title: 'Shop admin — Jupeang', robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <main className="pt-page">
      <p className="pt-eyebrow">Shop admin</p>
      <div className="pt-shell">
        <nav className="pt-sidenav" aria-label="Admin">
          <Link href="/admin">Orders</Link>
          <Link href="/admin/subscriptions">Subscriptions</Link>
          <Link href="/studio">Content studio</Link>
          <Link href="/account">My account</Link>
        </nav>
        <div>{children}</div>
      </div>
    </main>
  )
}
