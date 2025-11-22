import { NextRequest } from "next/server";
import { getSpotifyConfig, hasSpotifyEnv } from "./config";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

let refreshTokenStore: string | null = null;

export function buildAuthUrl(state: string, scopes?: string[]): string {
  if (!hasSpotifyEnv()) return "";
  const { clientId, redirectUri } = getSpotifyConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(" ") ?? "user-read-playback-state user-top-read user-read-recently-played playlist-read-private",
    state,
  });
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; refresh_token?: string; expires_in: number } | null> {
  if (!hasSpotifyEnv()) return null;
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const token = await fetchToken(body, clientId, clientSecret);
  if (token?.refresh_token) {
    refreshTokenStore = token.refresh_token;
  }
  return token;
}

export async function refreshAccessToken(existing?: string): Promise<{ access_token: string; expires_in: number } | null> {
  if (!hasSpotifyEnv()) return null;
  const { clientId, clientSecret } = getSpotifyConfig();
  const refreshToken = existing ?? refreshTokenStore;
  if (!refreshToken) return null;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return fetchToken(body, clientId, clientSecret);
}

async function fetchToken(body: URLSearchParams, clientId: string, clientSecret: string) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export function readStateFromRequest(req: NextRequest): string {
  return req.nextUrl.searchParams.get("state") ?? "";
}

export function getRefreshToken(): string | null {
  return refreshTokenStore;
}

export function setRefreshToken(token: string): void {
  refreshTokenStore = token;
}
