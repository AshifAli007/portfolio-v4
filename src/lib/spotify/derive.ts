import { SpotifyAudioFeatures, SpotifyTrack } from "./types";

export function moodFromFeatures(valence: number, energy: number): string {
  if (valence > 0.7 && energy > 0.6) return "Upbeat";
  if (valence > 0.6 && energy <= 0.6) return "Warm";
  if (valence < 0.4 && energy > 0.6) return "Intense";
  if (valence < 0.4 && energy < 0.4) return "Somber";
  return "Chill";
}

export function tagFromFeatures(features: SpotifyAudioFeatures): string[] {
  const tags: string[] = [];
  if (features.energy > 0.7) tags.push("High Energy");
  if (features.danceability > 0.7) tags.push("Danceable");
  if (features.acousticness > 0.5) tags.push("Acoustic");
  if (features.instrumentalness > 0.5) tags.push("Instrumental");
  if (features.speechiness > 0.4) tags.push("Spoken Word");
  if (features.valence > 0.6) tags.push("Positive");
  return tags.length ? tags : ["Balanced"];
}

export function aggregateAudioFeatures(tracks: SpotifyAudioFeatures[]): SpotifyAudioFeatures {
  const count = tracks.length || 1;
  const totals = tracks.reduce(
    (acc, track) => {
      acc.danceability += track.danceability;
      acc.energy += track.energy;
      acc.speechiness += track.speechiness;
      acc.acousticness += track.acousticness;
      acc.instrumentalness += track.instrumentalness;
      acc.liveness += track.liveness;
      acc.valence += track.valence;
      acc.tempo += track.tempo;
      return acc;
    },
    {
      danceability: 0,
      energy: 0,
      speechiness: 0,
      acousticness: 0,
      instrumentalness: 0,
      liveness: 0,
      valence: 0,
      tempo: 0,
    },
  );

  return {
    danceability: totals.danceability / count,
    energy: totals.energy / count,
    speechiness: totals.speechiness / count,
    acousticness: totals.acousticness / count,
    instrumentalness: totals.instrumentalness / count,
    liveness: totals.liveness / count,
    valence: totals.valence / count,
    tempo: totals.tempo / count,
  };
}

export function dominantColorFromImage(_url?: string): string {
  return "#1DB954";
}

export function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function averageMoodFromTracks(tracks: SpotifyTrack[], features: SpotifyAudioFeatures[]): string {
  if (!tracks.length || !features.length) return "Chill";
  const aggregate = aggregateAudioFeatures(features);
  return moodFromFeatures(aggregate.valence, aggregate.energy);
}
