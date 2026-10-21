'use client'

import { useActionState } from 'react'
import { startSubscriptionAction } from '../actions'
import type { FormState } from '../../auth/actions'

export default function StartForm({ plan, cycle, defaultName }: { plan: string; cycle: string; defaultName: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(startSubscriptionAction, undefined)
  const err = (k: string) => state?.fields?.[k] && <div className="pt-field-error">{state.fields[k]}</div>

  return (
    <form action={action} className="pt-form">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="cycle" value={cycle} />
      {state?.error && <div className="pt-alert" role="alert">{state.error}</div>}
      <div>
        <label className="pt-label" htmlFor="recipientName">Recipient name</label>
        <input className="pt-input" id="recipientName" name="recipientName" defaultValue={defaultName} autoComplete="name" required />
        {err('recipientName')}
      </div>
      <div>
        <label className="pt-label" htmlFor="address">Delivery address</label>
        <input className="pt-input" id="address" name="address" autoComplete="street-address" required />
        {err('address')}
      </div>
      <div className="pt-grid-2">
        <div>
          <label className="pt-label" htmlFor="city">City</label>
          <input className="pt-input" id="city" name="city" autoComplete="address-level2" required />
          {err('city')}
        </div>
        <div>
          <label className="pt-label" htmlFor="postcode">Postcode</label>
          <input className="pt-input" id="postcode" name="postcode" autoComplete="postal-code" required />
          {err('postcode')}
        </div>
      </div>
      <div>
        <label className="pt-label" htmlFor="notes">Delivery notes (optional)</label>
        <textarea className="pt-input" id="notes" name="notes" rows={3} maxLength={500} style={{ resize: 'none' }} />
      </div>
      <div><button className="pt-button" disabled={pending}>{pending ? 'Redirecting…' : 'Continue to payment'}</button></div>
    </form>
  )
}
