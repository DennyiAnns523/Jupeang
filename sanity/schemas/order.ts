import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', title: 'Product', type: 'string' },
            { name: 'size', title: 'Size', type: 'string' },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'price', title: 'Price', type: 'number' },
            { name: 'message', title: 'Card Message', type: 'string' },
            { name: 'deliveryDate', title: 'Delivery Date', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Delivery Address',
      type: 'object',
      fields: [
        { name: 'address', title: 'Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'postcode', title: 'Postcode', type: 'string' },
      ],
    }),
    defineField({
      name: 'total',
      title: 'Total ($)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Preparing', value: 'preparing' },
          { title: 'Dispatched', value: 'dispatched' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'customerName',
    },
  },
})