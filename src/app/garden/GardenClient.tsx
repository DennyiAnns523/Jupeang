'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type SanityGardenPost } from '@/lib/sanity'

const ALL_TAGS = [
  'Seeds', 'Soil', 'Composting', 'Watering', 'Fertiliser',
  'Seedlings', 'Harvest', 'Terrace', 'Flowers', 'Vegetables', 'Learning',
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function PostCard({ post }: { post: SanityGardenPost }) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = post.heroImage
    ? urlFor(post.heroImage).width(800).height(500).url()
    : null

  return (
    <Link
      href={`/garden/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/10',
        overflow: 'hidden',
        backgroundColor: 'var(--color-garden-light)',
        marginBottom: '20px',
      }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            style={{
              objectFit: 'cover',
              transition: 'transform 600ms ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem', opacity: 0.15, color: 'var(--color-garden)',
          }}>
            🌱
          </div>
        )}

        {/* Date badge */}
        {post.date && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'var(--color-heading)',
            color: 'var(--color-bg)',
            padding: '6px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            {formatDate(post.date)}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(30,27,24,0.06)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 300ms ease',
        }} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              border: '1px solid var(--color-garden)',
              color: 'var(--color-garden-dark)',
              backgroundColor: 'var(--color-garden-light)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        fontWeight: 400,
        color: 'var(--color-heading)',
        lineHeight: 1.25,
        marginBottom: '8px',
        transition: 'color 200ms ease',
        ...(hovered ? { color: 'var(--color-garden-dark)' } : {}),
      }}>
        {post.title}
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          color: 'var(--color-text-soft)',
          fontWeight: 300,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.excerpt}
        </p>
      )}

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.68rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-garden)',
        borderBottom: '1px solid var(--color-garden)',
        paddingBottom: '2px',
        transition: 'color 200ms ease',
      }}>
        Read the entry
      </span>
    </Link>
  )
}

export default function GardenClient({ posts }: { posts: SanityGardenPost[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? posts.filter(p => p.tags?.includes(activeTag))
    : posts

  // Collect all tags that actually appear in posts
  const usedTags = ALL_TAGS.filter(t => posts.some(p => p.tags?.includes(t)))

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ── Dark header ── */}
      <div style={{
        backgroundColor: 'var(--color-heading)',
        padding: '160px 80px 80px',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.66rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'var(--color-garden)',
          display: 'block',
          marginBottom: '20px',
        }}>
          Terrace · Seeds · Learning
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 6vw, 6rem)',
          fontWeight: 300,
          color: 'var(--color-bg)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          marginBottom: '24px',
        }}>
          The <em style={{ fontStyle: 'italic' }}>Garden</em>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.8,
          color: 'rgba(250,250,247,0.5)',
          maxWidth: '480px',
          fontWeight: 300,
        }}>
          A personal account of learning to grow flowers and vegetables
          from seed on our city terrace. Honest notes — the failures and
          the slow, quiet victories.
        </p>
      </div>

      {/* ── Tag filter row ── */}
      {usedTags.length > 0 && (
        <div style={{
          padding: '24px 80px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--color-surface)',
        }}>
          <button
            onClick={() => setActiveTag(null)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              border: '1px solid',
              borderColor: !activeTag ? 'var(--color-garden-dark)' : 'var(--color-border)',
              backgroundColor: !activeTag ? 'var(--color-garden-dark)' : 'transparent',
              color: !activeTag ? 'var(--color-bg)' : 'var(--color-text-soft)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            All
          </button>
          {usedTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '7px 18px',
                border: '1px solid',
                borderColor: activeTag === tag ? 'var(--color-garden-dark)' : 'var(--color-border)',
                backgroundColor: activeTag === tag ? 'var(--color-garden-dark)' : 'transparent',
                color: activeTag === tag ? 'var(--color-bg)' : 'var(--color-text-soft)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Posts grid / empty state ── */}
      {filtered.length === 0 ? (
        <div style={{ padding: '120px 80px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🌱</div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontStyle: 'italic',
            color: 'var(--color-text-soft)',
            marginBottom: '12px',
          }}>
            {posts.length === 0
              ? 'The garden is just getting started.'
              : `No entries tagged "${activeTag}" yet.`}
          </p>
          {posts.length === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-soft)' }}>
              Add your first journal post in the <Link href="/studio" style={{ color: 'var(--color-garden)', borderBottom: '1px solid var(--color-garden)' }}>Studio</Link>.
            </p>
          )}
        </div>
      ) : (
        <div style={{
          padding: '72px 80px 120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '64px 48px',
        }}>
          {filtered.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

    </div>
  )
}
