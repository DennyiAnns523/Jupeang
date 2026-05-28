import { client, queries, type SanityProduct } from '@/lib/sanity'
import CollectionsClient from './CollectionsClient'

async function getProducts(): Promise<SanityProduct[]> {
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
