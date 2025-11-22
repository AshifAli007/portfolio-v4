import { respondWithSpotify, mockNowPlayingData } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET() {
  return respondWithSpotify("/me/player/currently-playing", mockNowPlayingData());
}
