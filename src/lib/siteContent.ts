import 'server-only'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client, urlFor } from './sanity'

// The home page and album can be edited in the Studio ("Home page" and
// "Album"). Anything left empty there falls back to these built-in defaults,
// so the site never shows a blank space.

export type Photo = { src: string; alt: string; caption?: string }
export type Plant = { name: string; note?: string; photo?: string; colour?: string }
export type AlbumPhoto = Photo & { caption: string; category: string }

export type HomeContent = {
  heroPhoto: Photo
  heroVideo: { src: string; poster?: string; caption?: string }
  heroPrint: Photo
  flowers: Plant[]
  vegetables: Plant[]
  harvest: Photo[]
}

export type AlbumContent = { photos: AlbumPhoto[]; film: string }

const DEFAULT_HOME: HomeContent = {
  heroPhoto: {
    src: '/images/harvest-radish-sunset.jpg',
    alt: 'Pauwau holding up a bunch of freshly pulled radishes on the terrace at sunset',
    caption: 'Radishes, pulled at sunset',
  },
  heroVideo: { src: '/images/dahlias.mp4', poster: '/images/dahlias-poster.jpg', caption: 'Dahlias, swaying' },
  heroPrint: { src: '/images/harvest-tomatoes.jpg', alt: 'A basket of ripe tomatoes' },
  flowers: [
    { name: 'Rose', note: 'The first to bud in spring.', photo: '/images/rose-cream.jpg' },
    { name: 'Chrysanthemum', note: 'Every pot on the roof, come November.', colour: '#d9a92c' },
    { name: 'Hydrangea', note: 'Heavy heads, happiest in the monsoon.', photo: '/images/hydrangea.jpg' },
    { name: 'Petunia', note: 'Spilling over the edges of the pots.', photo: '/images/petunia.jpg' },
    { name: 'Dahlia', note: 'Big, bold and worth the wait.', photo: '/images/dahlias-poster.jpg' },
  ],
  vegetables: [
    { name: 'Radish', note: 'Long and white, pulled with the soil still on.', colour: '#ece6d6' },
    { name: 'Tomato', note: 'Climbing the railing, red and green.', photo: '/images/tomato-vines.jpg' },
    { name: 'Carrot', note: 'Crooked, sweet, never the same twice.', photo: '/images/harvest-carrots.jpg' },
    { name: 'Lettuce', note: 'Soft heads for the salad bowl.', colour: '#a9cf6a' },
    { name: 'Coriander', note: 'A handful goes in everything.', colour: '#4f8a3c' },
    { name: 'King chilli', note: 'Small, wrinkled. Handle with care.', photo: '/images/king-chilli.jpg' },
  ],
  harvest: [
    { src: '/images/harvest-basket.jpg', alt: 'A basket of radishes, tomatoes, lettuce and coriander held over pink flowers', caption: 'Everything, all at once' },
    { src: '/images/harvest-carrots.jpg', alt: 'A hand holding freshly pulled carrots above pots of pink flowers', caption: 'Carrots, just pulled' },
    { src: '/images/harvest-tomatoes.jpg', alt: 'A wicker basket full of ripe tomatoes beneath the tomato plants', caption: 'A basket of tomatoes' },
    { src: '/images/king-chilli.jpg', alt: 'Green king chillies hanging on the plant', caption: 'King chillies, still green' },
  ],
}

const DEFAULT_ALBUM: AlbumContent = {
  photos: [
    { src: '/images/IMG-20251127-WA0049.jpg', caption: 'A place to pause', category: 'The terrace' },
    { src: '/images/terrace-sky.jpg', caption: 'The sky over the terrace', category: 'The terrace' },
    { src: '/images/IMG-20251209-WA0015.jpg', caption: 'Every shade of pink', category: 'The little details' },
    { src: '/images/roses-white.jpg', caption: 'White roses on the terrace', category: 'The little details' },
    { src: '/images/IMG-20251109-WA0019.jpg', caption: 'The hands behind it', category: 'Our people' },
    { src: '/images/IMG-20250617-WA0015.jpg', caption: 'Something worth holding', category: 'Our people' },
    { src: '/images/tomato-vines.jpg', caption: 'Tomatoes climbing the railing', category: 'The harvest' },
    { src: '/images/harvest-basket.jpg', caption: 'A morning in a basket', category: 'The harvest' },
    { src: '/images/IMG-20251127-WA0053.jpg', caption: 'Stay a little longer', category: 'The terrace' },
  ].map((p) => ({ ...p, alt: p.caption })),
  film: '/images/VID-20251217-WA0007.mp4',
}

