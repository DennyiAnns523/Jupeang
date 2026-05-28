'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from 'next-sanity'
import { client, urlFor, queries, type SanityGardenPost } from '@/lib/sanity'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.05rem',
        lineHeight: 1.85,
        color: 'var(--color-text)',
        fontWeight: 300,
        marginBottom: '1.5rem',
      }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.9rem',
        fontWeight: 400,
        color: 'var(--color-heading)',
        lineHeight: 1.2,
        marginTop: '3rem',
        marginBottom: '1rem',
        letterSpacing: '-0.01em',
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        fontWeight: 400,
        color: 'var(--color-heading)',
        lineHeight: 1.25,
        marginTop: '2.5rem',
        marginBottom: '0.75rem',
      }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        borderLeft: '3px solid var(--color-garden)',
        paddingLeft: '1.5rem',
        marginLeft: 0,
        marginTop: '2rem',
        marginBottom: '2rem',
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        fontStyle: 'italic',
        fontWeight: 300,
        color: 'var(--color-text-soft)',
        lineHeight: 1.6,
      }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 500, color: 'var(--color-heading)' }}>{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>{children}</em>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--color-garden-dark)',
          borderBottom: '1px solid var(--color-garden)',
          paddingBottom: '1px',
        }}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{
        paddingLeft: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{
        paddingLeft: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.05rem',
        lineHeight: 1.75,
        color: 'var(--color-text)',
        fontWeight: 300,
        listStyleType: 'disc',
      }}>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.05rem',
        lineHeight: 1.75,
        color: 'var(--color-text)',
        fontWeight: 300,
        listStyleType: 'decimal',
      }}>
        {children}
      </li>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset ? urlFor(value).width(1200).url() : null
      if (!imageUrl) return null
      return (
        <figure style={{ margin: '3rem 0' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <Image
              src={imageUrl}
              alt={value?.alt || ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 860px"
            />
          </div>
          {value?.caption && (
            <figcaption style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--color-text-soft)',
              marginTop: '0.75rem',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function GardenPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<SanityGardenPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    client.fetch(queries.gardenPostBySlug, { slug })
      .then((data: SanityGardenPost) => { setPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
      }}>
        <span style={{
          fontSize: '3rem',
          opacity: 0.25,
          animation: 'breatheSymbol 2s ease-in-out infinite',
        }}>
          🌱
        </span>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        backgroundColor: 'var(--color-bg)',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--color-text-soft)' }}>
          Entry not found.
        </p>
        <Link href="/garden" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-garden)',
          borderBottom: '1px solid var(--color-garden)',
          paddingBottom: '2px',
        }}>
          Back to the garden
        </Link>
      </div>
    )
  }

  const heroUrl = post.heroImage
    ? urlFor(post.heroImage).width(1600).height(700).url()
    : null

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ── Dark header ── */}
      <div style={{
        backgroundColor: 'var(--color-heading)',
        padding: '140px 80px 72px',
      }}>
        <Link
          href="/garden"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.66rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-garden)',
            marginBottom: '40px',
          }}
        >
          ← The Garden
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                border: '1px solid rgba(138,158,123,0.35)',
                color: 'var(--color-garden)',
                backgroundColor: 'rgba(138,158,123,0.08)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
          fontWeight: 300,
          color: 'var(--color-bg)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          maxWidth: '820px',
          marginBottom: '28px',
        }}>
          {post.title}
        </h1>

        {post.date && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(250,250,247,0.4)',
          }}>
            {formatDate(post.date)}
          </span>
        )}
      </div>

      {/* ── Hero image ── */}
      {heroUrl && (
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '21/9',
          overflow: 'hidden',
        }}>
          <Image
            src={heroUrl}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* ── Body content ── */}
      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '72px 40px 120px',
      }}>
        {post.excerpt && (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--color-text-soft)',
            lineHeight: 1.65,
            marginBottom: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {post.excerpt}
          </p>
        )}

        {post.body && post.body.length > 0 ? (
          <PortableText value={post.body} components={ptComponents} />
        ) : (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: 'var(--color-text-soft)',
            textAlign: 'center',
            padding: '60px 0',
          }}>
            This entry is still growing…
          </p>
        )}

        {/* ── Footer nav ── */}
        <div style={{
          marginTop: '80px',
          paddingTop: '40px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link href="/garden" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-garden)',
            borderBottom: '1px solid var(--color-garden)',
            paddingBottom: '2px',
          }}>
            ← All entries
          </Link>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}>
            Jupeang · The Garden
          </span>
        </div>
      </div>

    </div>
  )
}
