'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { AddonId, SizeLabel } from './pricing'

export type CartItem = {
  productId: string
  name: string
  size: SizeLabel
  price: number // display only; the server recomputes it at checkout
  addons: AddonId[]
  message: string
  deliveryDate: string
  color: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, delta: number) => void
  clear: () => void
  quantities: number[]
  total: number
  count: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'jupeang-bag-v2'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Keep the bag across reloads and the round trip to Stripe. Loaded after
  // mount (not during render) so server and client HTML match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (Array.isArray(saved?.items) && Array.isArray(saved?.quantities)) {
        setItems(saved.items)
        setQuantities(saved.quantities)
      }
    } catch {}
    setLoaded(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, quantities }))
    } catch {}
  }, [items, quantities, loaded])

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item])
    setQuantities(prev => [...prev, 1])
    setIsOpen(true)
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
    setQuantities(prev => prev.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, delta: number) => {
    setQuantities(prev => prev.map((q, i) => {
      if (i !== index) return q
      const next = q + delta
      return Math.min(20, next < 1 ? 1 : next)
    }))
  }

  const clear = () => {
    setItems([])
    setQuantities([])
  }

  const total = items.reduce((sum, item, i) => sum + item.price * (quantities[i] || 1), 0)
  const count = quantities.reduce((sum, q) => sum + q, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clear,
      quantities, total, count, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
