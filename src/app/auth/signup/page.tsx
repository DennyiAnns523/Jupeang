import { redirect } from 'next/navigation'
import { auth, googleEnabled } from '@/lib/auth'
import { safeRedirectPath } from '@/lib/security'
import { SignupForm } from '../AuthForms'
import GoogleButton from '../GoogleButton'

export const metadata = { title: 'Create an account — Üli' }

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const callbackUrl = safeRedirectPath((await searchParams).callbackUrl)
  if ((await auth())?.user) redirect(callbackUrl)

  return (
    <main className="pt-page pt-center">
      <div className="pt-card pt-narrow">
        <p className="pt-eyebrow">Join Üli</p>
        <h1 className="pt-title">Create an account</h1>
        <p className="pt-muted" style={{ marginTop: 0 }}>Track orders and manage flower subscriptions.</p>
        <SignupForm callbackUrl={callbackUrl} />
        {googleEnabled && <GoogleButton callbackUrl={callbackUrl} />}
      </div>
    </main>
  )
}
