import { refreshAccessToken } from "./auth";
import { getCached, setCached } from "./cache";
import { hasSpotifyEnv } from "./config";

const API_BASE = "https://api.spotify.com/v1";
const RETRY_LIMIT = 3;

const DEFAULT_TTL: Record<string, number> = {
  "/me/player/currently-playing": 20_000,
  "/me/top/tracks": 30_000,
  "/me/top/artists": 30_000,
  "/me/player/recently-played": 45_000,
};

async function backoff(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function withAuthFetch<T>(endpoint: string, accessToken?: string, attempt = 0): Promise<T> {
  if (!hasSpotifyEnv()) {
    throw new Error("Spotify environment not configured");
  }
  const cacheKey = `${endpoint}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const token = accessToken ?? process.env.SPOTIFY_ACCESS_TOKEN;
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (response.status === 401 && attempt < RETRY_LIMIT) {
    const refreshed = await refreshAccessToken();
    if (refreshed?.access_token) {
      return withAuthFetch<T>(endpoint, refreshed.access_token, attempt + 1);
    }
  }

  if (response.status === 429 && attempt < RETRY_LIMIT) {
    const retryAfter = Number(response.headers.get("Retry-After")) || (attempt + 1) * 500;
    await backoff(retryAfter * (attempt + 1));
    return withAuthFetch<T>(endpoint, accessToken, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Spotify request failed: ${response.status}`);
  }

  const ttl = DEFAULT_TTL[endpoint] ?? 60_000;
  const data = (await response.json()) as T;
  return setCached(cacheKey, data, ttl);
}

export async function spotifyGet<T>(endpoint: string, token?: string) {
  return withAuthFetch<T>(endpoint, token);
}
