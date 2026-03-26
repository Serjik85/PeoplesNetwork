import { HomeLanding } from "@/components/home-landing";
import { getProjects, getPublicStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, projects] = await Promise.all([getPublicStats(), getProjects()]);
  return <HomeLanding stats={stats} projects={projects} />;
}

