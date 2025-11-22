import AudioFeatureRadar from "@/components/Spotify/AudioFeatureRadar";
import NowPlayingCard from "@/components/Spotify/NowPlayingCard";
import PlaylistSpotlight from "@/components/Spotify/PlaylistSpotlight";
import RecentlyPlayedList from "@/components/Spotify/RecentlyPlayedList";
import TopArtistsGrid from "@/components/Spotify/TopArtistsGrid";
import TopTracksGrid from "@/components/Spotify/TopTracksGrid";
import { mockAudioFeaturesList } from "@/lib/spotify/routes";

export const metadata = {
  title: "My Music • Portfolio",
  description: "Spotify insights, top tracks, playlists, and listening mood.",
};

export default function MusicPage() {
  const mockFeatures = mockAudioFeaturesList();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-white">What I&apos;m listening to</h1>
        <p className="text-slate-300">Live view of my current soundtrack, refreshed regularly.</p>
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <NowPlayingCard />
          <AudioFeatureRadar features={mockFeatures} />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <TopTracksGrid />
        <TopArtistsGrid />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <PlaylistSpotlight />
        <RecentlyPlayedList />
      </section>
    </main>
  );
}
