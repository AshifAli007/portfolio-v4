import { NextRequest, NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify/fetch";
import { mockTopTracks } from "@/lib/spotify/routes";
import { SpotifyTrack } from "@/lib/spotify/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("time_range") ?? "short_term";
  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  const offsetParam = Number(req.nextUrl.searchParams.get("offset"));
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;
  const offset = Number.isFinite(offsetParam) && offsetParam > 0 ? offsetParam : 0;

  const endpoint = `/me/top/tracks?limit=${limit}&time_range=${range}&offset=${offset}`;
  try {
    // Shape: { items: SpotifyTrack[], total, limit, offset, ... }
    const data = await spotifyGet<{ items: SpotifyTrack[] }>(endpoint);
    if (Array.isArray(data?.items)) {
      return NextResponse.json(data.items, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch top tracks", error);
  }

  // Fallback to mocks if API unavailable
  return NextResponse.json(mockTopTracks().slice(0, limit), { status: 200 });
}
