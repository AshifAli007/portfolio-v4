import { respondWithSpotify, mockRecentlyPlayed } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET() {
  return respondWithSpotify("/me/player/recently-played?limit=20", mockRecentlyPlayed);
}
