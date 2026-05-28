'use client'

import { useCart } from '@/lib/cartContext'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const router = useRouter()
  const { items, quantities, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(30,27,24,0.3)',
          zIndex: 60,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 400ms ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        backgroundColor: 'var(--color-bg)',
        zIndex: 70,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 400ms ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(30,27,24,0.1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '28px 32px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 400,
              color: 'var(--color-heading)',
            }}>
              Your Bag
            </h2>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--color-text-soft)',
              letterSpacing: '0.1em',
              marginTop: '2px',
            }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-soft)',
            }}
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '16px',
            }}>
              <div style={{ fontSize: '3rem', opacity: 0.2 }}>✿</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--color-text-soft)',
                fontStyle: 'italic',
              }}>
                Your bag is empty
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--color-accent)',
                  paddingBottom: '2px',
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '16px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  {/* Mini image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    opacity: 0.8,
                    flexShrink: 0,
                  }}>
                    <span style={{ opacity: 0.3 }}>✿</span>
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        color: 'var(--color-heading)',
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: 'var(--color-accent)',
                      }}>
                        ${item.price * quantities[i]}
                      </div>
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.7rem',
                      color: 'var(--color-text-soft)',
                      marginBottom: '2px',
                    }}>
                      {item.size} · {item.deliveryDate || 'No date selected'}
                    </div>

                    {item.addons.length > 0 && (
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.65rem',
                        color: 'var(--color-text-soft)',
                        marginBottom: '8px',
                      }}>
                        + {item.addons.join(', ')}
                      </div>
                    )}

                    {item.message && (
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        color: 'var(--color-text-soft)',
                        fontStyle: 'italic',
                        marginBottom: '8px',
                      }}>
                        "{item.message}"
                      </div>
                    )}

                    {/* Quantity + Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                      }}>
                        <button
                          onClick={() => updateQuantity(i, -1)}
                          style={{
                            width: '28px', height: '28px',
                            background: 'none', border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text)',
                            fontSize: '1rem',
                          }}
                        >−</button>
                        <span style={{
                          width: '28px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          color: 'var(--color-text)',
                        }}>
                          {quantities[i]}
                        </span>
                        <button
                          onClick={() => updateQuantity(i, 1)}
                          style={{
                            width: '28px', height: '28px',
                            background: 'none', border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text)',
                            fontSize: '1rem',
                          }}
                        >+</button>
                      </div>

                      <button
                        onClick={() => removeItem(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-soft)',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '24px 32px',
            borderTop: '1px solid var(--color-border)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
              }}>
                Total
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                color: 'var(--color-heading)',
              }}>
                ${total}
              </span>
            </div>

            <button
                onClick={() => { router.push('/checkout'); setIsOpen(false) }}
                style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'var(--color-heading)',
                    color: 'var(--color-bg)',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginBottom: '10px',
                }}
                >
                Proceed to Checkout
                </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-soft)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}