import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

export type CatalogProduct = { _id: string; name: string; price: number; inStock: boolean }

// Uncached reads: prices used for charging must never come from a stale CDN copy
const catalog = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null

export async function getProductsByIds(ids: string[]): Promise<Map<string, CatalogProduct>> {
  if (!catalog) throw new Error('Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID)')
  const products = await catalog.fetch<CatalogProduct[]>(
    `*[_type == "product" && _id in $ids]{ _id, name, price, inStock }`,
    { ids },
  )
  return new Map(products.map(p => [p._id, p]))
}
