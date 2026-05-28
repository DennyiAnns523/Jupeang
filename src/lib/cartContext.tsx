'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type CartItem = {
  id: number
  name: string
  size: string
  price: number
  addons: string[]
  message: string
  deliveryDate: string
  color: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, delta: number) => void
  quantities: number[]
  total: number
  count: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

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
      return next < 1 ? 1 : next
    }))
  }

  const total = items.reduce((sum, item, i) => sum + item.price * (quantities[i] || 1), 0)
  const count = quantities.reduce((sum, q) => sum + q, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity,
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