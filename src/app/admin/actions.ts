'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { OrderStatus } from '@/generated/prisma/enums'

const statusUpdate = z.object({
  orderId: z.string().min(1).max(40),
  status: z.enum(OrderStatus),
})

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin()
  const parsed = statusUpdate.safeParse({ orderId: formData.get('orderId'), status: formData.get('status') })
  if (!parsed.success) return

  await db.order.update({ where: { id: parsed.data.orderId }, data: { status: parsed.data.status } })
  revalidatePath('/admin', 'layout')
}
