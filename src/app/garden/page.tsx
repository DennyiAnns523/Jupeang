import { client, queries, type SanityGardenPost } from '@/lib/sanity'
import GardenClient from './GardenClient'

async function getPosts(): Promise<SanityGardenPost[]> {
  try {
    return await client.fetch(queries.allGardenPosts)
  } catch {
    return []
  }
}

export default async function GardenPage() {
  const posts = await getPosts()
  return <GardenClient posts={posts} />
}
