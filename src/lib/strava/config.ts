const toNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const stravaCredentials = {
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  refreshToken: process.env.STRAVA_REFRESH_TOKEN,
  accessToken: process.env.STRAVA_ACCESS_TOKEN,
  accessTokenExpiresAt: toNumber(process.env.STRAVA_ACCESS_TOKEN_EXPIRES_AT),
};

export const stravaConfig = {
  cacheTtlMs: (toNumber(process.env.STRAVA_CACHE_TTL_SECONDS) ?? 600) * 1000,
  activityLookbackDays: toNumber(process.env.STRAVA_ACTIVITY_LOOKBACK_DAYS) ?? 180,
  maxActivities: toNumber(process.env.STRAVA_MAX_ACTIVITIES) ?? 200,
};

export const isStravaConfigured = Boolean(
  stravaCredentials.clientId &&
    stravaCredentials.clientSecret &&
    (stravaCredentials.refreshToken || stravaCredentials.accessToken),
);