type SanityImage = SanityImageSource & { asset?: unknown; caption?: string; category?: string }
type SanityPlant = { name?: string; note?: string; photo?: SanityImage }

const img = (image: SanityImage, width: number) =>
  urlFor(image).width(width).fit('max').auto('format').url()

const hasImage = (image?: SanityImage | null): image is SanityImage => Boolean(image?.asset)

async function fetchDoc<T>(query: string): Promise<T | null> {
  if (!client) return null
  try {
    return await client.fetch<T | null>(query)
  } catch (err) {
    console.error('Could not load content from Sanity:', err)
    return null
  }
}

function plants(list: SanityPlant[] | undefined, fallback: Plant[]): Plant[] {
  const named = (list ?? []).filter((p) => p.name)
  if (!named.length) return fallback
  return named.map((p) => ({
    name: p.name!,
    note: p.note,
    photo: hasImage(p.photo) ? img(p.photo, 240) : undefined,
    colour: '#9fb88a',
  }))
}

export async function getHomeContent(): Promise<HomeContent> {
  const doc = await fetchDoc<{
    heroPhoto?: SanityImage
    heroVideoUrl?: string
    heroVideoCaption?: string
    heroPrint?: SanityImage
    flowers?: SanityPlant[]
    vegetables?: SanityPlant[]
    harvest?: SanityImage[]
  }>(`*[_id == "homePage"][0]{
    heroPhoto, "heroVideoUrl": heroVideo.asset->url, "heroVideoCaption": heroVideo.caption,
    heroPrint, flowers, vegetables, harvest
  }`)
  if (!doc) return DEFAULT_HOME

  const d = DEFAULT_HOME
  const harvest = (doc.harvest ?? []).filter(hasImage)
  return {
    heroPhoto: hasImage(doc.heroPhoto)
      ? { src: img(doc.heroPhoto, 1200), alt: doc.heroPhoto.caption ?? 'The rooftop garden', caption: doc.heroPhoto.caption }
      : d.heroPhoto,
    heroVideo: doc.heroVideoUrl
      // a new video gets no poster: the first frame shows as soon as it loads
      ? { src: doc.heroVideoUrl, caption: doc.heroVideoCaption }
      : d.heroVideo,
    heroPrint: hasImage(doc.heroPrint) ? { src: img(doc.heroPrint, 600), alt: 'From the garden' } : d.heroPrint,
    flowers: plants(doc.flowers, d.flowers),
    vegetables: plants(doc.vegetables, d.vegetables),
    harvest: harvest.length
      ? harvest.map((h) => ({ src: img(h, 900), alt: h.caption ?? 'From the harvest', caption: h.caption }))
      : d.harvest,
  }
}

export async function getAlbumContent(): Promise<AlbumContent> {
  const doc = await fetchDoc<{ photos?: SanityImage[]; filmUrl?: string }>(
    `*[_id == "album"][0]{ photos, "filmUrl": film.asset->url }`,
  )
  const photos = (doc?.photos ?? []).filter(hasImage)
  return {
    photos: photos.length
      ? photos.map((p) => ({
          src: img(p, 2000),
          alt: p.caption ?? 'From the garden',
          caption: p.caption ?? '',
          category: p.category ?? 'The terrace',
        }))
      : DEFAULT_ALBUM.photos,
    film: doc?.filmUrl ?? DEFAULT_ALBUM.film,
  }
}
