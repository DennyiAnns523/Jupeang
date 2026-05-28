'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type SanityProduct } from '@/lib/sanity'

export default function FeaturedCard({ product, index }: { product: SanityProduct; index: number }) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = product.image ? urlFor(product.image).width(800).height(1000).url() : null

  return (
    <Link
      href={`/collections/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: index === 0 ? '3/4' : '4/5',
        overflow: 'hidden',
        marginBottom: '16px',
        backgroundColor: 'var(--color-surface)',
      }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 600ms ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '6rem',
            transition: 'transform 600ms ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}>
            <span style={{ opacity: 0.15 }}>✿</span>
          </div>
        )}

        {/* Tag */}
        {product.tag && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'var(--color-bg)',
            padding: '4px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}>
            {product.tag}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(30,27,24,0.08)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 400ms ease',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '28px',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-bg)',
            borderBottom: '1px solid rgba(250,250,247,0.6)',
            paddingBottom: '2px',
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 400ms ease',
          }}>
            View Collection
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginTop: '12px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            marginBottom: '4px',
          }}>
            {product.occasion}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 400,
            color: 'var(--color-heading)',
          }}>
            {product.name}
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--color-accent)',
          marginTop: '4px',
          whiteSpace: 'nowrap',
        }}>
          from ${product.price}
        </div>
      </div>
    </Link>
  )
}
