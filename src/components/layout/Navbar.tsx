'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { useCart } from '@/lib/cartContext'

function BagButton() {
  const { count, setIsOpen } = useCart()
  return (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text)',
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
      }}
    >
      Bag ({count})
    </button>
  )
}

const links = [
  { label: 'Collections', href: '/collections' },
  { label: 'Occasions', href: '/occasions' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'Garden', href: '/garden' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? '16px 48px' : '28px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 400ms ease',
          backgroundColor: scrolled ? 'rgba(250,250,247,0.96)' : 'rgba(250,250,247,0.82)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid rgba(232,228,220,0.4)',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'var(--color-heading)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            Jupeang
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.48rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            lineHeight: 1,
          }}>
            Konyak · Flower
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex',
          gap: '40px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
          className="hidden-mobile"
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-heading)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-soft)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Cart */}
          {/* Cart */}
          <BagButton />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '4px',
              
            }}
            className="show-mobile"
          >
            <span style={{
              display: 'block', width: '22px', height: '1px',
              backgroundColor: 'var(--color-heading)',
              transition: 'transform 300ms ease',
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1px',
              backgroundColor: 'var(--color-heading)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 300ms ease',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1px',
              backgroundColor: 'var(--color-heading)',
              transition: 'transform 300ms ease',
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 400ms ease',
      }}>
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 300,
              color: 'var(--color-heading)',
              letterSpacing: '0.04em',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `transform 400ms ease ${i * 60}ms, opacity 400ms ease ${i * 60}ms`,
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}