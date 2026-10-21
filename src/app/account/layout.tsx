import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { signOutAction } from '../auth/actions'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/account')

  return (
    <main className="pt-page">
      <p className="pt-eyebrow">My account</p>
      <h1 className="pt-title" style={{ marginBottom: 40 }}>Hello, {user.name?.split(' ')[0] ?? 'there'}</h1>
      <div className="pt-shell">
        <nav className="pt-sidenav" aria-label="Account">
          <Link href="/account">Overview</Link>
          <Link href="/account/orders">Orders</Link>
          <Link href="/account/settings">Settings</Link>
          {user.role === 'ADMIN' && <Link href="/admin">Shop admin</Link>}
          <form action={signOutAction}>
            <button>Sign out</button>
          </form>
        </nav>
        <div>{children}</div>
      </div>
    </main>
  )
}
