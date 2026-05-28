import Hero from '@/components/sections/Hero'
import FeaturedCollections from '@/components/sections/FeaturedCollections'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import GardenTeaser from '@/components/sections/GardenTeaser'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <HowItWorks />
      <GardenTeaser />
      <Testimonials />
    </main>
  )
}