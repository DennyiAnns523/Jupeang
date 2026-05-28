'use client'

import { useEffect, useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Choose Your Arrangement',
    description: 'Browse our curated collections by occasion, season, or mood. Every arrangement is designed in-house by our florists.',
  },
  {
    number: '02',
    title: 'Personalise Your Gift',
    description: 'Add a handwritten card, choose your vase, select add-ons. We make every detail feel intentional.',
  },
  {
    number: '03',
    title: 'We Deliver With Care',
    // Fixed using double quotes to allow the apostrophe in "someone's"
    description: "Same-day delivery available. Your flowers arrive fresh, wrapped beautifully, ready to make someone's day.",
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = sectionRef.current?.querySelectorAll('.step-card')
            cards?.forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = '1';
                (card as HTMLElement).style.transform = 'translateY(0)'
              }, i * 150)
            })
          }
        })
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{
      backgroundColor: 'var(--color-surface)',
      padding: '120px 80px',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          display: 'block',
          marginBottom: '12px',
        }}>
          Simple & Thoughtful
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
          fontWeight: 300,
          color: 'var(--color-heading)',
          lineHeight: 1.1,
        }}>
          How it <em style={{ fontStyle: 'italic' }}>works</em>
        </h2>
      </div>

      {/* Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '48px',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
      }}>

        {/* Connecting line */}
        <div style={{
          position: 'absolute',
          top: '28px',
          left: 'calc(16.66% + 16px)',
          right: 'calc(16.66% + 16px)',
          height: '1px',
          backgroundColor: 'var(--color-border)',
          zIndex: 0,
        }} />

        {steps.map((step, i) => (
          <div
            key={step.number}
            className="step-card"
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              opacity: 0,
              transform: 'translateY(24px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
            }}
          >
            {/* Number circle */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--color-accent)',
              letterSpacing: '0.05em',
            }}>
              {step.number}
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 400,
              color: 'var(--color-heading)',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}>
              {step.title}
            </h3>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.8,
              color: 'var(--color-text-soft)',
              fontWeight: 300,
            }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}