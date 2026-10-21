import { redirect } from 'next/navigation'
import { auth, googleEnabled } from '@/lib/auth'
import { safeRedirectPath } from '@/lib/security'
import { LoginForm } from '../AuthForms'
import GoogleButton from '../GoogleButton'

export const metadata = { title: 'Sign in — Jupeang' }

// Auth.js redirects here with ?error=… for OAuth problems
const OAUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: 'This email is already registered with a password. Sign in with your password instead.',
  AccessDenied: 'Sign-in was cancelled.',
  Configuration: 'Sign-in is temporarily unavailable.',
}

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const { callbackUrl: rawCallback, error } = await searchParams
  const callbackUrl = safeRedirectPath(rawCallback)
  if ((await auth())?.user) redirect(callbackUrl)

  return (
    <main className="pt-page pt-center">
      <div className="pt-card pt-narrow">
        <p className="pt-eyebrow">Welcome back</p>
        <h1 className="pt-title">Sign in</h1>
        {error && <div className="pt-alert" role="alert" style={{ marginBottom: 18 }}>{OAUTH_ERRORS[error] ?? 'Sign-in failed. Please try again.'}</div>}
        <LoginForm callbackUrl={callbackUrl} />
        {googleEnabled && <GoogleButton callbackUrl={callbackUrl} />}
      </div>
    </main>
  )
}
