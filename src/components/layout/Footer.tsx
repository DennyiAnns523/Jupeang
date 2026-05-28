'use client'
import Link from 'next/link'

const links = {
  Shop: ['Collections', 'Occasions', 'Subscriptions', 'Gift Cards'],
  Company: ['About Us', 'Our Florists', 'Sustainability', 'Press'],
  Help: ['Delivery Info', 'Care Guide', 'Returns', 'Contact'],
}

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-heading)',
      color: 'var(--color-bg)',
      padding: '80px 80px 40px',
    }}>

      {/* Top row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: '48px',
        paddingBottom: '64px',
        borderBottom: '1px solid rgba(250,250,247,0.1)',
        marginBottom: '40px',
      }}>

        {/* Brand */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: 6,
            }}>
              Jupeang
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,247,0.35)',
            }}>
              Konyak · Flower
            </div>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            lineHeight: 1.8,
            color: 'rgba(250,250,247,0.5)',
            maxWidth: '260px',
            fontWeight: 300,
          }}>
            Thoughtfully arranged flowers for every moment that matters.
          </p>

          {/* Social */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            {['Instagram', 'Pinterest', 'TikTok'].map(s => (
              <a key={s} href="#" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,247,0.4)',
                transition: 'color 200ms ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,247,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,247,0.4)')}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([category, items]) => (
          <div key={category}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,247,0.4)',
              marginBottom: '24px',
            }}>
              {category}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <li key={item}>
                  <Link href="#" style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'rgba(250,250,247,0.65)',
                    fontWeight: 300,
                    transition: 'color 200ms ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,247,1)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,247,0.65)')}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'rgba(250,250,247,0.3)',
          letterSpacing: '0.05em',
        }}>
          © 2026 Jupeang. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <Link key={item} href="#" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'rgba(250,250,247,0.3)',
              transition: 'color 200ms ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,247,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,247,0.3)')}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  )
}