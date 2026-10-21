import HomeExperience from "@/components/garden/HomeExperience";

// Re-render daily so "today on the terrace" and the season stay current.
export const revalidate = 86400;

export default function Home() {
  return <HomeExperience />;
}
