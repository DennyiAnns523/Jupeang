import { defineArrayMember, defineField, defineType } from 'sanity'

export const ALBUM_CATEGORIES = ['The terrace', 'The little details', 'Our people', 'The harvest']

/**
 * The photo album. If no photos are added here, the album shows the
 * photographs built into the site.
 */
export default defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description: 'Drag to reorder. Remove a photo with the ⋯ menu beside it.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'caption', title: 'Caption', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: { list: ALBUM_CATEGORIES },
              initialValue: 'The terrace',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'film',
      title: 'Garden film',
      type: 'file',
      options: { accept: 'video/mp4,video/webm,video/quicktime' },
      description: 'Plays when someone clicks "Play a garden moment".',
    }),
  ],
  preview: { prepare: () => ({ title: 'Album' }) },
})
