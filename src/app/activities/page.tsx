import Navbar from "@/components/Navbar";
import { ActivitiesList } from "@/components/Sports/ActivitiesList";
import { getStravaActivities } from "@/lib/strava/aggregator";

export const metadata = {
  title: "Activities • Strava",
  description: "All Strava activities with filtering by sport type.",
};

export default async function ActivitiesPage() {
  const activities = await getStravaActivities().catch(() => []);
  
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 pt-30 md:px-6">
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#FC4C02]">Strava</p>
            <h1 className="text-3xl font-bold text-white">Activities</h1>
            <p className="text-slate-300">Browse all activities and filter by sport type.</p>
          </div>
          <ActivitiesList activities={activities} />
        </section>
      </main>
    </>
  );
}
