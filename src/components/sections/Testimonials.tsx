'use client'

import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    quote: 'The most beautiful arrangement I have ever received. Every petal was perfect and the delivery was right on time.',
    author: 'Sarah M.',
    occasion: 'Anniversary Gift',
  },
  {
    id: 2,
    quote: 'I ordered for my mother\'s birthday and she cried happy tears. The personalised card made it feel so special.',
    author: 'James T.',
    occasion: 'Birthday',
  },
  {
    id: 3,
    quote: 'Jupeang did our entire wedding floristry. The white elegance collection was beyond what we imagined.',
    author: 'Priya & Rohan',
    occasion: 'Wedding',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section style={{
      backgroundColor: 'var(--color-bg)',
      padding: '120px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
    }}>

      {/* Left — decorative */}
      <div style={{
        position: 'relative',
        height: '480px',
      }}>
        {/* Large background block */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: '40px',
          bottom: '40px',
          backgroundColor: 'var(--color-surface)',
        }} />
        {/* Offset accent block */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '200px',
          backgroundColor: 'var(--color-accent-light)',
        }} />
        {/* Center symbol */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10rem',
          opacity: 0.1,
          fontFamily: 'var(--font-display)',
        }}>✿</div>

        {/* Floating stat */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '20px',
          backgroundColor: 'var(--color-bg)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          zIndex: 2,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--color-heading)',
          }}>4.9</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            marginTop: '4px',
          }}>Average Rating</div>
        </div>
      </div>

      {/* Right — testimonials */}
      <div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          display: 'block',
          marginBottom: '12px',
        }}>
          What They Say
        </span>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3vw, 3rem)',
          fontWeight: 300,
          color: 'var(--color-heading)',
          marginBottom: '48px',
          lineHeight: 1.1,
        }}>
          Flowers that leave <em style={{ fontStyle: 'italic' }}>lasting</em> impressions.
        </h2>

        {/* Quote */}
        <div style={{
          borderLeft: '2px solid var(--color-accent)',
          paddingLeft: '28px',
          marginBottom: '40px',
          minHeight: '120px',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: 'var(--color-text)',
            fontStyle: 'italic',
            fontWeight: 300,
            marginBottom: '20px',
            transition: 'opacity 400ms ease',
          }}>
            "{testimonials[active].quote}"
          </p>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
          }}>
            {testimonials[active].author} — {testimonials[active].occasion}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: i === active ? 'var(--color-accent)' : 'var(--color-border)',
                cursor: 'pointer',
                transition: 'width 300ms ease, background-color 300ms ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

    </section>
  )
}