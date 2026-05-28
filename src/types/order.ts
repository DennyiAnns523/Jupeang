export type OrderItem = {
  name: string
  size: string
  price: number
  quantity: number
  addons: string[]
  message: string
  deliveryDate: string
}

export type OrderPayload = {
  orderRef: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  postcode: string
  notes: string
  items: OrderItem[]
  total: number
}
