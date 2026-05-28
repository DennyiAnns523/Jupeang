import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null

type ImageBuilder = ReturnType<typeof createImageUrlBuilder>

export const urlFor = (source: SanityImageSource) => {
  if (!builder) return { url: () => '' } as ReturnType<ImageBuilder['image']>
  return builder.image(source)
}
