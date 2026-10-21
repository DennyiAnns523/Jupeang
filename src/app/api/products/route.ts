import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const revalidate = 300

export async function GET() {
  if (!client) return NextResponse.json({ products: [] })
  const products = await client.fetch(queries.allProducts)
  return NextResponse.json({ products })
}
