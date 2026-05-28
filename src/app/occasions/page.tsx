'use client'

import { useState } from 'react'
import Link from 'next/link'

const occasions = [
  {
    id: 'romance',
    label: 'Romance',
    headline: 'Say it with flowers.',
    description: 'From first dates to anniversaries — arrangements that speak when words fall short.',
    color: 'linear-gradient(145deg, #E0C4C4 0%, #D0A8A8 100%)',
    products: ['Garden Roses', 'Soft Peony', 'Sunset Bloom'],
    prices: [65, 85, 75],
    colors: [
      'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
      'linear-gradient(145deg, #E0C4C4 0%, #D0A8A8 100%)',
      'linear-gradient(145deg, #D4A898 0%, #C49080 100%)',
    ],
  },
  {
    id: 'birthdays',
    label: 'Birthdays',
    headline: 'Make it memorable.',
    description: 'Bright, joyful arrangements that celebrate the people you love most.',
    color: 'linear-gradient(145deg, #D4C4A0 0%, #C4B080 100%)',
    products: ['Golden Hour', 'Wild Meadow', 'Sunset Bloom'],
    prices: [90, 45, 75],
    colors: [
      'linear-gradient(145deg, #D4C4A0 0%, #C4B080 100%)',
      'linear-gradient(145deg, #C8D4B8 0%, #B0C49A 100%)',
      'linear-gradient(145deg, #D4A898 0%, #C49080 100%)',
    ],
  },
  {
    id: 'weddings',
    label: 'Weddings',
    headline: 'Your day, perfected.',
    description: 'Bespoke floral design for ceremonies, receptions, and everything in between.',
    color: 'linear-gradient(145deg, #E8E4DC 0%, #D8D0C4 100%)',
    products: ['White Elegance', 'Ivory Dream', 'Garden Roses'],
    prices: [120, 150, 65],
    colors: [
      'linear-gradient(145deg, #E8E4DC 0%, #D8D0C4 100%)',
      'linear-gradient(145deg, #F0EDE8 0%, #E0D8CC 100%)',
      'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
    ],
  },
  {
    id: 'sympathy',
    label: 'Sympathy',
    headline: 'A quiet gesture of care.',
    description: 'Gentle, dignified arrangements that offer comfort when it matters most.',
    color: 'linear-gradient(145deg, #D0C4D4 0%, #B8A8C4 100%)',
    products: ['Lavender Mist', 'White Elegance', 'Morning Dew'],
    prices: [60, 120, 40],
    colors: [
      'linear-gradient(145deg, #D0C4D4 0%, #B8A8C4 100%)',
      'linear-gradient(145deg, #E8E4DC 0%, #D8D0C4 100%)',
      'linear-gradient(145deg, #C4D4C8 0%, #A8C4B0 100%)',
    ],
  },
  {
    id: 'everyday',
    label: 'Everyday',
    headline: 'For no reason at all.',
    description: 'Because flowers don\'t need an occasion. Fresh arrangements for home, office, or simply because.',
    color: 'linear-gradient(145deg, #C8D4B8 0%, #B0C49A 100%)',
    products: ['Wild Meadow', 'Morning Dew', 'Garden Roses'],
    prices: [45, 40, 65],
    colors: [
      'linear-gradient(145deg, #C8D4B8 0%, #B0C49A 100%)',
      'linear-gradient(145deg, #C4D4C8 0%, #A8C4B0 100%)',
      'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
    ],
  },
  {
    id: 'celebrations',
    label: 'Celebrations',
    headline: 'Every milestone deserves flowers.',
    description: 'Graduations, promotions, new arrivals — mark life\'s big moments beautifully.',
    color: 'linear-gradient(145deg, #D4A898 0%, #C49080 100%)',
    products: ['Sunset Bloom', 'Golden Hour', 'Soft Peony'],
    prices: [75, 90, 85],
    colors: [
      'linear-gradient(145deg, #D4A898 0%, #C49080 100%)',
      'linear-gradient(145deg, #D4C4A0 0%, #C4B080 100%)',
      'linear-gradient(145deg, #E0C4C4 0%, #D0A8A8 100%)',
    ],
  },
]

export default function OccasionsPage() {
  const [active, setActive] = useState(occasions[0])

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        padding: '160px 80px 80px',
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
          Shop by Moment
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 5rem)',
          fontWeight: 300,
          color: 'var(--color-heading)',
          lineHeight: 1.05,
          marginBottom: '24px',
        }}>
          Every <em style={{ fontStyle: 'italic' }}>occasion</em> has a flower.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--color-text-soft)',
          maxWidth: '440px',
          margin: '0 auto',
          lineHeight: 1.8,
          fontWeight: 300,
        }}>
          Find the perfect arrangement for the moment you're in.
        </p>
      </div>

      {/* Occasion tabs */}
      <div style={{
        padding: '0 80px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
      }}>
        {occasions.map(occ => (
          <button
            key={occ.id}
            onClick={() => setActive(occ)}
            style={{
              padding: '24px 32px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              borderBottom: '2px solid',
              borderColor: active.id === occ.id ? 'var(--color-heading)' : 'transparent',
              color: active.id === occ.id ? 'var(--color-heading)' : 'var(--color-text-soft)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {occ.label}
          </button>
        ))}
      </div>

      {/* Active occasion content */}
      <div style={{
        padding: '80px 80px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
      }}>

        {/* Left — text */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 4rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            {active.headline}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'var(--color-text-soft)',
            fontWeight: 300,
            marginBottom: '48px',
            maxWidth: '420px',
          }}>
            {active.description}
          </p>

          {/* Product list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {active.products.map((product, i) => (
              <div
                key={product}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: 'var(--color-surface)',
                  borderLeft: '2px solid var(--color-accent)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: active.colors[i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>
                    <span style={{ opacity: 0.4 }}>✿</span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: 'var(--color-heading)',
                  }}>
                    {product}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--color-accent)',
                  whiteSpace: 'nowrap',
                }}>
                  from ${active.prices[i]}
                </span>
              </div>
            ))}
          </div>

          <Link
            href={`/collections?occasion=${active.id}`}
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              backgroundColor: 'var(--color-heading)',
              color: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Shop {active.label}
          </Link>
        </div>

        {/* Right — visual */}
        <div style={{ position: 'relative' }}>
          <div style={{
            aspectRatio: '4/5',
            background: active.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12rem',
            transition: 'background 400ms ease',
          }}>
            <span style={{ opacity: 0.15 }}>✿</span>
          </div>

          {/* Floating label */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '-24px',
            backgroundColor: 'var(--color-bg)',
            padding: '16px 24px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-soft)',
              marginBottom: '4px',
            }}>
              Perfect for
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--color-heading)',
            }}>
              {active.label}
            </div>
          </div>
        </div>
      </div>

      {/* All occasions grid */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '100px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            Browse all <em style={{ fontStyle: 'italic' }}>occasions</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {occasions.map(occ => (
            <button
              key={occ.id}
              onClick={() => {
                setActive(occ)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              style={{
                background: occ.color,
                border: 'none',
                cursor: 'pointer',
                padding: '48px 32px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 300ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-20px',
                fontSize: '7rem',
                opacity: 0.12,
              }}>✿</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(30,27,24,0.5)',
                marginBottom: '8px',
              }}>
                Shop for
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--color-heading)',
              }}>
                {occ.label}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}