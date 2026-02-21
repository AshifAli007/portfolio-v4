"use client";

import { useState } from "react";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockTopTracks } from "@/lib/spotify/routes";
import { SpotifyTrack, SpotifyTimeRange } from "@/lib/spotify/types";
import MoodBadge from "./MoodBadge";
import { formatDuration, moodFromFeatures } from "@/lib/spotify/derive";

const ranges: { label: string; value: SpotifyTimeRange }[] = [
  { label: "Now", value: "short_term" },
  { label: "Season", value: "medium_term" },
  { label: "All time", value: "long_term" },
];

export default function TopTracksGrid() {
  const [range, setRange] = useState<SpotifyTimeRange>("short_term");
  const { data, isLoading } = useSpotifyData<SpotifyTrack[]>(`/api/spotify/top-tracks?time_range=${range}`);
  const tracks = data ?? mockTopTracks();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Top Tracks</h3>
        <div className="flex items-center gap-2" role="tablist" aria-label="Top tracks range">
          {ranges.map((option) => (
            <button
              key={option.value}
              role="tab"
              aria-selected={range === option.value}
              onClick={() => setRange(option.value)}
              className={`rounded-full px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce] ${range === option.value ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {tracks.map((track) => (
          <article
            key={track.id}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10"
          >
            <img
              src={track.album.images?.[0]?.url ?? "/placeholder.png"}
              alt={`Album art for ${track.name}`}
              loading="lazy"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{track.name}</p>
              <p className="truncate text-xs text-slate-400">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
              <p className="text-xs text-slate-400">{formatDuration(track.duration_ms)}</p>
            </div>
            <MoodBadge mood={moodFromFeatures(0.6, 0.6)} />
          </article>
        ))}
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      </div>
    </div>
  );
}
