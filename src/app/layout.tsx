import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import { CartProvider } from '@/lib/cartContext'

export const metadata: Metadata = {
  title: 'Jupeang',
  description: 'Jupeang — Konyak for Flower. Thoughtfully arranged, same-day delivered.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}