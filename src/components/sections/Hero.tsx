'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PETALS = [
  { left: '6%',  delay: '0s',  dur: '22s', size: 14 },
  { left: '18%', delay: '6s',  dur: '19s', size: 10 },
  { left: '32%', delay: '11s', dur: '25s', size: 12 },
  { left: '54%', delay: '3s',  dur: '20s', size: 9  },
  { left: '71%', delay: '8s',  dur: '17s', size: 13 },
  { left: '85%', delay: '14s', dur: '23s', size: 11 },
  { left: '94%', delay: '5s',  dur: '21s', size: 8  },
]

const TAGLINES = [
  'Konyak · Flower',
  'New Season Collection',
  'Same-Day Delivery',
  'Thoughtfully Arranged',
]

const MINI_PETALS = [
  { top: '18%', left: '16%', delay: '0s', dur: '9s'  },
  { top: '62%', left: '76%', delay: '3s', dur: '11s' },
  { top: '40%', left: '87%', delay: '7s', dur: '8s'  },
]

export default function Hero() {
  const [tagIdx, setTagIdx] = useState(0)
  const [tagFading, setTagFading] = useState(false)
  const magnetRef = useRef<HTMLDivElement>(null)

  // Cycle taglines
  useEffect(() => {
    const t = setInterval(() => {
      setTagFading(true)
      setTimeout(() => {
        setTagIdx(i => (i + 1) % TAGLINES.length)
        setTagFading(false)
      }, 360)
    }, 3200)
    return () => clearInterval(t)
  }, [])

  // Magnetic button
  const onMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magnetRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.3
    const y = (e.clientY - r.top - r.height / 2) * 0.3
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = 'transform 80ms ease'
  }

  const onMagnetLeave = () => {
    if (!magnetRef.current) return
    magnetRef.current.style.transform = 'translate(0, 0)'
    magnetRef.current.style.transition = 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)'
  }

  return (
    <section className="hero-section">

      {/* ── Floating petals ── */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: p.left,
            fontSize: p.size,
            color: 'var(--color-accent)',
            animation: `petalFloat ${p.dur} linear ${p.delay} infinite`,
            pointerEvents: 'none',
            zIndex: 5,
            userSelect: 'none',
          }}
        >✿</span>
      ))}

      {/* ── Left — text panel ── */}
      <div
        className="hero-text-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(100px, 10vw, 140px) clamp(32px, 4vw, 60px) 80px clamp(32px, 6vw, 80px)',
          position: 'relative',
          zIndex: 2,
        }}
      >

        {/* Cycling tagline */}
        <div style={{ height: 17, overflow: 'hidden', marginBottom: 32 }}>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.66rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            opacity: tagFading ? 0 : 1,
            transform: tagFading ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'opacity 360ms ease, transform 360ms ease',
          }}>
            {TAGLINES[tagIdx]}
          </span>
        </div>

        {/* JUPEANG — clip reveal */}
        <div style={{ overflow: 'hidden', marginBottom: 6 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.2rem, 6.5vw, 7rem)',
            fontWeight: 300,
            lineHeight: 0.95,
            color: 'var(--color-heading)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            animation: 'revealUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}>
            Jupeang
          </h1>
        </div>

        {/* Accent underline — expands left → right */}
        <div style={{
          height: 1,
          backgroundColor: 'var(--color-accent)',
          maxWidth: 220,
          marginBottom: 26,
          transformOrigin: 'left center',
          animation: 'lineExpand 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both',
        }} />

        {/* Sub-headline */}
        <div style={{ overflow: 'hidden', marginBottom: 4 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.2vw, 2.1rem)',
            fontWeight: 300,
            lineHeight: 1.3,
            color: 'var(--color-text)',
            fontStyle: 'italic',
            animation: 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both',
          }}>
            flowers that speak
          </p>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 36 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.2vw, 2.1rem)',
            fontWeight: 300,
            lineHeight: 1.3,
            color: 'var(--color-text)',
            animation: 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
          }}>
            before words do.
          </p>
        </div>

        {/* Body copy */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.93rem',
          lineHeight: 1.85,
          color: 'var(--color-text-soft)',
          maxWidth: 340,
          fontWeight: 300,
          marginBottom: 44,
          animation: 'fadeUp 0.9s ease 0.85s both',
        }}>
          Thoughtfully arranged, same-day delivered.
          Every bouquet is designed to feel like a moment — not just a gift.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          marginBottom: 72,
          animation: 'fadeUp 0.9s ease 1s both',
        }}>
          {/* Magnetic primary button */}
          <div
            ref={magnetRef}
            onMouseMove={onMagnetMove}
            onMouseLeave={onMagnetLeave}
            style={{ display: 'inline-block' }}
          >
            <Link
              href="/collections"
              style={{
                display: 'block',
                padding: '14px 38px',
                backgroundColor: 'var(--color-heading)',
                color: 'var(--color-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'background-color 300ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-dark)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-heading)')}
            >
              Shop Now
            </Link>
          </div>

          <Link
            href="/about"
            style={{
              display: 'inline-block',
              padding: '14px 38px',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              transition: 'border-color 250ms ease, color 250ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 48,
          paddingTop: 32,
          borderTop: '1px solid var(--color-border)',
          animation: 'fadeUp 0.9s ease 1.1s both',
        }}>
          {[
            { num: '200+',     label: 'Arrangements' },
            { num: 'Same Day', label: 'Delivery'     },
            { num: '4.9★',     label: 'Rating'       },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 400,
                color: 'var(--color-heading)',
                marginBottom: 4,
              }}>{s.num}</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Right — botanical / image panel ── */}
      <div
        className="hero-img-panel"
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-surface)',
          overflow: 'hidden',
        }}
      >
        {/* Real photo — mom with hydrangea on the terrace */}
        <Image
          src="/images/IMG-20250617-WA0015.jpg"
          alt="Mom holding a hydrangea on the terrace garden"
          fill
          priority
          sizes="45vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />

        {/* Top fade — keeps navbar links readable over the photo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(250,250,247,0.55) 0%, rgba(250,250,247,0.1) 28%, rgba(30,27,24,0.25) 100%)',
          zIndex: 1,
        }} />

        {/* Botanical compass-rose SVG ring */}
        <svg
          viewBox="0 0 460 600"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {/* Outer dashed ring — rotates CW */}
          <g className="ring-outer">
            <circle cx="230" cy="300" r="216" stroke="#B89A72" strokeWidth="0.7" strokeDasharray="3 13" opacity="0.65" />
          </g>

          {/* Inner dotted ring — rotates CCW */}
          <g className="ring-inner">
            <circle cx="230" cy="300" r="191" stroke="#D4C5B0" strokeWidth="0.5" strokeDasharray="1 8" opacity="0.5" />
          </g>

          {/* Cardinal tick marks (N / S / E / W) */}
          <line x1="230" y1="80"  x2="230" y2="108" stroke="#B89A72" strokeWidth="1.3" opacity="0.8" />
          <line x1="230" y1="492" x2="230" y2="520" stroke="#B89A72" strokeWidth="1.3" opacity="0.8" />
          <line x1="10"  y1="300" x2="38"  y2="300" stroke="#B89A72" strokeWidth="1.3" opacity="0.8" />
          <line x1="422" y1="300" x2="450" y2="300" stroke="#B89A72" strokeWidth="1.3" opacity="0.8" />

          {/* Ordinal small ticks (NE / NW / SE / SW) */}
          <line x1="77"  y1="147" x2="94"  y2="164" stroke="#B89A72" strokeWidth="0.8" opacity="0.5" />
          <line x1="366" y1="147" x2="383" y2="164" stroke="#B89A72" strokeWidth="0.8" opacity="0.5" />
          <line x1="77"  y1="453" x2="94"  y2="436" stroke="#B89A72" strokeWidth="0.8" opacity="0.5" />
          <line x1="366" y1="453" x2="383" y2="436" stroke="#B89A72" strokeWidth="0.8" opacity="0.5" />

          {/* Diamond ornaments at cardinal points */}
          <polygon points="230,77  234,84  230,91  226,84"  fill="#B89A72" opacity="0.85" />
          <polygon points="230,509 234,516 230,523 226,516" fill="#B89A72" opacity="0.85" />
          <polygon points="7,300   14,296  21,300  14,304"  fill="#B89A72" opacity="0.85" />
          <polygon points="439,300 446,296 453,300 446,304" fill="#B89A72" opacity="0.85" />
        </svg>

        {/* Floating mini petals */}
        {MINI_PETALS.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: p.top,
              left: p.left,
              fontSize: '1.5rem',
              color: 'var(--color-accent-dark)',
              opacity: 0.35,
              animation: `gentleFloat ${p.dur} ease-in-out ${p.delay} infinite`,
              zIndex: 3,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >✿</span>
        ))}

        {/* Featured Today card */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          backgroundColor: 'var(--color-bg)',
          padding: '18px 28px',
          boxShadow: '0 8px 40px rgba(30,27,24,0.14)',
          zIndex: 4,
          animation: 'cardSlideIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.5s both',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            marginBottom: 6,
          }}>Featured Today</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            color: 'var(--color-heading)',
            marginBottom: 5,
          }}>Garden Rose Bouquet</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: 'var(--color-accent)',
          }}>from $65</div>
        </div>

        {/* Konyak language badge — top-right */}
        <div style={{
          position: 'absolute',
          top: 28,
          right: 28,
          zIndex: 4,
          textAlign: 'right',
          animation: 'fadeUp 1s ease 1.8s both',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.56rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(61,56,50,0.4)',
          }}>Jupeang</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.78rem',
            fontStyle: 'italic',
            color: 'rgba(61,56,50,0.3)',
            marginTop: 2,
          }}>Konyak for Flower</div>
        </div>

      </div>

    </section>
  )
}
