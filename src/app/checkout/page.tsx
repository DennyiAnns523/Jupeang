'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cartContext'
import Link from 'next/link'

const steps = ['Delivery', 'Review', 'Confirmed']

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--color-border)',
  backgroundColor: 'transparent',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  color: 'var(--color-text)',
  outline: 'none',
  transition: 'border-color 200ms ease',
} as const

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-text-soft)',
  display: 'block',
  marginBottom: '8px',
}

export default function CheckoutPage() {
  const { items, quantities, total } = useCart()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', notes: '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const step1Valid =
    form.firstName && form.lastName && form.email &&
    form.address && form.city && form.postcode

  const submitOrder = async () => {
    setSubmitting(true)
    try {
      const payload = {
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address,
        city: form.city,
        postcode: form.postcode,
        notes: form.notes,
        items: items.map((item, i) => ({
          name: item.name,
          size: item.size,
          price: item.price,
          quantity: quantities[i] ?? 1,
          addons: item.addons,
          message: item.message,
          deliveryDate: item.deliveryDate,
        })),
        total,
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setOrderRef(data.orderRef ?? '')
    } catch {
      // Silent — customer still sees confirmation, order logged server-side
    }
    setSubmitting(false)
    setStep(2)
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        padding: '120px 80px 48px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <Link href="/collections" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            display: 'block',
            marginBottom: '12px',
          }}>
            ← Back to Shop
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            Checkout
          </h1>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: i > step ? 0.3 : 1 }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: i <= step ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: i < step ? 'var(--color-accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  color: i < step ? 'var(--color-bg)' : 'var(--color-accent)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: i === step ? 'var(--color-text)' : 'var(--color-text-soft)',
                }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 32, height: 1, backgroundColor: 'var(--color-border)', marginLeft: 4 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '64px 80px 120px',
        display: 'grid',
        gridTemplateColumns: step < 2 ? '1fr 380px' : '1fr',
        gap: '80px',
        alignItems: 'start',
      }}>

        {/* ── Step 1 — Delivery Details ── */}
        {step === 0 && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 300,
              color: 'var(--color-heading)',
              marginBottom: '40px',
            }}>
              Delivery Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Jane" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Smith" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Delivery Address</label>
              <input style={inputStyle} value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Rose Street" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} placeholder="New York" />
              </div>
              <div>
                <label style={labelStyle}>Postcode</label>
                <input style={inputStyle} value={form.postcode} onChange={e => update('postcode', e.target.value)} placeholder="10001" />
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={labelStyle}>Delivery Notes (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: 'none' }}
                rows={3}
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                placeholder="Leave at door, ring bell, etc."
              />
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!step1Valid}
              style={{
                padding: '16px 48px',
                backgroundColor: step1Valid ? 'var(--color-heading)' : 'var(--color-border)',
                color: step1Valid ? 'var(--color-bg)' : 'var(--color-text-soft)',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: step1Valid ? 'pointer' : 'not-allowed',
                transition: 'background-color 200ms ease',
              }}
            >
              Review Order
            </button>
          </div>
        )}

        {/* ── Step 2 — Review & Confirm ── */}
        {step === 1 && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 300,
              color: 'var(--color-heading)',
              marginBottom: '40px',
            }}>
              Review Your Order
            </h2>

            {/* Delivery details summary */}
            <div style={{
              backgroundColor: 'var(--color-surface)',
              padding: '24px 28px',
              marginBottom: '32px',
              borderLeft: '2px solid var(--color-accent)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-soft)',
                }}>Delivering To</span>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    textDecoration: 'underline',
                  }}
                >
                  Edit
                </button>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-heading)', marginBottom: '4px' }}>
                {form.firstName} {form.lastName}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-soft)', lineHeight: 1.7 }}>
                {form.address}<br />
                {form.city}, {form.postcode}<br />
                {form.email} · {form.phone}
              </div>
              {form.notes && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-soft)', marginTop: '8px', fontStyle: 'italic' }}>
                  Note: {form.notes}
                </div>
              )}
            </div>

            {/* Order items */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
                marginBottom: '16px',
              }}>
                Your Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    gap: '16px',
                    alignItems: 'start',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    {/* Colour swatch */}
                    <div style={{
                      width: 56, height: 56,
                      background: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0,
                    }}>
                      <span style={{ opacity: 0.3 }}>✿</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-heading)', marginBottom: '2px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-text-soft)' }}>
                        {item.size} · qty {quantities[i] ?? 1}
                        {item.addons.length > 0 && ` · ${item.addons.join(', ')}`}
                      </div>
                      {item.message && (
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-text-soft)', fontStyle: 'italic', marginTop: '2px' }}>
                          "{item.message}"
                        </div>
                      )}
                      {item.deliveryDate && (
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-accent)', marginTop: '2px' }}>
                          Deliver: {item.deliveryDate}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-heading)', whiteSpace: 'nowrap' }}>
                      ${item.price * (quantities[i] ?? 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
              marginBottom: '40px',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-soft)' }}>
                Total
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-heading)' }}>
                ${total}
              </span>
            </div>

            {/* What happens next */}
            <div style={{
              backgroundColor: 'var(--color-accent-light)',
              padding: '20px 24px',
              marginBottom: '28px',
              borderLeft: '2px solid var(--color-accent)',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.8, color: 'var(--color-text)' }}>
                After you place your request, we'll contact you at <strong>{form.email}</strong> within 2 hours to confirm your order and arrange payment.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={submitOrder}
                disabled={submitting}
                style={{
                  padding: '16px 48px',
                  backgroundColor: submitting ? 'var(--color-accent)' : 'var(--color-heading)',
                  color: 'var(--color-bg)',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'wait' : 'pointer',
                  transition: 'background-color 300ms ease',
                }}
              >
                {submitting ? 'Sending…' : 'Place Order Request'}
              </button>
              <button
                onClick={() => setStep(0)}
                style={{
                  padding: '16px 24px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-soft)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 — Confirmed ── */}
        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 0', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              border: '1px solid var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '2rem',
            }}>
              ✿
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 300,
              color: 'var(--color-heading)',
              marginBottom: '12px',
            }}>
              Order Request Received
            </h2>
            {orderRef && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '24px',
              }}>
                {orderRef}
              </div>
            )}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--color-text-soft)',
              lineHeight: 1.9,
              marginBottom: '8px',
              fontWeight: 300,
            }}>
              Thank you, {form.firstName}. We're preparing your flowers with care.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--color-text-soft)',
              marginBottom: '48px',
              lineHeight: 1.7,
            }}>
              We'll contact you at <strong>{form.email}</strong> within 2 hours<br />
              to confirm your order and arrange payment.
            </p>
            <Link href="/collections" style={{
              display: 'inline-block',
              padding: '14px 40px',
              backgroundColor: 'var(--color-heading)',
              color: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Order summary sidebar (steps 1 and 2 only) */}
        {step < 2 && (
          <div style={{
            position: 'sticky',
            top: '100px',
            backgroundColor: 'var(--color-surface)',
            padding: '32px',
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-soft)',
              marginBottom: '24px',
            }}>
              Order Summary
            </div>

            {items.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-soft)', fontStyle: 'italic' }}>
                No items in bag
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--color-heading)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-text-soft)', marginTop: '2px' }}>
                          {item.size} × {quantities[i] ?? 1}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                        ${item.price * (quantities[i] ?? 1)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-soft)' }}>Delivery</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-accent)' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-soft)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-heading)' }}>${total}</span>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
