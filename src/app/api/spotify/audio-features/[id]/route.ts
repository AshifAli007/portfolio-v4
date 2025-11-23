import { NextRequest, NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify/fetch";
import { mockAudioFeatures } from "@/lib/spotify/routes";
import { SpotifyAudioFeatures } from "@/lib/spotify/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: trackId } = await context.params;
  if (!trackId) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }

  try {
    const feature = await spotifyGet<SpotifyAudioFeatures>(`/audio-features/${trackId}`);
    if (feature) {
      return NextResponse.json(feature, { status: 200 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Suppress noisy logs for 403s (e.g., region or token scopes); fall back silently.
    if (!message.includes("403")) {
      console.error(`Failed to fetch audio features for track ${trackId}`, error);
    }
  }

  return NextResponse.json(mockAudioFeatures(), { status: 200 });
}
