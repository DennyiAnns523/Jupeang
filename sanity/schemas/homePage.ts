import { defineArrayMember, defineField, defineType } from 'sanity'

// One plant in the "Flowers and vegetables" lists on the home page.
const plant = defineArrayMember({
  type: 'object',
  name: 'plant',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'note', title: 'Short note', type: 'string', description: 'One line, e.g. "The first to bud in spring."' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, description: 'Shown as a small round picture. Optional.' }),
  ],
  preview: { select: { title: 'name', subtitle: 'note', media: 'photo' } },
})

/**
 * The landing page. Every field is optional: anything left empty falls back
 * to the photos and words built into the site.
 */
export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of the page', default: true },
    { name: 'growing', title: 'Flowers & vegetables' },
    { name: 'harvest', title: 'Harvest photos' },
  ],
  fields: [
    defineField({
      name: 'heroPhoto',
      title: 'Big photo',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'caption', title: 'Handwritten caption', type: 'string' })],
    }),
    defineField({
      name: 'heroVideo',
      title: 'Video (plays silently on a loop)',
      type: 'file',
      group: 'hero',
      options: { accept: 'video/mp4,video/webm,video/quicktime' },
      description: 'Upright phone videos work best. Keep it short and under about 10 MB.',
      fields: [defineField({ name: 'caption', title: 'Handwritten caption', type: 'string' })],
    }),
    defineField({
      name: 'heroPrint',
      title: 'Small taped photo',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'flowers',
      title: 'In the flower pots',
      type: 'array',
      group: 'growing',
      description: 'Leave empty to keep the built-in list.',
      of: [plant],
    }),
    defineField({
      name: 'vegetables',
      title: 'In the vegetable beds',
      type: 'array',
      group: 'growing',
      description: 'Leave empty to keep the built-in list.',
      of: [plant],
    }),
    defineField({
      name: 'harvest',
      title: 'Harvest photos',
      type: 'array',
      group: 'harvest',
      description: 'Four photos look best. Leave empty to keep the built-in ones.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'caption', title: 'Handwritten caption', type: 'string' })],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})
