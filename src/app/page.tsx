import HomeExperience from "@/components/garden/HomeExperience";
import { getHomeContent } from "@/lib/siteContent";

// Re-check every minute, so edits in the Studio show up quickly and
// "today on the terrace" stays current.
export const revalidate = 60;

export default async function Home() {
  return <HomeExperience content={await getHomeContent()} />;
}
