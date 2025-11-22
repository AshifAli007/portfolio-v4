interface MoodBadgeProps {
  mood: string;
}

const moodStyles: Record<string, string> = {
  Upbeat: "bg-[#1DB954]/20 text-[#1DB954]",
  Chill: "bg-sky-900/50 text-sky-200",
  Warm: "bg-amber-900/40 text-amber-200",
  Intense: "bg-rose-900/50 text-rose-200",
  Somber: "bg-slate-800 text-slate-200",
};

export default function MoodBadge({ mood }: MoodBadgeProps) {
  const style = moodStyles[mood] ?? moodStyles.Chill;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-inner ${style}`} aria-label={`Mood: ${mood}`}>
      {mood}
    </span>
  );
}
