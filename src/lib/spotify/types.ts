export type SpotifyImage = {
  url: string;
  height?: number | null;
  width?: number | null;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  href?: string;
  external_urls?: { spotify?: string };
  images?: SpotifyImage[];
  genres?: string[];
  followers?: { total: number };
};

export type SpotifyTrack = {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  external_urls?: { spotify?: string };
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
  artists: SpotifyArtist[];
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description?: string;
  tracks?: { total: number };
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
};

export type SpotifyAudioFeatures = {
  danceability: number;
  energy: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
};

export type SpotifyNowPlaying = {
  is_playing: boolean;
  progress_ms?: number;
  item?: SpotifyTrack | null;
};

export type SpotifyTrackAnalysis = {
  bars: unknown[];
  beats: unknown[];
  sections: { start: number; duration: number; tempo: number; key: number }[];
  segments: unknown[];
  tatums: unknown[];
};

export type SpotifyTimeRange = "short_term" | "medium_term" | "long_term";

export type SpotifyConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  playlistIds: string[];
  encryptionKey: string;
};
