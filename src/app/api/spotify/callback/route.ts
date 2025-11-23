import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, readStateFromRequest, setRefreshToken } from "@/lib/spotify/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = readStateFromRequest(req);
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }
  const token = await exchangeCodeForToken(code);
  if (token?.refresh_token) {
    setRefreshToken(token.refresh_token);
  }
  return NextResponse.json({
    receivedState: state,
    accessToken: token?.access_token ?? null,
    refreshToken: token?.refresh_token ?? null,
    expiresIn: token?.expires_in ?? null,
    instructions:
      "Copy the refreshToken value into your environment as SPOTIFY_REFRESH_TOKEN to enable automatic access token refresh.",
  });
}
