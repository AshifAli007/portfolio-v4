import { SpotifyAudioFeatures, SpotifyNowPlaying, SpotifyPlaylist, SpotifyTrack } from "@/lib/spotify/types";

export const mockTrack: SpotifyTrack = {
  id: "mock-track",
  name: "Midnight Drive",
  duration_ms: 210000,
  external_urls: { spotify: "https://spotify.com" },
  album: {
    id: "mock-album",
    name: "City Lights",
    images: [{ url: "/placeholder.png", height: 640, width: 640 }],
  },
  artists: [{ id: "artist-1", name: "Lumen" }],
};

export const mockTracks: SpotifyTrack[] = Array.from({ length: 5 }).map((_, idx) => ({
  ...mockTrack,
  id: `mock-track-${idx}`,
  name: `${mockTrack.name} ${idx + 1}`,
}));

export const mockFeatures: SpotifyAudioFeatures = {
  danceability: 0.72,
  energy: 0.65,
  speechiness: 0.08,
  acousticness: 0.12,
  instrumentalness: 0.0,
  liveness: 0.15,
  valence: 0.62,
  tempo: 118,
};

export const mockNowPlaying: SpotifyNowPlaying = {
  is_playing: false,
  progress_ms: 0,
  item: mockTrack,
};

export const mockPlaylist: SpotifyPlaylist = {
  id: "mock-playlist",
  name: "Focus Flow",
  description: "A curated set of tracks to stay in flow.",
  tracks: { total: 24 },
  images: [{ url: "/placeholder.png" }],
  external_urls: { spotify: "https://spotify.com" },
};
