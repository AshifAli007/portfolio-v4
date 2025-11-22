import { aggregateAudioFeatures } from "@/lib/spotify/derive";
import { SpotifyAudioFeatures } from "@/lib/spotify/types";

interface AudioFeatureRadarProps {
  features: SpotifyAudioFeatures[];
}

const metrics: (keyof SpotifyAudioFeatures)[] = [
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
];

export default function AudioFeatureRadar({ features }: AudioFeatureRadarProps) {
  const aggregated = aggregateAudioFeatures(features);
  const points = metrics
    .map((key, index) => {
      const angle = (Math.PI * 2 * index) / metrics.length;
      const radius = (aggregated[key] ?? 0) * 60;
      const x = 80 + radius * Math.cos(angle);
      const y = 80 + radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Audio Profile</h3>
      <div className="mt-4 flex items-center gap-4">
        <svg viewBox="0 0 160 160" role="img" aria-label="Radar chart of audio features" className="h-48 w-48">
          <polygon points={points} className="fill-[#89d3ce]/40 stroke-[#1DB954]" strokeWidth={1.5} />
          <circle cx="80" cy="80" r="60" className="fill-transparent stroke-white/10" />
        </svg>
        <div className="space-y-1 text-sm text-slate-300">
          {metrics.map((key) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="capitalize">{key}</span>
              <span>{aggregated[key].toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">
        Audio features summary: {metrics.map((metric) => `${metric} ${aggregated[metric].toFixed(2)}`).join(", ")}.
      </p>
    </div>
  );
}
