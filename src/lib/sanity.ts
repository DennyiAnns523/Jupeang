import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'

export { client, urlFor }

// ── GROQ field projections ────────────────────────────────────────

const PRODUCT_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  occasion,
  price,
  tag,
  description,
  careInstructions,
  image,
  gallery,
  featured,
  inStock
`

const GARDEN_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  date,
  excerpt,
  heroImage,
  tags
`

// ── Queries ──────────────────────────────────────────────────────

export const queries = {
  // Shop
  featuredProducts: `
    *[_type == "product" && featured == true && inStock == true] | order(_createdAt asc) {
      ${PRODUCT_FIELDS}
    }
  `,
  allProducts: `
    *[_type == "product" && inStock == true] | order(_createdAt asc) {
      ${PRODUCT_FIELDS}
    }
  `,
  productBySlug: `
    *[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }
  `,

  // Garden
  allGardenPosts: `
    *[_type == "gardenPost"] | order(date desc) { ${GARDEN_CARD_FIELDS} }
  `,
  latestGardenPosts: `
    *[_type == "gardenPost"] | order(date desc)[0...3] { ${GARDEN_CARD_FIELDS} }
  `,
  gardenPostBySlug: `
    *[_type == "gardenPost" && slug.current == $slug][0] {
      ${GARDEN_CARD_FIELDS},
      body
    }
  `,
}

// ── TypeScript shapes ────────────────────────────────────────────

export type SanityProduct = {
  _id: string
  name: string
  slug: string
  occasion: string
  price: number
  tag: string
  description: string
  careInstructions?: string
  image?: { asset: { _ref: string }; hotspot?: object }
  gallery?: Array<{ asset: { _ref: string } }>
  featured: boolean
  inStock: boolean
}

export type SanityGardenPost = {
  _id: string
  title: string
  slug: string
  date: string
  excerpt?: string
  heroImage?: { asset: { _ref: string }; hotspot?: object }
  tags?: string[]
  body?: Array<{ _type: string; [key: string]: unknown }>
}
