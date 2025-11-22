import { NextRequest } from "next/server";
import { respondWithSpotify, mockAudioFeatures, mockAudioFeaturesList } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  const endpoint = ids ? `/audio-features?ids=${ids}` : "/audio-features";
  const mock = ids ? mockAudioFeaturesList() : mockAudioFeatures();
  return respondWithSpotify(endpoint, mock);
}
