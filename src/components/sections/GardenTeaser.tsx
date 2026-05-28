import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor, queries, type SanityGardenPost } from '@/lib/sanity'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

async function getLatestPosts(): Promise<SanityGardenPost[]> {
  try {
    return await client.fetch(queries.latestGardenPosts)
  } catch {
    return []
  }
}

export default async function GardenTeaser() {
  const posts = await getLatestPosts()
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

  return (
    <section style={{
      backgroundColor: 'var(--color-heading)',
      padding: '100px 80px',
    }}>

      {/* ── Section header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '64px',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--color-garden)',
            marginBottom: '16px',
          }}>
            From the Terrace
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
            fontWeight: 300,
            color: 'var(--color-bg)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            The <em style={{ fontStyle: 'italic' }}>Garden</em> Journal
          </h2>
        </div>
        <Link
          href="/garden"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-garden)',
            borderBottom: '1px solid var(--color-garden)',
            paddingBottom: '3px',
            flexShrink: 0,
          }}
        >
          All entries →
        </Link>
      </div>

      {/* ── Posts layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: rest.length > 0 ? '1.3fr 1fr' : '1fr',
        gap: '40px',
        alignItems: 'start',
      }}>

        {/* Lead post — large */}
        <LeadCard post={lead} />

        {/* Secondary posts — stacked */}
        {rest.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {rest.map(post => (
              <SmallCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

    </section>
  )
}

function LeadCard({ post }: { post: SanityGardenPost }) {
  const imageUrl = post.heroImage
    ? urlFor(post.heroImage).width(900).height(600).url()
    : null

  return (
    <Link href={`/garden/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '3/2',
        overflow: 'hidden',
        backgroundColor: 'rgba(138,158,123,0.15)',
        marginBottom: '28px',
      }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 600ms ease' }}
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '6rem', opacity: 0.1,
          }}>
            🌱
          </div>
        )}
        {post.date && (
          <div style={{
            position: 'absolute', bottom: '16px', left: '16px',
            backgroundColor: 'var(--color-heading)',
            color: 'var(--color-bg)',
            padding: '6px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            {formatDate(post.date)}
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.56rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              border: '1px solid rgba(138,158,123,0.3)',
              color: 'var(--color-garden)',
              backgroundColor: 'rgba(138,158,123,0.08)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
        fontWeight: 300,
        color: 'var(--color-bg)',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        marginBottom: '12px',
      }}>
        {post.title}
      </h3>

      {post.excerpt && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          color: 'rgba(250,250,247,0.45)',
          fontWeight: 300,
          marginBottom: '20px',
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
        fontSize: '0.66rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-garden)',
        borderBottom: '1px solid var(--color-garden)',
        paddingBottom: '2px',
      }}>
        Read the entry
      </span>
    </Link>
  )
}

function SmallCard({ post }: { post: SanityGardenPost }) {
  const imageUrl = post.heroImage
    ? urlFor(post.heroImage).width(600).height(380).url()
    : null

  return (
    <Link href={`/garden/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/2',
          overflow: 'hidden',
          backgroundColor: 'rgba(138,158,123,0.15)',
          flexShrink: 0,
        }}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="140px"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', opacity: 0.12,
            }}>
              🌱
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          {post.date && (
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.58rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,247,0.3)',
              marginBottom: '8px',
            }}>
              {formatDate(post.date)}
            </span>
          )}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 300,
            color: 'var(--color-bg)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: '8px',
          }}>
            {post.title}
          </h3>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-garden)',
          }}>
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}
