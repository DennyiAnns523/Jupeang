import { NextResponse } from 'next/server'
import { deliveryWindow } from '@/lib/delivery'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(deliveryWindow())
}
