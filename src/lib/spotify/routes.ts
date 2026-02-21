import { NextResponse } from "next/server";
import { mockFeatures, mockNowPlaying, mockPlaylist, mockTracks } from "@/data/spotify-mock";
import { spotifyGet } from "./fetch";
import { hasSpotifyClientCredentialsEnv, hasSpotifyEnv } from "./config";
import { SpotifyArtist, SpotifyAudioFeatures, SpotifyNowPlaying, SpotifyPlaylist, SpotifyTrack, SpotifyTrackAnalysis } from "./types";

export async function respondWithSpotify<T>(endpoint: string, mock: T) {
  try {
    if (!hasSpotifyEnv() && !hasSpotifyClientCredentialsEnv()) {
      return NextResponse.json(mock, { status: 200 });
    }
    const data = await spotifyGet<T>(endpoint);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(mock, { status: 200 });
  }
}

export const mockAnalysis: SpotifyTrackAnalysis = {
  bars: [],
  beats: [],
  sections: [
    { start: 0, duration: 30, tempo: 120, key: 5 },
    { start: 30, duration: 45, tempo: 122, key: 5 },
  ],
  segments: [],
  tatums: [],
};

export function mockAudioFeaturesList(): SpotifyAudioFeatures[] {
  return Array.from({ length: 5 }).map(() => mockFeatures);
}

export function mockTopTracks(): SpotifyTrack[] {
  return mockTracks;
}

export function mockTopArtists(): SpotifyArtist[] {
  return [
    { id: "artist-1", name: "Lumen", images: [{ url: "https://i.scdn.co/image/ab67616d0000b27305382cac18b598909ed39288" }], genres: [] },
    { id: "artist-2", name: "Echoes", images: [{ url: "https://i.scdn.co/image/ab67616d0000b27305382cac18b598909ed39288" }], genres: [] },
  ];
}

export function mockPlaylistList(): SpotifyPlaylist[] {
  return [mockPlaylist];
}

export const mockRecentlyPlayed = {
  items: mockTracks.map((track) => ({ track, played_at: new Date().toISOString() })),
};

export function mockNowPlayingData(): SpotifyNowPlaying {
  return mockNowPlaying;
}

export function mockAudioFeatures(): SpotifyAudioFeatures {
  return mockFeatures;
}
