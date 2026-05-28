import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor, queries, type SanityProduct } from '@/lib/sanity'
import FeaturedCard from './FeaturedCard'

async function getFeatured(): Promise<SanityProduct[]> {
  try {
    return await client.fetch(queries.featuredProducts)
  } catch {
    return []
  }
}

export default async function FeaturedCollections() {
  const products = await getFeatured()

  // Graceful empty state — shown until products are added in Sanity Studio
  if (products.length === 0) {
    return (
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '120px 80px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            display: 'block',
            marginBottom: '12px',
          }}>
            Curated For You
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
            marginBottom: '24px',
          }}>
            Featured <em style={{ fontStyle: 'italic' }}>Collections</em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-text-soft)',
            marginBottom: '32px',
          }}>
            Visit <Link href="/studio" style={{ color: 'var(--color-accent)', borderBottom: '1px solid var(--color-accent)' }}>/studio</Link> to add your first products.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', padding: '120px 80px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '64px',
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
            Curated For You
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--color-heading)',
            lineHeight: 1.1,
          }}>
            Featured <em style={{ fontStyle: 'italic' }}>Collections</em>
          </h2>
        </div>

        <Link
          href="/collections"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-soft)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '2px',
          }}
        >
          View All
        </Link>
      </div>

      {/* Grid — up to 4 items, first card is taller */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `${products.length >= 4 ? '1.2fr 1fr 1fr 1fr' : `repeat(${products.length}, 1fr)`}`,
        gap: '24px',
        alignItems: 'start',
      }}>
        {products.slice(0, 4).map((product, i) => (
          <FeaturedCard key={product._id} product={product} index={i} />
        ))}
      </div>

    </section>
  )
}
