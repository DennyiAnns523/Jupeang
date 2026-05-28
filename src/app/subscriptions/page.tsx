'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    tagline: 'For the flower lover',
    price: 45,
    frequency: 'per week',
    features: [
      'Fresh seasonal arrangement every week',
      'Free delivery on all orders',
      'Handwritten card included',
      'Skip or pause anytime',
    ],
    accent: false,
  },
  {
    id: 'biweekly',
    name: 'Bi-Weekly',
    tagline: 'Our most popular',
    price: 65,
    frequency: 'per delivery',
    features: [
      'Larger arrangement every two weeks',
      'Free delivery on all orders',
      'Handwritten card included',
      'Priority seasonal blooms',
      'Skip or pause anytime',
    ],
    accent: true,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    tagline: 'A monthly luxury',
    price: 95,
    frequency: 'per month',
    features: [
      'Premium large arrangement monthly',
      'Free delivery on all orders',
      'Handwritten card included',
      'Priority seasonal blooms',
      'Exclusive subscriber varieties',
      'Skip or pause anytime',
    ],
    accent: false,
  },
]

const faqs = [
  {
    q: 'Can I skip a delivery?',
    a: 'Yes — you can skip, pause, or cancel your subscription at any time from your account dashboard with no fees.',
  },
  {
    q: 'When will my flowers arrive?',
    a: 'You choose your preferred delivery day during signup. We deliver Tuesday through Saturday.',
  },
  {
    q: 'Can I send a subscription as a gift?',
    a: 'Absolutely. At checkout you can enter the recipient\'s address and include a personal message card.',
  },
  {
    q: 'What flowers will I receive?',
    a: 'Each arrangement is seasonal and curated by our florists. No two deliveries are the same.',
  },
]

export default function SubscriptionsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Hero */}
      <div style={{
        padding: '160px 80px 100px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          display: 'block',
          marginBottom: '16px',
        }}>
          Never Miss a Bloom
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
          fontWeight: 300,
          color: 'var(--color-heading)',
          lineHeight: 1.05,
          marginBottom: '24px',
        }}>
          Flowers on <em style={{ fontStyle: 'italic' }}>repeat.</em>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.8,
          color: 'var(--color-text-soft)',
          maxWidth: '480px',
          margin: '0 auto 48px',
          fontWeight: 300,
        }}>
          A fresh arrangement delivered to your door on your schedule.
          Seasonal, handcrafted, and always a little different.
        </p>

        {/* Billing toggle */}
        <div style={{
          display: 'inline-flex',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}>
          {(['monthly', 'annual'] as const).map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              style={{
                padding: '10px 28px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: billingCycle === cycle ? 'var(--color-heading)' : 'transparent',
                color: billingCycle === cycle ? 'var(--color-bg)' : 'var(--color-text-soft)',
                transition: 'all 200ms ease',
              }}
            >
              {cycle === 'annual' ? 'Annual (Save 15%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{
        padding: '80px 80px 120px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}>
        {plans.map(plan => {
          const price = billingCycle === 'annual'
            ? Math.round(plan.price * 0.85)
            : plan.price

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: plan.accent ? 'var(--color-heading)' : 'var(--color-surface)',
                padding: '48px 40px',
                position: 'relative',
                transform: plan.accent ? 'translateY(-16px)' : 'none',
                boxShadow: plan.accent ? 'var(--shadow-md)' : 'none',
              }}
            >
              {plan.accent && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-accent)',
                  padding: '4px 16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-bg)',
                  whiteSpace: 'nowrap',
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: plan.accent ? 'rgba(250,250,247,0.5)' : 'var(--color-text-soft)',
                  marginBottom: '8px',
                }}>
                  {plan.tagline}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 400,
                  color: plan.accent ? 'var(--color-bg)' : 'var(--color-heading)',
                  marginBottom: '16px',
                }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    fontWeight: 300,
                    color: plan.accent ? 'var(--color-bg)' : 'var(--color-heading)',
                    lineHeight: 1,
                  }}>
                    ${price}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: plan.accent ? 'rgba(250,250,247,0.5)' : 'var(--color-text-soft)',
                  }}>
                    {plan.frequency}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                backgroundColor: plan.accent ? 'rgba(250,250,247,0.1)' : 'var(--color-border)',
                marginBottom: '32px',
              }} />

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                {plan.features.map(feature => (
                  <li key={feature} style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      color: plan.accent ? 'var(--color-accent-light)' : 'var(--color-accent)',
                      fontSize: '0.8rem',
                      marginTop: '1px',
                      flexShrink: 0,
                    }}>✓</span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: plan.accent ? 'rgba(250,250,247,0.75)' : 'var(--color-text-soft)',
                      lineHeight: 1.5,
                      fontWeight: 300,
                    }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/checkout?plan=${plan.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px',
                  backgroundColor: plan.accent ? 'var(--color-accent)' : 'transparent',
                  color: plan.accent ? 'var(--color-bg)' : 'var(--color-heading)',
                  border: '1px solid',
                  borderColor: plan.accent ? 'var(--color-accent)' : 'var(--color-heading)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 200ms ease',
                }}
              >
                Get Started
              </Link>
            </div>
          )
        })}
      </div>

      {/* How subscriptions work */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '100px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            How <em style={{ fontStyle: 'italic' }}>subscriptions</em> work
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {[
            { step: '01', title: 'Pick a Plan', desc: 'Choose your frequency and budget.' },
            { step: '02', title: 'Set Your Day', desc: 'Select your preferred delivery day.' },
            { step: '03', title: 'We Arrange', desc: 'Our florists handcraft your bouquet.' },
            { step: '04', title: 'We Deliver', desc: 'Fresh flowers arrive at your door.' },
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-accent)',
                opacity: 0.4,
                marginBottom: '16px',
              }}>
                {item.step}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--color-heading)',
                marginBottom: '8px',
              }}>
                {item.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--color-text-soft)',
                lineHeight: 1.7,
                fontWeight: 300,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '100px 80px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            Questions <em style={{ fontStyle: 'italic' }}>answered</em>
          </h2>
        </div>

        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '16px',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: 'var(--color-heading)',
                  fontWeight: 400,
                }}>
                  {faq.q}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.2rem',
                  color: 'var(--color-accent)',
                  flexShrink: 0,
                  transition: 'transform 300ms ease',
                  transform: activeFaq === i ? 'rotate(45deg)' : 'none',
                }}>
                  +
                </span>
              </button>

              <div style={{
                maxHeight: activeFaq === i ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height 400ms ease',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                  color: 'var(--color-text-soft)',
                  fontWeight: 300,
                  paddingBottom: '24px',
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />
        </div>
      </div>

    </div>
  )
}