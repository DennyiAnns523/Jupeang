'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type SanityProduct } from '@/lib/sanity'

const FILTERS = ['All', 'Romance', 'Everyday', 'Weddings', 'Celebrations', 'Sympathy', 'Birthdays']

function ProductCard({ product }: { product: SanityProduct }) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = product.image ? urlFor(product.image).width(600).height(750).url() : null

  return (
    <Link
      href={`/collections/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '4/5',
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
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem',
            transition: 'transform 600ms ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}>
            <span style={{ opacity: 0.15 }}>✿</span>
          </div>
        )}

        {product.tag && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            backgroundColor: 'var(--color-bg)',
            padding: '4px 10px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}>
            {product.tag}
          </div>
        )}

        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(30,27,24,0.08)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 300ms ease',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: '24px',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-bg)',
            borderBottom: '1px solid rgba(250,250,247,0.6)',
            paddingBottom: '2px',
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 300ms ease',
          }}>
            View Details
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.62rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            marginBottom: '4px',
          }}>
            {product.occasion}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
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
          whiteSpace: 'nowrap',
          marginTop: '18px',
        }}>
          from ${product.price}
        </div>
      </div>
    </Link>
  )
}

export default function CollectionsClient({ products }: { products: SanityProduct[] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.occasion === activeFilter)

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        padding: '160px 80px 64px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
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
            All Arrangements
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
            lineHeight: 1.05,
          }}>
            Our <em style={{ fontStyle: 'italic' }}>Collections</em>
          </h1>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-soft)' }}>
          {filtered.length} {filtered.length === 1 ? 'arrangement' : 'arrangements'}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        padding: '28px 80px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '8px 20px',
              border: '1px solid',
              borderColor: activeFilter === filter ? 'var(--color-heading)' : 'var(--color-border)',
              backgroundColor: activeFilter === filter ? 'var(--color-heading)' : 'transparent',
              color: activeFilter === filter ? 'var(--color-bg)' : 'var(--color-text-soft)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div style={{ padding: '120px 80px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', opacity: 0.15, marginBottom: '24px' }}>✿</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--color-text-soft)' }}>
            {products.length === 0
              ? 'No products yet — add some in the Studio.'
              : `No ${activeFilter} arrangements right now.`}
          </p>
        </div>
      ) : (
        <div style={{
          padding: '64px 80px 120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px 28px',
        }}>
          {filtered.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}
