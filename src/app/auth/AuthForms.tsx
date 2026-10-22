'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction, signupAction, type FormState } from './actions'

function Field({ label, name, type = 'text', autoComplete, error, minLength }: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  error?: string
  minLength?: number
}) {
  return (
    <div>
      <label className="pt-label" htmlFor={name}>{label}</label>
      <input
        className="pt-input"
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={error ? true : undefined}
      />
      {error && <div className="pt-field-error">{error}</div>}
    </div>
  )
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, undefined)
  return (
    <form action={action} className="pt-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state?.error && <div className="pt-alert" role="alert">{state.error}</div>}
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="current-password" />
      <button className="pt-button" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      <p className="pt-muted">
        New to Üli? <Link className="pt-link" href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Create an account</Link>
      </p>
    </form>
  )
}

export function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signupAction, undefined)
  return (
    <form action={action} className="pt-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state?.error && <div className="pt-alert" role="alert">{state.error}</div>}
      <Field label="Name" name="name" autoComplete="name" error={state?.fields?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={state?.fields?.email} />
      <Field label="Password (10+ characters)" name="password" type="password" autoComplete="new-password" minLength={10} error={state?.fields?.password} />
      <button className="pt-button" disabled={pending}>{pending ? 'Creating account…' : 'Create account'}</button>
      <p className="pt-muted">
        Already have an account? <Link className="pt-link" href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Sign in</Link>
      </p>
    </form>
  )
}
