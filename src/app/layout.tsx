import type { Metadata } from 'next'
import './globals.css'
import './design.css'
import './portal.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import VisitTracker from '@/components/layout/VisitTracker'
import { CartProvider } from '@/lib/cartContext'

export const metadata: Metadata = {
  title: 'Üli — From a seed, life begins.',
  description: 'Flowers, vegetables and homegrown things from the rooftop garden of Pauwau Konyak.',
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
          <VisitTracker />
        </CartProvider>
      </body>
    </html>
  )
}
