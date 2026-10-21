import type { Metadata } from 'next'
import './globals.css'
import './design.css'
import './portal.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import { CartProvider } from '@/lib/cartContext'

export const metadata: Metadata = {
  title: 'Jupeang — Objects, stories & growing things',
  description: 'A shop, a story, a collection of moments. Discover the world of Jupeang.',
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
