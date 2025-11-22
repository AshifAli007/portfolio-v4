import { SpotifyConfig } from "./types";

const clientCredentialVars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"] as const;

const requiredVars = [...clientCredentialVars, "SPOTIFY_REDIRECT_URI", "SPOTIFY_PLAYLIST_IDS", "ENCRYPTION_KEY"] as const;

type EnvKey = (typeof requiredVars)[number];

function readEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getSpotifyConfig(): SpotifyConfig {
  return {
    clientId: readEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: readEnv("SPOTIFY_CLIENT_SECRET"),
    redirectUri: readEnv("SPOTIFY_REDIRECT_URI"),
    playlistIds: readEnv("SPOTIFY_PLAYLIST_IDS").split(",").map((id) => id.trim()),
    encryptionKey: readEnv("ENCRYPTION_KEY"),
  };
}

export function hasSpotifyEnv(): boolean {
  return requiredVars.every((key) => Boolean(process.env[key]));
}

export function hasSpotifyClientCredentialsEnv(): boolean {
  return clientCredentialVars.every((key) => Boolean(process.env[key]));
}

export function getSpotifyClientCredentials(): Pick<SpotifyConfig, "clientId" | "clientSecret"> {
  return {
    clientId: readEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: readEnv("SPOTIFY_CLIENT_SECRET"),
  };
}
