"use client";

import { useEffect, useMemo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockNowPlaying } from "@/data/spotify-mock";
import { SpotifyNowPlaying } from "@/lib/spotify/types";
import { formatDuration } from "@/lib/spotify/derive";

export default function NowPlayingCard() {
  const { data, isLoading } = useSpotifyData<SpotifyNowPlaying>("/api/spotify/now-playing", {
    refreshInterval: 20_000,
  });

  const nowPlaying = data ?? mockNowPlaying;
  const isLive = nowPlaying.is_playing && nowPlaying.item;
  const item = nowPlaying.item ?? mockNowPlaying.item;

  const progressPercent = useMemo(() => {
    if (!nowPlaying.progress_ms || !item) return 0;
    return Math.min(100, (nowPlaying.progress_ms / item.duration_ms) * 100);
  }, [item, nowPlaying.progress_ms]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--spotify-progress", `${progressPercent}%`);
  }, [progressPercent]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/[0.06]" aria-live="polite">
      <div className="flex items-center gap-3">
        {item?.album?.images?.[0]?.url ? (
          <img
            src={item.album.images[0].url}
            alt={`Album art for ${item.name}`}
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-slate-800" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="text-sm text-slate-300">{isLive ? "Now playing" : "Recently played"}</p>
          <h3 className="truncate text-lg font-semibold text-white">{item?.name ?? "Unknown track"}</h3>
          <p className="truncate text-slate-400 text-sm">
            {item?.artists?.map((artist) => artist.name).join(", ") ?? "Unknown artist"}
          </p>
        </div>
        {item?.external_urls?.spotify ? (
          <a
            href={item.external_urls.spotify}
            aria-label="Open in Spotify"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[#1DB954] transition hover:text-[#89d3ce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce]"
          >
            <FaExternalLinkAlt />
          </a>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{formatDuration(nowPlaying.progress_ms ?? 0)}</span>
          <span>{formatDuration(item?.duration_ms ?? 0)}</span>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#89d3ce]"
            style={{ width: `${progressPercent}%`, transition: isLoading ? "none" : "width 0.5s ease" }}
          />
        </div>
      </div>
    </div>
  );
}
