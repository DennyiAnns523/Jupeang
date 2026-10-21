'use client'

import { useActionState } from 'react'
import { changePasswordAction, updateProfileAction } from '../actions'
import type { FormState } from '../../auth/actions'

function Status({ state }: { state: FormState }) {
  if (state?.ok) return <div className="pt-alert pt-alert-ok" role="status">{state.ok}</div>
  if (state?.error) return <div className="pt-alert" role="alert">{state.error}</div>
  return null
}

export function ProfileForm({ name, phone }: { name: string; phone: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfileAction, undefined)
  return (
    <form action={action} className="pt-form">
      <Status state={state} />
      <div>
        <label className="pt-label" htmlFor="name">Name</label>
        <input className="pt-input" id="name" name="name" defaultValue={name} autoComplete="name" required />
        {state?.fields?.name && <div className="pt-field-error">{state.fields.name}</div>}
      </div>
      <div>
        <label className="pt-label" htmlFor="phone">Phone</label>
        <input className="pt-input" id="phone" name="phone" type="tel" defaultValue={phone} autoComplete="tel" />
        {state?.fields?.phone && <div className="pt-field-error">{state.fields.phone}</div>}
      </div>
      <div><button className="pt-button" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button></div>
    </form>
  )
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, undefined)
  return (
    <form action={action} className="pt-form">
      <Status state={state} />
      {hasPassword && (
        <div>
          <label className="pt-label" htmlFor="currentPassword">Current password</label>
          <input className="pt-input" id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
          {state?.fields?.currentPassword && <div className="pt-field-error">{state.fields.currentPassword}</div>}
        </div>
      )}
      <div>
        <label className="pt-label" htmlFor="newPassword">New password (10+ characters)</label>
        <input className="pt-input" id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={10} required />
        {state?.fields?.newPassword && <div className="pt-field-error">{state.fields.newPassword}</div>}
      </div>
      <div><button className="pt-button" disabled={pending}>{pending ? 'Saving…' : 'Update password'}</button></div>
    </form>
  )
}
