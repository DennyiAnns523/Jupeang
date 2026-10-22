import { client, queries, type SanityProduct } from '@/lib/sanity'
import CollectionsClient from './CollectionsClient'

// Re-check every minute so stock changes in the Studio show up quickly
export const revalidate = 60

async function getProducts(): Promise<SanityProduct[]> {
  if (!client) return []
  try {
    return await client.fetch(queries.allProducts)
  } catch {
    return []
  }
}

export default async function CollectionsPage() {
  const products = await getProducts()
  return <CollectionsClient products={products} />
}
