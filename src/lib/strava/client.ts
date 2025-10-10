import { isStravaConfigured, stravaCredentials } from "./config";

const STRAVA_BASE_URL = "https://www.strava.com/api/v3";
const STRAVA_OAUTH_URL = "https://www.strava.com/oauth/token";

type TokenState = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  lastRefreshAt?: number;
};

type RateLimit = {
  usage?: string;
  limit?: string;
};

declare global {
  var __STRAVA_TOKEN_STATE__: TokenState | undefined;
}

const getTokenState = (): TokenState => {
  if (!globalThis.__STRAVA_TOKEN_STATE__) {
    globalThis.__STRAVA_TOKEN_STATE__ = {
      accessToken: stravaCredentials.accessToken,
      refreshToken: stravaCredentials.refreshToken ?? undefined,
      expiresAt: stravaCredentials.accessTokenExpiresAt,
    };
  }
  return globalThis.__STRAVA_TOKEN_STATE__;
};

const persistTokenState = (state: TokenState) => {
  globalThis.__STRAVA_TOKEN_STATE__ = state;
};

const refreshAccessToken = async (): Promise<string> => {
  const state = getTokenState();
  const refreshToken = state.refreshToken ?? stravaCredentials.refreshToken;
  if (!refreshToken) {
    throw new Error(
      "Strava refresh token missing. Provide STRAVA_REFRESH_TOKEN or a valid STRAVA_ACCESS_TOKEN.",
    );
  }
  if (!stravaCredentials.clientId || !stravaCredentials.clientSecret) {
    throw new Error("Strava client credentials missing. Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET.");
  }

  const form = new URLSearchParams({
    client_id: stravaCredentials.clientId,
    client_secret: stravaCredentials.clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(STRAVA_OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const text = await response.text();
      errorDetail = text ? ` – ${text}` : "";
    } catch {
      // ignore
    }
    throw new Error(`Failed to refresh Strava access token (${response.status})${errorDetail}`);
  }

  const json = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  };

  const nextState: TokenState = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? refreshToken,
    expiresAt: json.expires_at,
    lastRefreshAt: Date.now(),
  };

  persistTokenState(nextState);

  if (json.refresh_token && json.refresh_token !== refreshToken) {
    console.warn("Strava refresh token rotated. Update STRAVA_REFRESH_TOKEN to avoid re-authentication on restart.");
  }

  return json.access_token;
};

const ensureAccessToken = async (): Promise<string> => {
  const state = getTokenState();
  const now = Math.floor(Date.now() / 1000);

  if (state.accessToken && state.expiresAt && state.expiresAt - 90 > now) {
    return state.accessToken;
  }

  if (state.accessToken && !state.expiresAt) {
    return state.accessToken;
  }

  return refreshAccessToken();
};

type FetchOptions = {
  query?: Record<string, string | number | undefined>;
  init?: RequestInit;
  retry?: boolean;
};

export type StravaFetchResponse<T> = {
  data: T;
  rateLimit?: RateLimit;
};

const buildUrl = (endpoint: string, query?: Record<string, string | number | undefined>): string => {
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${STRAVA_BASE_URL}${endpoint}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

export const stravaFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<StravaFetchResponse<T>> => {
  if (!isStravaConfigured) {
    throw new Error("Strava credentials are not configured.");
  }

  const accessToken = await ensureAccessToken();
  const url = buildUrl(endpoint, options.query);

  const response = await fetch(url, {
    ...(options.init ?? {}),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.init?.headers ?? {}),
    },
  });

  const rateLimit: RateLimit = {
    usage: response.headers.get("x-ratelimit-usage") ?? undefined,
    limit: response.headers.get("x-ratelimit-limit") ?? undefined,
  };

  if (response.status === 401 && !options.retry) {
    await refreshAccessToken();
    return stravaFetch<T>(endpoint, { ...options, retry: true });
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strava request failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as T;
  return { data, rateLimit };
};
