import { NextRequest } from "next/server";
import { respondWithSpotify, mockTopArtists } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("time_range") ?? "short_term";
  return respondWithSpotify(`/me/top/artists?limit=10&time_range=${range}`, mockTopArtists());
}
