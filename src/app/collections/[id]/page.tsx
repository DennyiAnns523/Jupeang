'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cartContext'
import { client, urlFor, type SanityProduct } from '@/lib/sanity'

const sizes = [
  { label: 'Small',  description: '8–10 stems',  multiplier: 1   },
  { label: 'Medium', description: '14–16 stems', multiplier: 1.4 },
  { label: 'Large',  description: '20–24 stems', multiplier: 1.8 },
]

const addons = [
  { id: 'vase',  label: 'Glass Vase',    price: 18 },
  { id: 'choc',  label: 'Chocolates',    price: 12 },
  { id: 'wrap',  label: 'Premium Wrap',  price: 8  },
]

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addItem } = useCart()

  const [product, setProduct] = useState<SanityProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  const [selectedSize, setSelectedSize]     = useState(0)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [message, setMessage]               = useState('')
  const [deliveryDate, setDeliveryDate]     = useState('')
  const [added, setAdded]                   = useState(false)

  useEffect(() => {
    // Try slug first, then fall back to treating id as a numeric index (legacy links)
    async function load() {
      try {
        const bySlug = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]{
            _id, name, "slug": slug.current, occasion, price, tag,
            description, careInstructions, image, gallery, featured, inStock
          }`,
          { slug: id }
        )
        setProduct(bySlug ?? null)
      } catch {
        setProduct(null)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', opacity: 0.15, animation: 'breatheSymbol 2s ease-in-out infinite' }}>✿</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-soft)', fontStyle: 'italic' }}>
          This arrangement couldn't be found.
        </div>
        <Link href="/collections" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          borderBottom: '1px solid var(--color-accent)',
          paddingBottom: '2px',
        }}>
          View All Collections
        </Link>
      </div>
    )
  }

  const basePrice   = Math.round(product.price * sizes[selectedSize].multiplier)
  const addonTotal  = addons.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0)
  const total       = basePrice + addonTotal

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.gallery ?? []),
  ]

  const toggleAddon = (addonId: string) =>
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(a => a !== addonId) : [...prev, addonId])

  const handleAdd = () => {
    addItem({
      id: product._id as unknown as number,
      name: product.name,
      size: sizes[selectedSize].label,
      price: total,
      addons: selectedAddons,
      message,
      deliveryDate,
      color: 'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const mainImageUrl = allImages[activeImg]
    ? urlFor(allImages[activeImg]).width(900).height(1125).url()
    : null

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        padding: '120px 80px 0',
        display: 'flex', gap: '8px', alignItems: 'center',
        fontFamily: 'var(--font-body)', fontSize: '0.7rem',
        letterSpacing: '0.1em', color: 'var(--color-text-soft)',
      }}>
        <Link href="/" style={{ color: 'var(--color-text-soft)' }}>Home</Link>
        <span>/</span>
        <Link href="/collections" style={{ color: 'var(--color-text-soft)' }}>Collections</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </div>

      {/* Main */}
      <div style={{
        padding: '48px 80px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'start',
      }}>

        {/* Left — image */}
        <div style={{ position: 'sticky', top: '100px' }}>
          {/* Main image */}
          <div style={{
            aspectRatio: '4/5',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
            marginBottom: allImages.length > 1 ? '12px' : 0,
          }}>
            {mainImageUrl ? (
              <Image src={mainImageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="45vw" priority />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(145deg, #D4B8A0 0%, #C4A882 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12rem',
              }}>
                <span style={{ opacity: 0.15 }}>✿</span>
              </div>
            )}
            {product.tag && (
              <div style={{
                position: 'absolute', top: '20px', left: '20px',
                backgroundColor: 'var(--color-bg)',
                padding: '6px 14px',
                fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}>
                {product.tag}
              </div>
            )}
          </div>

          {/* Gallery thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allImages.map((img, i) => {
                const thumbUrl = urlFor(img).width(120).height(150).url()
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 90,
                      border: '2px solid',
                      borderColor: activeImg === i ? 'var(--color-heading)' : 'transparent',
                      padding: 0,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <Image src={thumbUrl} alt="" fill style={{ objectFit: 'cover' }} sizes="72px" />
                  </button>
                )
              })}
            </div>
          )}

          {/* Tags */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[product.occasion, 'Same Day Delivery'].map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '6px 14px',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-soft)',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              fontWeight: 300,
              color: 'var(--color-heading)',
              lineHeight: 1.1,
            }}>
              {product.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--color-accent)' }}>
              ${total}
            </div>
          </div>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'var(--color-text-soft)',
            fontWeight: 300,
            marginBottom: '40px',
            paddingBottom: '40px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {product.description}
          </p>

          {/* Size */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '12px' }}>
              Size
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {sizes.map((size, i) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(i)}
                  style={{
                    flex: 1, padding: '12px 8px',
                    border: '1px solid',
                    borderColor: selectedSize === i ? 'var(--color-heading)' : 'var(--color-border)',
                    backgroundColor: selectedSize === i ? 'var(--color-heading)' : 'transparent',
                    color: selectedSize === i ? 'var(--color-bg)' : 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {size.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', opacity: 0.6 }}>
                    {size.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '12px' }}>
              Add-ons
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {addons.map(addon => (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  style={{
                    flex: 1, padding: '12px 8px',
                    border: '1px solid',
                    borderColor: selectedAddons.includes(addon.id) ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: selectedAddons.includes(addon.id) ? 'var(--color-accent-light)' : 'transparent',
                    color: selectedAddons.includes(addon.id) ? 'var(--color-accent-dark)' : 'var(--color-text-soft)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.08em', marginBottom: '2px' }}>{addon.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', opacity: 0.7 }}>+${addon.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery date */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '12px' }}>
              Delivery Date
            </div>
            <input
              type="date"
              min={minDate}
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                color: 'var(--color-text)', outline: 'none', cursor: 'pointer',
              }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '12px',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Message Card</span>
              <span style={{ color: 'var(--color-text-soft)', textTransform: 'none', letterSpacing: 0 }}>{message.length}/120</span>
            </div>
            <textarea
              placeholder="Write a personal message…"
              maxLength={120}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '14px 16px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                color: 'var(--color-text)', outline: 'none', resize: 'none', lineHeight: 1.7,
              }}
            />
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            style={{
              width: '100%', padding: '18px',
              backgroundColor: added ? 'var(--color-accent)' : 'var(--color-heading)',
              color: 'var(--color-bg)', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'background-color 300ms ease',
              marginBottom: '16px',
            }}
          >
            {added ? '✓ Added to Bag' : `Add to Bag — $${total}`}
          </button>

          {/* Care instructions */}
          {product.careInstructions && (
            <div style={{
              marginTop: '32px',
              paddingTop: '32px',
              borderTop: '1px solid var(--color-border)',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-soft)', marginBottom: '10px' }}>
                Care Instructions
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--color-text-soft)', fontWeight: 300 }}>
                {product.careInstructions}
              </p>
            </div>
          )}

          {/* Reassurance */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '24px' }}>
            {['Same Day Delivery', 'Fresh Guarantee', 'Free Card Included'].map(item => (
              <div key={item} style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-text-soft)', textAlign: 'center',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
