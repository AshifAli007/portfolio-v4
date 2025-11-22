"use client";

import { useEffect, useState } from "react";
import { tagFromFeatures } from "@/lib/spotify/derive";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { SpotifyAudioFeatures, SpotifyTrackAnalysis } from "@/lib/spotify/types";

interface TrackDetailModalProps {
  trackId: string;
  onClose: () => void;
}

export default function TrackDetailModal({ trackId, onClose }: TrackDetailModalProps) {
  const { data: analysis } = useSpotifyData<SpotifyTrackAnalysis>(`/api/spotify/track-analysis?id=${trackId}`);
  const { data: features } = useSpotifyData<SpotifyAudioFeatures>(`/api/spotify/audio-features?ids=${trackId}`);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const tags = features ? tagFromFeatures(features) : [];
  const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKey}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6" tabIndex={-1}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Track Details</h3>
          <button
            onClick={onClose}
            aria-label="Close track details"
            className="rounded-full px-3 py-1 text-sm text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce]"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-300">Sections: {analysis?.sections?.length ?? 0}</p>
        <p className="text-sm text-slate-300">Tempo: {analysis?.sections?.[0]?.tempo ?? 0} BPM</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">
              {tag}
            </span>
          ))}
        </div>
        <p className="sr-only">Track modal can be closed with escape key.</p>
      </div>
    </div>
  );
}
