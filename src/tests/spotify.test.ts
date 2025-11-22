import assert from "node:assert";
import { aggregateAudioFeatures, moodFromFeatures } from "@/lib/spotify/derive";

const sample = [
  {
    danceability: 0.5,
    energy: 0.5,
    speechiness: 0.1,
    acousticness: 0.2,
    instrumentalness: 0.1,
    liveness: 0.1,
    valence: 0.6,
    tempo: 120,
  },
  {
    danceability: 0.7,
    energy: 0.7,
    speechiness: 0.2,
    acousticness: 0.1,
    instrumentalness: 0.0,
    liveness: 0.2,
    valence: 0.8,
    tempo: 122,
  },
];

const aggregated = aggregateAudioFeatures(sample);

assert(Math.abs(aggregated.tempo - 121) < 0.5);
assert(moodFromFeatures(0.8, 0.7) === "Upbeat");
