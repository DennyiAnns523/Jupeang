'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const values = [
  {
    title: 'Grown with Intention',
    description: 'We source only from farms that prioritise sustainable growing practices, seasonal rhythms, and soil health.',
  },
  {
    title: 'Arranged by Hand',
    description: 'Every bouquet is designed by one of our in-house florists. No assembly lines. No shortcuts.',
  },
  {
    title: 'Delivered with Care',
    description: 'Our delivery team treats every order like it\'s their own. Because flowers are never just flowers.',
  },
]

const team = [
  { name: 'Isabelle Marsh', role: 'Head Florist & Founder', color: 'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)' },
  { name: 'Clara Webb', role: 'Senior Florist', color: 'linear-gradient(145deg, #C8D4B8 0%, #B0C49A 100%)' },
  { name: 'Nora Chen', role: 'Creative Director', color: 'linear-gradient(145deg, #E0C4C4 0%, #D0A8A8 100%)' },
]

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const els = sectionRef.current?.querySelectorAll('.fade-in')
            els?.forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)'
              }, i * 120)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Hero */}
      <div style={{
        minHeight: '70vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}>
        {/* Left */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '160px 80px 80px',
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
            Our Story
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 4vw, 5rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
            lineHeight: 1.05,
            marginBottom: '32px',
          }}>
            Flowers are our <em style={{ fontStyle: 'italic' }}>language.</em>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.9,
            color: 'var(--color-text-soft)',
            maxWidth: '420px',
            fontWeight: 300,
          }}>
            Jupeang was born from a single word in Konyak — our language for flower.
            What started as a passion project became a quiet obsession —
            finding the most beautiful blooms and placing them exactly where they belong.
          </p>
        </div>

        {/* Right — terrace garden at golden hour */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src="/images/IMG-20251127-WA0049.jpg"
            alt="The terrace flower garden at golden hour"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            sizes="50vw"
          />
          {/* Top fade so About page header text stays readable */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(250,250,247,0.45) 0%, transparent 35%)',
          }} />
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        backgroundColor: 'var(--color-heading)',
        padding: '48px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
      }}>
        {[
          { num: '2018', label: 'Founded' },
          { num: '12,000+', label: 'Bouquets Delivered' },
          { num: '4.9★', label: 'Average Rating' },
          { num: '3', label: 'Studio Locations' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 300,
              color: 'var(--color-bg)',
              marginBottom: '6px',
            }}>{stat.num}</div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,247,0.4)',
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div ref={sectionRef} style={{ padding: '120px 80px' }}>
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
            What We Stand For
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            Our <em style={{ fontStyle: 'italic' }}>Values</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px',
        }}>
          {values.map((value, i) => (
            <div
              key={value.title}
              className="fade-in"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                padding: '40px',
                backgroundColor: 'var(--color-surface)',
                borderTop: '2px solid var(--color-accent)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}>
                0{i + 1}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 400,
                color: 'var(--color-heading)',
                marginBottom: '16px',
                lineHeight: 1.3,
              }}>
                {value.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: 'var(--color-text-soft)',
                fontWeight: 300,
              }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{
        padding: '0 80px 120px',
        backgroundColor: 'var(--color-bg)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            display: 'block',
            marginBottom: '12px',
          }}>
            The People
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
          }}>
            Meet the <em style={{ fontStyle: 'italic' }}>Florists</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
        }}>
          {team.map(member => (
            <div key={member.name}>
              <div style={{
                aspectRatio: '3/4',
                background: member.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '6rem',
                marginBottom: '20px',
              }}>
                <span style={{ opacity: 0.15 }}>✿</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--color-heading)',
                marginBottom: '4px',
              }}>
                {member.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
              }}>
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '100px 80px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 3.5vw, 4rem)',
          fontWeight: 300,
          color: 'var(--color-heading)',
          marginBottom: '24px',
          lineHeight: 1.1,
        }}>
          Ready to send something <em style={{ fontStyle: 'italic' }}>beautiful?</em>
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--color-text-soft)',
          marginBottom: '40px',
          fontWeight: 300,
        }}>
          Browse our collections and find the perfect arrangement.
        </p>
        <Link href="/collections" style={{
          display: 'inline-block',
          padding: '16px 48px',
          backgroundColor: 'var(--color-heading)',
          color: 'var(--color-bg)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          Shop Now
        </Link>
      </div>

    </div>
  )
}