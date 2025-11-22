import { NextRequest } from "next/server";
import { respondWithSpotify, mockAnalysis } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  return respondWithSpotify(`/audio-analysis/${id}`, mockAnalysis);
}
