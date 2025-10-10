"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LiaSyncSolid } from "react-icons/lia";

import { useStravaOverview } from "@/hooks/useStravaOverview";
import { getSummaryDistanceKm } from "@/lib/strava/aggregator";
import type {
  AchievementHighlight,
  ActivityTrendPoint,
  CommunitySnapshot,
  CrossTrainingBreakdown,
  GoalProgress,
  NormalizedActivity,
  StravaAthlete,
  TrainingDay,
} from "@/lib/strava/types";

const KM_TO_MILES = 0.621371;
const KM_PER_MILE = 1 / KM_TO_MILES;
const METERS_TO_FEET = 3.28084;
const MPS_TO_MPH = 2.23694;

const accentColor = "#89d3ce";

const Section = ({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <section
    id={id}
    className="rounded-3xl border border-white/5 bg-glow-section p-8 shadow-lg backdrop-blur"
    style={{ ["--section-bg" as string]: "rgba(8,8,8,0.7)" }}
  >
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: accentColor }}>
          {title}
        </h2>
        {description && <p className="mt-2 max-w-3xl text-sm text-slate-300">{description}</p>}
      </div>
    </div>
    <div className="mt-8">{children}</div>
  </section>
);

const StatPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200">
    <span className="text-slate-400">{label} </span>
    <span className="ml-1 text-white">{value}</span>
  </div>
);

const formatDistance = (distanceKm: number | undefined, fractionDigits = 1): string => {
  if (!distanceKm || distanceKm <= 0) return "0 mi";
  return `${(distanceKm * KM_TO_MILES).toFixed(fractionDigits)} mi`;
};

