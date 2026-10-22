import Album from "@/components/garden/Album";
import { getAlbumContent } from "@/lib/siteContent";

// Re-check every minute so photos added in the Studio show up quickly.
export const revalidate = 60;

export default async function AlbumPage() {
  return <Album {...await getAlbumContent()} />;
}
