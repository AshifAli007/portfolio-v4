import { NextRequest, NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify/fetch";
import { getSpotifyConfig } from "@/lib/spotify/config";
import { mockPlaylistList } from "@/lib/spotify/routes";
import { SpotifyPlaylist } from "@/lib/spotify/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const idsParam = req.nextUrl.searchParams.get("ids");
    const envIds = getSpotifyConfig().playlistIds;

    const ids = id
      ? [id]
      : idsParam
        ? idsParam.split(",").map((p) => p.trim()).filter(Boolean)
        : envIds;

    const uniqueIds = Array.from(new Set(ids));
    const results = await Promise.all(
      uniqueIds.map(async (playlistId) => {
        try {
          return await spotifyGet<SpotifyPlaylist>(`/playlists/${playlistId}`);
        } catch (error) {
          console.error(`Failed to load playlist ${playlistId}`, error);
          return null;
        }
      }),
    );

    const playlists = results.filter(Boolean) as SpotifyPlaylist[];
    if (playlists.length === 0) {
      return NextResponse.json(mockPlaylistList(), { status: 200 });
    }

    return NextResponse.json(playlists.length === 1 ? playlists[0] : playlists, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(mockPlaylistList(), { status: 200 });
  }
}