const formatDuration = (seconds: number | undefined): string => {
  if (!seconds || seconds <= 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

const formatDateLong = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const ActivitySpotlight = ({ activity }: { activity: NormalizedActivity | null }) => {
  if (!activity) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-300">
        No recent Strava activity is available yet. Confirm your credentials and log a new session to see the spotlight in action.
      </div>
    );
  }

  const paceMinutes =
    activity.averagePaceSecPerKm !== undefined
      ? `${Math.floor((activity.averagePaceSecPerKm * KM_PER_MILE) / 60)}:${String(
          Math.floor((activity.averagePaceSecPerKm * KM_PER_MILE) % 60),
        ).padStart(2, "0")} /mi`
      : null;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2rem] text-slate-400">
          <span>{formatDateLong(activity.startDate)}</span>
          <span>{activity.sportType}</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-white">{activity.name}</h3>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Distance</p>
            <p className="mt-1 text-2xl font-semibold text-white">{formatDistance(activity.distanceKm, 2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Moving Time</p>
            <p className="mt-1 text-2xl font-semibold text-white">{formatDuration(activity.movingTimeSec)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Elevation Gain</p>
            <p className="mt-1 text-2xl font-semibold text-white">{Math.round(activity.elevationGainM * METERS_TO_FEET)} ft</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">
              {activity.sportType === "Run" ? "Average Pace" : "Average Speed"}
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {activity.sportType === "Run"
                ? paceMinutes ?? "—"
                : activity.averageSpeedMps
                  ? `${(activity.averageSpeedMps * MPS_TO_MPH).toFixed(1)} mph`
                  : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <StatPill label="Kudos" value={String(activity.kudosCount ?? 0)} />
          <StatPill label="Achievements" value={String(activity.achievementCount ?? 0)} />
          {activity.calories && <StatPill label="Calories" value={`${Math.round(activity.calories)} kcal`} />}
        </div>

        <a
          href={activity.externalUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-medium uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
        >
          Open on Strava
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-white/[0.05] p-6">
        <h4 className="text-sm uppercase tracking-[0.3rem] text-slate-400">Highlights</h4>
        <ul className="mt-4 space-y-4 text-sm text-slate-200">
          <li>
            <span className="text-slate-400">Average heart rate</span>
            <p className="text-lg font-semibold text-white">{activity.averageHeartrate ? `${Math.round(activity.averageHeartrate)} bpm` : "—"}</p>
          </li>
          <li>
            <span className="text-slate-400">Max heart rate</span>
            <p className="text-lg font-semibold text-white">{activity.maxHeartrate ? `${Math.round(activity.maxHeartrate)} bpm` : "—"}</p>
          </li>
          <li>
            <span className="text-slate-400">Gear</span>
            <p className="text-lg font-semibold text-white">{activity.gearId ?? "Not tagged"}</p>
          </li>
        </ul>
        <p className="mt-6 text-xs text-slate-400">
          The spotlight surfaces the freshest ride/run along with metrics that show progression and effort.
        </p>
      </div>
    </div>
  );
};

const PerformanceTrendsChart = ({ data }: { data: ActivityTrendPoint[] }) => {
  if (!data.length) {
    return <p className="text-sm text-slate-300">Once Strava is connected, you will see weekly distance, time, and elevation trends here.</p>;
  }

  const width = 720;
  const height = 260;
  const padding = 40;
  const maxDistance = Math.max(...data.map((point) => point.totalDistanceKm * KM_TO_MILES), 0.1);

  const points = data.map((point, index) => {
    const x =
      padding +
      (index / (Math.max(data.length - 1, 1))) * (width - padding * 2);
    const y =
      height -
      padding -
      ((point.totalDistanceKm * KM_TO_MILES) / maxDistance) * (height - padding * 2);
    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Weekly distance trend"
        className="w-full"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.65" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L ${points.at(-1)?.x ?? padding},${height - padding} L ${points[0]?.x ?? padding},${height - padding} Z`}
          fill="url(#trendGradient)"
          opacity={0.35}
        />
        <path d={path} fill="none" stroke={accentColor} strokeWidth={3} strokeLinecap="round" />
        {points.map((point, index) => (
          <circle key={data[index].weekStart} cx={point.x} cy={point.y} r={4} fill="#0f172a" stroke={accentColor} strokeWidth={2} />
        ))}

        <g className="text-[10px]" fill="#94a3b8">
          {data.map((point, index) => (
            <text key={point.weekStart} x={points[index].x} y={height - padding + 18} textAnchor="middle">
              {new Date(point.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </text>
          ))}
        </g>
      </svg>

      <div className="mt-6 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Avg weekly distance</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {formatDistance(data.reduce((sum, point) => sum + point.totalDistanceKm, 0) / data.length, 1)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Best week</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {formatDistance(Math.max(...data.map((point) => point.totalDistanceKm)))}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Consistency</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {
              Math.round(
                (data.filter((point) => point.activityCount >= 4).length / data.length) * 100,
              )
            }
            %
          </p>
        </div>
      </div>
    </div>
  );
};

const GoalTracker = ({ goal }: { goal: GoalProgress | null }) => {
  if (!goal) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-300">
        Define a monthly or weekly target in <code className="rounded bg-black/40 px-1 py-[2px] text-xs text-white">src/data/stravaConfig.ts</code> to visualise progress here.
      </div>
    );
  }

  const percentage = Math.min(goal.percentage, 200);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{goal.label}</h3>
          <p className="mt-1 text-sm text-slate-300">
            Target {formatDistance(goal.targetDistanceKm)} • {goal.period.toUpperCase()} cadence
          </p>
          {goal.targetDate && (
            <p className="text-xs uppercase tracking-[0.2rem] text-slate-500">
              Due {formatDateLong(goal.targetDate)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Progress</p>
          <p className="text-3xl font-semibold text-white">{percentage.toFixed(0)}%</p>
        </div>
      </div>
      <div className="mt-6 h-4 rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: `linear-gradient(90deg, ${accentColor}, rgba(137,211,206,0.35))`,
          }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
        <StatPill label="Completed" value={formatDistance(goal.currentDistanceKm)} />
        <StatPill label="Remaining" value={formatDistance(goal.remainingDistanceKm)} />
      </div>
    </div>
  );
};

const AchievementsStrip = ({ achievements }: { achievements: AchievementHighlight[] }) => {
  if (!achievements.length) {
    return <p className="text-sm text-slate-300">As new PRs and big milestones roll in, they will populate here.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {achievements.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5"
        >
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">{item.label}</p>
          <p className="mt-3 text-sm font-medium text-slate-200">{item.description}</p>
          {item.activityId && (
            <Link
              href={`https://www.strava.com/activities/${item.activityId}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2rem] text-slate-300 transition hover:text-white"
            >
              Inspect Activity
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const CrossTrainingMix = ({ breakdown }: { breakdown: CrossTrainingBreakdown[] }) => {
  if (!breakdown.length) {
    return <p className="text-sm text-slate-300">Mix of run, ride, swim and strength will appear here once data syncs.</p>;
  }

  const totalDistance = breakdown.reduce((sum, item) => sum + item.totalDistanceKm, 0);

  return (
    <div className="space-y-6">
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
        {breakdown.map((item) => (
          <div
            key={item.sportType}
            className="h-full"
            style={{
              width: `${(item.totalDistanceKm / totalDistance) * 100}%`,
              background: `linear-gradient(90deg, rgba(137,211,206,0.65), rgba(137,211,206,0.3))`,
            }}
          />
        ))}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {breakdown.map((item) => (
          <li
            key={item.sportType}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-5"
          >
            <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">
              {item.sportType}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatDistance(item.totalDistanceKm, 1)}
            </p>
            <p className="text-sm text-slate-300">
              {item.activityCount} activities • {formatDuration(item.totalMovingTimeSec)}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2rem] text-slate-500">
              {item.percentage.toFixed(1)}% of total distance
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CommunitySnapshot = ({ community }: { community: CommunitySnapshot }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Kudos received</p>
      <p className="mt-2 text-3xl font-semibold text-white">{community.kudosReceived}</p>
      <p className="text-sm text-slate-300">Signals how the community responds to effort.</p>
    </div>
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Comments</p>
      <p className="mt-2 text-3xl font-semibold text-white">{community.commentsReceived}</p>
      <p className="text-sm text-slate-300">Conversations started through activities.</p>
    </div>
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Clubs</p>
      <p className="mt-2 text-3xl font-semibold text-white">{community.clubCount}</p>
      <p className="text-sm text-slate-300">Spaces where I train with others.</p>
    </div>
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Activities logged</p>
      <p className="mt-2 text-3xl font-semibold text-white">{community.activityCount}</p>
      <p className="text-sm text-slate-300">Consistency that teams love to see.</p>
    </div>

    {community.topClubs.length > 0 && (
      <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Active communities</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {community.topClubs.map((club) => (
            <li key={club.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-medium text-white">{club.name}</p>
              <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">
                {club.sportType} • {club.memberCount ?? "—"} members
              </p>
              {club.url && (
                <a
                  href={`https://www.strava.com/clubs/${club.url}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2rem] text-slate-300 transition hover:text-white"
                >
                  View Club
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const RacePortfolio = ({ races }: { races: NormalizedActivity[] }) => {
  if (!races.length) {
    return <p className="text-sm text-slate-300">Flag race efforts in Strava to surface them automatically.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {races.map((race) => (
        <article
          key={race.id}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3rem] text-slate-400">
            <span>{formatDateLong(race.startDate)}</span>
            <span>{race.sportType}</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-white">{race.name}</h3>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-200">
            <div>
              <dt className="text-xs uppercase tracking-[0.2rem] text-slate-400">Distance</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{formatDistance(race.distanceKm, 2)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2rem] text-slate-400">Time</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{formatDuration(race.movingTimeSec)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2rem] text-slate-400">Elevation</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{Math.round(race.elevationGainM * METERS_TO_FEET)} ft</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2rem] text-slate-400">Avg HR</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {race.averageHeartrate ? `${Math.round(race.averageHeartrate)} bpm` : "—"}
              </dd>
            </div>
          </dl>
          <a
            href={race.externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
          >
            Race recap on Strava <span aria-hidden="true">↗</span>
          </a>
        </article>
      ))}
    </div>
  );
};

const Heatmap = ({ days }: { days: TrainingDay[] }) => {
  if (!days.length) {
    return <p className="text-sm text-slate-300">The calendar heatmap will fill in as activities sync from Strava.</p>;
  }

  const dayMap = new Map(days.map((day) => [day.date, day]));
  const totalWeeks = 20;
  const cells: Array<{ date: Date; dayKey: string; value: number }> = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let weekIndex = totalWeeks - 1; weekIndex >= 0; weekIndex -= 1) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - (totalWeeks - 1 - weekIndex) * 7 - (6 - dayIndex));
      const key = date.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      cells.push({
        date,
        dayKey: key,
        value: day?.distanceKm ?? 0,
      });
    }
  }

  const maxValue = Math.max(...cells.map((cell) => cell.value * KM_TO_MILES), 0.01);

  return (
    <div className="flex gap-4 overflow-x-auto">
      <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
        {cells.map((cell) => {
          const miles = cell.value * KM_TO_MILES;
          const intensity = Math.min(miles / maxValue, 1);
          const background = intensity === 0 ? "rgba(255,255,255,0.05)" : `rgba(137,211,206,${0.15 + intensity * 0.6})`;
          return (
            <div
              key={`${cell.dayKey}`}
              title={`${formatDateLong(cell.dayKey)} • ${formatDistance(cell.value, 2)}`}
              className="h-4 w-4 rounded-sm"
              style={{ background }}
            />
          );
        })}
      </div>
    </div>
  );
};

const AthleteHeader = ({
  athlete,
  spotlight,
  totalDistance,
  lastUpdated,
  onSync,
  isSyncing,
}: {
  athlete: StravaAthlete | null;
  spotlight: NormalizedActivity | null;
  totalDistance: number;
  lastUpdated: string;
  onSync: () => void;
  isSyncing: boolean;
}) => {
  const name = [athlete?.firstname, athlete?.lastname].filter(Boolean).join(" ") || "Strava Athlete";
  const location = [athlete?.city, athlete?.country].filter(Boolean).join(", ");

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 shadow-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-[0.4rem] text-slate-400">Sports Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">{name}</h1>
          {location && <p className="mt-1 text-sm text-slate-300">{location}</p>}
          {athlete?.bio && <p className="mt-4 max-w-2xl text-sm text-slate-200">{athlete.bio}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            {athlete?.follower_count !== undefined && (
              <StatPill label="Followers" value={String(athlete.follower_count)} />
            )}
            {athlete?.friend_count !== undefined && (
              <StatPill label="Following" value={String(athlete.friend_count)} />
            )}
            <StatPill label="Last sync" value={formatDateLong(lastUpdated)} />
          </div>
          <button
            type="button"
            onClick={onSync}
            className="absolute bottom-0 group mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            title="Pull latest data"
            aria-label="Sync Strava data"
            disabled={isSyncing}
          >
            <LiaSyncSolid
              className={`h-6 w-6 transition-transform duration-700 ${isSyncing ? "animate-spin" : "group-hover:rotate-135"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.08] p-6 text-sm text-slate-200">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">Season snapshot</p>
          <p className="mt-2 text-3xl font-semibold text-white">{formatDistance(totalDistance, 1)} tracked</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2rem] text-slate-500">Total distance in the last block</p>

          {spotlight && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Latest activity</p>
              <p className="mt-1 text-sm font-medium text-white">{spotlight.name}</p>
              <p className="mt-2 text-sm text-slate-300">
                {formatDistance(spotlight.distanceKm, 2)} • {formatDuration(spotlight.movingTimeSec)} • {spotlight.sportType}
              </p>
            </div>
          )}

          <Link
            href="https://www.strava.com/athletes"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3rem] text-slate-200 transition hover:text-white"
          >
            Follow on Strava
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function SportsDashboard() {
  const [syncing, setSyncing] = useState(false);
  const { data, loading, error, refetch } = useStravaOverview();
  const hasData = Boolean(data);
  const totalDistance = useMemo(() => getSummaryDistanceKm(data?.stats ?? null), [data?.stats]);
  const isRefreshing = loading || syncing;

  return (
    <div className="space-y-10">
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-sm text-slate-300">
          Syncing with Strava... give it a moment.
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
          {error}. Confirm your Strava credentials or try refreshing.
        </div>
      )}

      {hasData && data && (
        <>
          <AthleteHeader
            athlete={data.athlete}
            spotlight={data.spotlightActivity}
            totalDistance={totalDistance}
            lastUpdated={data.generatedAt}
            onSync={() => {
              if (isRefreshing) return;
              setSyncing(true);
              refetch({ force: true })
                .catch(() => undefined)
                .finally(() => setSyncing(false));
            }}
            isSyncing={isRefreshing}
          />

          <Section
            id="spotlight"
            title="Personal Activity Spotlight"
            description="Surface the most recent effort with the stats that matter: distance, time, elevation, and context that recruiters care about."
          >
            <ActivitySpotlight activity={data.spotlightActivity} />
          </Section>

          <Section
            id="trends"
            title="Performance Trends"
            description="Track progression across distance, time, and volume. Recruiters can quickly gauge commitment and progression."
          >
            <PerformanceTrendsChart data={data.weeklyTrends} />
          </Section>

          <Section
            id="goal"
            title="Training Goal Tracker"
            description="Shared goals make the story tangible. Visualise the current block’s target and how far there is to go."
          >
            <GoalTracker goal={data.goal} />
          </Section>

          <Section
            id="achievements"
            title="Badges & Achievements"
            description="Celebrate PRs, segment wins, and big efforts with quick context."
          >
            <AchievementsStrip achievements={data.achievements} />
          </Section>

          <Section
            id="mix"
            title="Cross-Training Mix"
            description="Balance across disciplines shows versatility and thoughtful programming."
          >
            <CrossTrainingMix breakdown={data.crossTraining} />
          </Section>

          <Section
            id="community"
            title="Community Snapshot"
            description="Engagement showcases team energy—kudos, comments, and the clubs where I show up consistently."
          >
            <CommunitySnapshot community={data.community} />
          </Section>

          <Section
            id="heatmap"
            title="Training Consistency"
            description="A heatmap of sessions over the last several months spotlights discipline without overwhelming detail."
          >
            <Heatmap days={data.trainingHeatmap} />
          </Section>

          <Section
            id="race"
            title="Race Portfolio"
            description="Curated races and event efforts with finishing stats and quick context."
          >
            <RacePortfolio races={data.racePortfolio} />
          </Section>

          {/* <Section
            id="gear"
            title="Gear & Tech Notes"
            description="Highlight how I look after equipment and link stories from training to engineering craft."
          >
            <GearGrid gear={data.gearInsights} />
          </Section> */}
        </>
      )}
    </div>
  );
}
