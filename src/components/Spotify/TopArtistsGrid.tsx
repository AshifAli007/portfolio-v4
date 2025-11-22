"use client";

import { useState } from "react";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockTopArtists } from "@/lib/spotify/routes";
import { SpotifyArtist, SpotifyTimeRange } from "@/lib/spotify/types";

const ranges: { label: string; value: SpotifyTimeRange }[] = [
  { label: "Now", value: "short_term" },
  { label: "Season", value: "medium_term" },
  { label: "All time", value: "long_term" },
];

export default function TopArtistsGrid() {
  const [range, setRange] = useState<SpotifyTimeRange>("short_term");
  const { data, isLoading } = useSpotifyData<SpotifyArtist[]>(`/api/spotify/top-artists?time_range=${range}`);
  const artists = data ?? mockTopArtists();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Top Artists</h3>
        <div className="flex items-center gap-2" role="tablist" aria-label="Top artists range">
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.id} className="rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10">
            <div className="flex items-center gap-3">
              {artist.images?.[0]?.url ? (
                <img
                  src={artist.images[0].url}
                  alt={`Portrait of ${artist.name}`}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-slate-800" aria-hidden />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{artist.name}</p>
                <p className="text-xs text-slate-400">{artist.genres?.slice(0, 2).join(", ") ?? "Artist"}</p>
              </div>
            </div>
          </article>
        ))}
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      </div>
    </div>
  );
}
