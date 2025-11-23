"use client";

import AudioFeatureRadar from "./AudioFeatureRadar";
import MoodBadge from "./MoodBadge";
import NowPlayingCard from "./NowPlayingCard";
import PlaylistSpotlight from "./PlaylistSpotlight";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockAudioFeatures, mockAudioFeaturesList, mockTopTracks } from "@/lib/spotify/routes";
import { aggregateAudioFeatures, moodFromFeatures } from "@/lib/spotify/derive";
import { SpotifyAudioFeatures, SpotifyNowPlaying, SpotifyTrack } from "@/lib/spotify/types";

export default function SpotifyOverview() {
  const { data: topTracks, isLoading: isLoadingTopTracks } = useSpotifyData<SpotifyTrack[]>(
    "/api/spotify/top-tracks?time_range=short_term&limit=5",
    { refreshInterval: 60_000 },
  );
  const { data: nowPlaying } = useSpotifyData<SpotifyNowPlaying>("/api/spotify/now-playing", {
    refreshInterval: 10_000,
  });
  const trackId = nowPlaying?.item?.id;
  const audioFeaturesEndpoint = trackId
    ? `/api/spotify/audio-features/${trackId}`
    : "/api/spotify/audio-features?current=true";
  const { data: audioFeatureData, isLoading: isLoadingAudio } = useSpotifyData<
    SpotifyAudioFeatures | SpotifyAudioFeatures[]
  >(audioFeaturesEndpoint, { refreshInterval: 10_000 });

  const featuresList = Array.isArray(audioFeatureData)
    ? audioFeatureData
    : audioFeatureData
      ? [audioFeatureData]
      : mockAudioFeaturesList();

  const safeFeatures = featuresList.length ? featuresList : [mockAudioFeatures()];

  const aggregate = aggregateAudioFeatures(safeFeatures);
  const mood = moodFromFeatures(aggregate.valence, aggregate.energy);
  const tracks = (topTracks ?? mockTopTracks()).slice(0, 5);

  return (
    <section aria-label="Spotify overview" className="mt-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-xl backdrop-blur sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#89d3ce]">Music</p>
            <h2 className="text-xl font-bold text-[#1DB954] sm:text-2xl">What I&apos;m Listening To</h2>
            <p className="text-sm text-slate-300 sm:text-base">Live snapshot of my current soundtrack and mood.</p>
          </div>
          <MoodBadge mood={mood} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <NowPlayingCard />
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0c0f17]/80 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold text-white sm:text-lg">Current favorites</h3>
              {isLoadingTopTracks && <span className="text-xs text-slate-400">Refreshing...</span>}
            </div>
            <ul className="space-y-3">
              {tracks.map((track) => (
                <li key={track.id} className="flex items-center gap-3">
                  <img
                    src={track.album.images?.[0]?.url ?? "/placeholder.png"}
                    alt={`Album art for ${track.name}`}
                    className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white sm:text-base">{track.name}</p>
                    <p className="truncate text-xs text-slate-400 sm:text-sm">
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <PlaylistSpotlight />
          <div className="relative">
            {isLoadingAudio && (
              <span className="absolute right-4 top-3 text-xs text-slate-400" aria-live="polite">
                Refreshing…
              </span>
            )}
            <AudioFeatureRadar features={safeFeatures} />
          </div>
        </div>
      </div>
    </section>
  );
}
