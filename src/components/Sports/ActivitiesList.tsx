"use client";

import { useMemo, useState } from "react";
import { NormalizedActivity } from "@/lib/strava/types";

type ActivitiesListProps = {
  activities: NormalizedActivity[];
};

const stravaOrange = "#FC4C02";
const KM_TO_MILES = 0.621371;
const M_TO_FEET = 3.28084;

const formatDistance = (km: number) => `${(km * KM_TO_MILES).toFixed(1)} mi`;

const formatDuration = (seconds: number | undefined) => {
  if (!seconds && seconds !== 0) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const formatPace = (paceSecPerKm?: number) => {
  if (!paceSecPerKm) return "-";
  const secPerMile = paceSecPerKm / KM_TO_MILES;
  const mins = Math.floor(secPerMile / 60);
  const secs = Math.floor(secPerMile % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs} / mi`;
};

const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric" });

export function ActivitiesList({ activities }: ActivitiesListProps) {
  const [filter, setFilter] = useState<string>("All");

  const sportTypes = useMemo(() => {
    const set = new Set<string>();
    activities.forEach((a) => set.add(a.sportType));
    return ["All", ...Array.from(set)];
  }, [activities]);

  const filtered = useMemo(() => {
    if (filter === "All") return activities;
    return activities.filter((a) => a.sportType === filter);
  }, [activities, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {sportTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              filter === type ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
            }`}
            style={filter === type ? { border: `1px solid ${stravaOrange}` } : undefined}
          >
            {type}
          </button>
        ))}
      </div>

      {activities.length === 0 && <p className="text-slate-400">No activities available.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((activity) => (
          <article
            key={activity.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-slate-400">{activity.sportType}</p>
                <h3 className="truncate text-lg font-semibold text-white">{activity.name}</h3>
                <p className="text-xs text-slate-500">{formatDate(activity.startDateLocal)}</p>
              </div>
              <span
                className="rounded-full px-2 py-[2px] text-xs font-medium"
                style={{ background: `${stravaOrange}22`, color: stravaOrange }}
              >
                {formatDistance(activity.distanceKm)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300">
              <div>
                <p className="text-xs text-slate-400">Time</p>
                <p className="font-medium">{formatDuration(activity.movingTimeSec)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pace</p>
                <p className="font-medium">{formatPace(activity.averagePaceSecPerKm)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Elev</p>
                <p className="font-medium">{Math.round(activity.elevationGainM * M_TO_FEET)} ft</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                {activity.kudosCount !== undefined && <span>👏 {activity.kudosCount}</span>}
                {activity.achievementCount !== undefined && <span>🏅 {activity.achievementCount}</span>}
              </div>
              <a
                href={activity.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--strava-orange,#FC4C02)] hover:underline"
                style={{ color: stravaOrange }}
              >
                View on Strava
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
