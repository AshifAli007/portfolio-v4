import { NextRequest, NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify/fetch";
import { mockAudioFeatures, mockAudioFeaturesList } from "@/lib/spotify/routes";
import { SpotifyAudioFeatures, SpotifyNowPlaying } from "@/lib/spotify/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  const id = req.nextUrl.searchParams.get("id");
  const useCurrent = req.nextUrl.searchParams.get("current") === "true" || (!ids && !id);

  try {
    // Multiple ids path
    if (ids) {
      const data = await spotifyGet<{ audio_features: SpotifyAudioFeatures[] }>(`/audio-features?ids=${ids}`);
      const list = data?.audio_features?.filter(Boolean) ?? [];
      if (list.length) return NextResponse.json(list, { status: 200 });
    }

    // Single id path
    let trackId = id ?? null;

    // If requested, derive from currently playing track
    if (!trackId && useCurrent) {
      const now = await spotifyGet<SpotifyNowPlaying>("/me/player/currently-playing");
      trackId = now?.item?.id ?? null;
    }

    if (trackId) {
      const feature = await spotifyGet<SpotifyAudioFeatures>(`/audio-features/${trackId}`);
      if (feature) return NextResponse.json(feature, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch audio features", error);
  }

  const mock = ids ? mockAudioFeaturesList() : mockAudioFeatures();
  return NextResponse.json(mock, { status: 200 });
}
