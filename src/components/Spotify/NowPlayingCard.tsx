"use client";

import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockNowPlaying } from "@/data/spotify-mock";
import { SpotifyNowPlaying, SpotifyTrack } from "@/lib/spotify/types";
import { formatDuration } from "@/lib/spotify/derive";

function formatAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / (60 * 60000));
  const days = Math.floor(diffMs / (24 * 60 * 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function NowPlayingCard() {
  const { data, isLoading } = useSpotifyData<SpotifyNowPlaying>("/api/spotify/now-playing", {
    refreshInterval: 20_000,
  });
  const { data: recent } = useSpotifyData<{ items: { track: SpotifyTrack; played_at: string }[] }>(
    "/api/spotify/recently-played",
  );
  const [lastPlayed, setLastPlayed] = useState<SpotifyNowPlaying | null>(null);
  const [lastPlayedAt, setLastPlayedAt] = useState<number | null>(null);

  // Restore the last successful "now playing" from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("portfolio:lastNowPlaying");
    const storedAt = localStorage.getItem("portfolio:lastNowPlayingAt");
    if (stored) {
      try {
        setLastPlayed(JSON.parse(stored) as SpotifyNowPlaying);
        if (storedAt) {
          const parsedAt = Number(storedAt);
          if (!Number.isNaN(parsedAt)) {
            setLastPlayedAt(parsedAt);
          }
        }
      } catch {
        /* ignore parse errors */
      }
    }
  }, []);

  // Persist the latest live track so we can show it when playback stops
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (data?.is_playing && data.item) {
      setLastPlayed(data);
      setLastPlayedAt(Date.now());
      localStorage.setItem("portfolio:lastNowPlaying", JSON.stringify(data));
      localStorage.setItem("portfolio:lastNowPlayingAt", String(Date.now()));
    }
  }, [data]);

  const liveNowPlaying = data?.is_playing && data.item ? data : null;
  const recentFallbackTrack = recent?.items?.[0]?.track;
  const recentNowPlaying: SpotifyNowPlaying | null = recentFallbackTrack
    ? { is_playing: false, item: recentFallbackTrack }
    : null;
  const effectiveNowPlaying = liveNowPlaying ?? lastPlayed ?? recentNowPlaying ?? data ?? mockNowPlaying;
  const nowPlaying = effectiveNowPlaying;
  const isLive = Boolean(liveNowPlaying);
  const item = effectiveNowPlaying.item ?? mockNowPlaying.item;

  const playedAgoMs = lastPlayedAt ? Date.now() - lastPlayedAt : null;
  const lessThanTenMinutes = playedAgoMs !== null ? playedAgoMs < 1 * 60 * 1000 : false;
  const playedLabel =
    isLive || lessThanTenMinutes
      ? "Recently played"
      : lastPlayedAt
        ? `Last played ${formatAgo(lastPlayedAt)}`
        : "Recently played";

  const progressPercent = useMemo(() => {
    if (!nowPlaying.progress_ms || !item) return 0;
    return Math.min(100, (nowPlaying.progress_ms / item.duration_ms) * 100);
  }, [item, nowPlaying.progress_ms]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--spotify-progress", `${progressPercent}%`);
  }, [progressPercent]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0f17]/80 p-3 sm:p-4" aria-live="polite">
      <div className="flex items-start gap-3">
        {item?.album?.images?.[0]?.url ? (
          <img
            src={item.album.images[0].url}
            alt={`Album art for ${item.name}`}
            className="h-14 w-14 flex-shrink-0 rounded-xl object-cover sm:h-16 sm:w-16"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-slate-800" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-300 sm:text-sm">{isLive ? "Now playing" : playedLabel}</p>
          <h3 className="truncate text-base font-semibold text-white sm:text-lg">{item?.name ?? "Unknown track"}</h3>
          <p className="truncate text-slate-400 text-xs sm:text-sm">
            {item?.artists?.map((artist) => artist.name).join(", ") ?? "Unknown artist"}
          </p>
        </div>
        {item?.external_urls?.spotify ? (
          <a
            href={item.external_urls.spotify}
            aria-label="Open in Spotify"
            target="_blank"
            rel="noreferrer"
            className="ml-0 text-[#1DB954] transition hover:text-[#89d3ce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce] sm:ml-auto"
            onClick={() =>
              fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  event: "spotify_click",
                  target: item?.name ?? "now_playing",
                  meta: { artists: item?.artists?.map((a) => a.name).join(", ") },
                }),
                keepalive: true,
              }).catch(() => {})
            }
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
