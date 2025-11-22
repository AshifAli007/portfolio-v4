"use client";

import AudioFeatureRadar from "./AudioFeatureRadar";
import MoodBadge from "./MoodBadge";
import NowPlayingCard from "./NowPlayingCard";
import PlaylistSpotlight from "./PlaylistSpotlight";
import { mockAudioFeaturesList } from "@/lib/spotify/routes";
import { aggregateAudioFeatures, moodFromFeatures } from "@/lib/spotify/derive";
import { mockTracks } from "@/data/spotify-mock";

export default function SpotifyOverview() {
  const features = mockAudioFeaturesList();
  const aggregate = aggregateAudioFeatures(features);
  const mood = moodFromFeatures(aggregate.valence, aggregate.energy);

  return (
    <section aria-label="Spotify overview" className="mt-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#89d3ce]">Music</p>
            <h2 className="text-2xl font-bold text-white">What I&apos;m Listening To</h2>
            <p className="text-slate-300">Live snapshot of my current soundtrack and mood.</p>
          </div>
          <MoodBadge mood={mood} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <NowPlayingCard />
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-white">Current favorites</h3>
            <ul className="space-y-3">
              {mockTracks.slice(0, 5).map((track) => (
                <li key={track.id} className="flex items-center gap-3">
                  <img
                    src={track.album.images?.[0]?.url ?? "/placeholder.png"}
                    alt={`Album art for ${track.name}`}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{track.name}</p>
                    <p className="truncate text-xs text-slate-400">{track.artists.map((a) => a.name).join(", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <PlaylistSpotlight />
          <AudioFeatureRadar features={features} />
        </div>
      </div>
    </section>
  );
}
