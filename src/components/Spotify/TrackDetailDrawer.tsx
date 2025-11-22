"use client";

import TrackDetailModal from "./TrackDetailModal";

interface TrackDetailDrawerProps {
  trackId: string;
  open: boolean;
  onClose: () => void;
}

export default function TrackDetailDrawer({ trackId, open, onClose }: TrackDetailDrawerProps) {
  if (!open) return null;
  return <TrackDetailModal trackId={trackId} onClose={onClose} />;
}
