import Footer from "@/components/Layouts/Footer";
import Navbar from "@/components/Navbar";
import SportsDashboard from "@/components/Sports/SportsDashboard";

export const metadata = {
  title: "Sports | Ashif Mohammad",
  description:
    "Strava-powered sports dashboard highlighting recent activities, performance trends, goals, community, and gear.",
};

export default function SportsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto mt-32 w-full max-w-6xl space-y-12 px-4 pb-24 md:px-6">
        <SportsDashboard />
      </main>
      <Footer />
    </>
  );
}
