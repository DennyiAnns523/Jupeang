import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'occasion',
      title: 'Occasion',
      type: 'string',
      options: {
        list: [
          { title: 'Romance', value: 'Romance' },
          { title: 'Everyday', value: 'Everyday' },
          { title: 'Weddings', value: 'Weddings' },
          { title: 'Celebrations', value: 'Celebrations' },
          { title: 'Sympathy', value: 'Sympathy' },
          { title: 'Birthdays', value: 'Birthdays' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Base Price ($)',
      type: 'number',
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          'Bestseller', 'New', 'Premium',
          'Seasonal', 'Popular', 'Calming',
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Additional photos shown on the product page',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      rows: 3,
      description: 'How to keep these flowers fresh',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'occasion',
      media: 'image',
    },
  },
})