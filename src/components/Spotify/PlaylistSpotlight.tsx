"use client";

import { useSpotifyData } from "@/hooks/useSpotifyData";
import { mockPlaylistList } from "@/lib/spotify/routes";
import { dominantColorFromImage } from "@/lib/spotify/derive";
import { SpotifyPlaylist } from "@/lib/spotify/types";

interface PlaylistSpotlightProps {
  playlistIds?: string[];
}

export default function PlaylistSpotlight({ playlistIds }: PlaylistSpotlightProps) {
  const query = playlistIds?.length ? `?id=${playlistIds[0]}` : "";
  const { data } = useSpotifyData<SpotifyPlaylist | SpotifyPlaylist[]>(`/api/spotify/playlist${query}`);

  const playlists = Array.isArray(data) ? data : data ? [data] : mockPlaylistList();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white">Playlist Spotlight</h3>
        <span className="self-start rounded-full bg-white/5 px-2 py-1 text-xs text-[#1DB954] sm:self-auto">Spotify</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {playlists.map((playlist) => {
          const cover = playlist.images?.[0]?.url ?? "/placeholder.png";
          const stripe = dominantColorFromImage(cover);
          return (
            <article key={playlist.id} className="rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10">
              <div className="flex gap-3">
                <img src={cover} alt={`Cover of ${playlist.name}`} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{playlist.name}</p>
                  <p className="text-xs text-slate-400">{playlist.description ?? "Curated vibes"}</p>
                  <p className="text-xs text-slate-500">{playlist.tracks?.total ?? 0} tracks</p>
                </div>
              </div>
              <div className="mt-3 h-1 rounded-full" style={{ background: stripe }} aria-hidden />
            </article>
          );
        })}
      </div>
    </div>
  );
}
