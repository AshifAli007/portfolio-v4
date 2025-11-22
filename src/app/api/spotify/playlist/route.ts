import { NextRequest } from "next/server";
import { respondWithSpotify, mockPlaylistList } from "@/lib/spotify/routes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const endpoint = id ? `/playlists/${id}` : "/me/playlists";
  const mock = id ? mockPlaylistList()[0] : mockPlaylistList();
  return respondWithSpotify(endpoint, mock);
}
