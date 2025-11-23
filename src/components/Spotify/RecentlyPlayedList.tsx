"use client";

import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockRecentlyPlayed } from "@/lib/spotify/routes";
import { formatDuration } from "@/lib/spotify/derive";

type SpotifyArtist = { id: string; name: string };
type SpotifyImage = { url: string; height?: number; width?: number };
type SpotifyAlbum = { id?: string; name?: string; images?: SpotifyImage[] };
type SpotifyTrack = {
  id?: string;
  name?: string;
  duration_ms?: number;
  album?: SpotifyAlbum;
  artists?: SpotifyArtist[];
};

export default function RecentlyPlayedList() {
  const { data, isLoading } = useSpotifyData<{ items: { track: SpotifyTrack; played_at: string }[] }>(
    "/api/spotify/recently-played",
  );
  const items = data?.items ?? mockRecentlyPlayed.items;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recently Played</h3>
        {isLoading && <span className="text-xs text-slate-400">Refreshing...</span>}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map(({ track, played_at }) => (
          <li
            key={`${track?.id ?? played_at}-${played_at}`}
            className="flex items-center gap-3 rounded-xl border border-white/5 p-3"
          >
            <img
              src={track?.album?.images?.[0]?.url ?? "/placeholder.png"}
              alt={`Album art for ${track?.name ?? "Unknown track"}`}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{track?.name ?? "Unknown track"}</p>
              <p className="truncate text-xs text-slate-400">
                {track?.artists?.map((a: SpotifyArtist) => a.name).join(", ") ?? "Unknown artist"}
              </p>
              <p className="text-xs text-slate-500">{new Date(played_at).toLocaleString()}</p>
            </div>
            <p className="text-xs text-slate-400">{formatDuration(track?.duration_ms ?? 0)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
