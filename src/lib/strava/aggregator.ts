import { stravaGoalConfig } from "@/data/stravaConfig";

import { clearCachedValue, getCachedValue, setCachedValue } from "./cache";
import { isStravaConfigured, stravaConfig } from "./config";
import { stravaFetch } from "./client";
import {
  AchievementHighlight,
  ActivityTrendPoint,
  CrossTrainingBreakdown,
  GoalProgress,
  NormalizedActivity,
  StravaAthlete,
  StravaClub,
  StravaGear,
  StravaOverview,
  StravaStats,
  StravaStatsTotal,
  StravaActivity,
  TrainingDay,
} from "./types";

const KM_TO_MILES = 0.621371;
const METERS_TO_FEET = 3.28084;
const METERS_TO_MILES = KM_TO_MILES / 1000;

const CACHE_KEY = "strava:overview";
const ACTIVITIES_CACHE_KEY = "strava:activities";
const STRAVA_ACTIVITIES_ENDPOINT = "/athlete/activities";
const STRAVA_CLUBS_ENDPOINT = "/athlete/clubs";

type FetchContext = {
  rateLimitUsage?: string;
  rateLimitLimit?: string;
};

const getStartOfWeek = (date: Date): Date => {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = copy.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + diff);
  return copy;
};

const getStartOfMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
};

const getEndOfMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59));
};

const isoDate = (date: Date): string => date.toISOString().split("T")[0] ?? date.toISOString();

const normalizeActivity = (activity: StravaActivity): NormalizedActivity => {
  const distanceKm = activity.distance / 1000;
  const averagePace =
    activity.sport_type === "Run" && distanceKm > 0 ? Math.round(activity.moving_time / distanceKm) : undefined;

  return {
    id: activity.id,
    name: activity.name,
    sportType: activity.sport_type ?? activity.type ?? "Other",
    startDate: activity.start_date,
    startDateLocal: activity.start_date_local,
    distanceKm,
    movingTimeSec: activity.moving_time,
    elapsedTimeSec: activity.elapsed_time,
    elevationGainM: activity.total_elevation_gain,
    averageSpeedMps: activity.average_speed,
    averagePaceSecPerKm: averagePace,
    averageHeartrate: activity.average_heartrate,
    maxHeartrate: activity.max_heartrate,
    kudosCount: activity.kudos_count,
    achievementCount: activity.achievement_count ?? activity.pr_count,
    mapPolyline: activity.map?.summary_polyline,
    isRace: (activity.sport_type === "Run" || activity.type === "Run") && activity.workout_type === 1,
    gearId: activity.gear_id ?? null,
    externalUrl: `https://www.strava.com/activities/${activity.id}`,
    calories: activity.calories,
  };
};

export const getStravaActivities = async (options?: { forceRefresh?: boolean }): Promise<NormalizedActivity[]> => {
  if (!isStravaConfigured) {
    throw new Error(
      "Strava credentials are not configured. Provide STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN.",
    );
  }

  if (!options?.forceRefresh) {
    const cached = getCachedValue<NormalizedActivity[]>(ACTIVITIES_CACHE_KEY);
    if (cached) return cached;
  } else {
    clearCachedValue(ACTIVITIES_CACHE_KEY);
  }

  const fetchContext: FetchContext = {};
  const activitiesRaw = await listActivities(fetchContext);
  const normalizedActivities = activitiesRaw.map(normalizeActivity);

  setCachedValue(ACTIVITIES_CACHE_KEY, normalizedActivities, stravaConfig.cacheTtlMs);
  return normalizedActivities;
};

const computeWeeklyTrends = (activities: NormalizedActivity[]): ActivityTrendPoint[] => {
  const buckets = new Map<string, ActivityTrendPoint>();
  const sorted = [...activities].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  sorted.forEach((activity) => {
    const weekStartISO = isoDate(getStartOfWeek(new Date(activity.startDate)));
    const bucket = buckets.get(weekStartISO) ?? {
      weekStart: weekStartISO,
      totalDistanceKm: 0,
      totalMovingTimeSec: 0,
      totalElevationGainM: 0,
      activityCount: 0,
    };
    bucket.totalDistanceKm += activity.distanceKm;
    bucket.totalMovingTimeSec += activity.movingTimeSec;
    bucket.totalElevationGainM += activity.elevationGainM;
    bucket.activityCount += 1;
    buckets.set(weekStartISO, bucket);
  });

  return Array.from(buckets.values()).sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
};

const computeHeatmap = (activities: NormalizedActivity[], lookbackDays: number): TrainingDay[] => {
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
  const map = new Map<string, TrainingDay>();

  activities.forEach((activity) => {
    const activityDate = new Date(activity.startDate).getTime();
    if (activityDate < cutoff) return;
    const dayKey = activity.startDate.slice(0, 10);
    const entry =
      map.get(dayKey) ?? {
        date: dayKey,
        distanceKm: 0,
        movingTimeSec: 0,
        activityCount: 0,
      };
    entry.distanceKm += activity.distanceKm;
    entry.movingTimeSec += activity.movingTimeSec;
    entry.activityCount += 1;
    map.set(dayKey, entry);
  });

  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
};

const computeCrossTraining = (activities: NormalizedActivity[]): CrossTrainingBreakdown[] => {
  const totals = new Map<string, CrossTrainingBreakdown>();
  let grandTotal = 0;

  activities.forEach((activity) => {
    grandTotal += activity.distanceKm;
    const key = activity.sportType;
    const entry =
      totals.get(key) ?? {
        sportType: key,
        totalDistanceKm: 0,
        totalMovingTimeSec: 0,
        activityCount: 0,
        percentage: 0,
      };

    entry.totalDistanceKm += activity.distanceKm;
    entry.totalMovingTimeSec += activity.movingTimeSec;
    entry.activityCount += 1;
    totals.set(key, entry);
  });

  return Array.from(totals.values())
    .map((item) => ({
      ...item,
      percentage: grandTotal > 0 ? (item.totalDistanceKm / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.totalDistanceKm - a.totalDistanceKm);
};

const formatDistanceKm = (total?: number): number => {
  if (!total) return 0;
  return total / 1000;
};

const computeGoalProgress = (activities: NormalizedActivity[]): GoalProgress | null => {
  if (!stravaGoalConfig) return null;
  const now = new Date();

  let start = stravaGoalConfig.startDate ? new Date(stravaGoalConfig.startDate) : undefined;
  let target: Date | undefined = stravaGoalConfig.targetDate ? new Date(stravaGoalConfig.targetDate) : undefined;

  if (!start) {
    if (stravaGoalConfig.period === "weekly") {
      start = getStartOfWeek(now);
    } else if (stravaGoalConfig.period === "monthly") {
      start = getStartOfMonth(now);
    } else {
      start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    }
  }

  if (!target) {
    if (stravaGoalConfig.period === "weekly") {
      target = new Date(start);
      target.setUTCDate(start.getUTCDate() + 6);
    } else if (stravaGoalConfig.period === "monthly") {
      target = getEndOfMonth(start);
    } else {
      target = new Date(stravaGoalConfig.targetDate ?? now);
    }
  }

  const currentDistanceKm = activities
    .filter((activity) => {
      const date = new Date(activity.startDate);
      return (!start || date >= start) && (!target || date <= target);
    })
    .reduce((total, activity) => total + activity.distanceKm, 0);

  const remainingDistanceKm = Math.max(stravaGoalConfig.targetDistanceKm - currentDistanceKm, 0);
  const percentage =
    stravaGoalConfig.targetDistanceKm > 0
      ? Math.min((currentDistanceKm / stravaGoalConfig.targetDistanceKm) * 100, 200)
      : 0;

  return {
    label: stravaGoalConfig.label,
    targetDistanceKm: stravaGoalConfig.targetDistanceKm,
    period: stravaGoalConfig.period,
    startDate: start.toISOString(),
    targetDate: target?.toISOString(),
    currentDistanceKm,
    remainingDistanceKm,
    percentage,
  };
};

const computeAchievements = (
  activities: NormalizedActivity[],
  stats: StravaStats | null,
): AchievementHighlight[] => {
  const highlights: AchievementHighlight[] = [];

  const longestRide = activities
    .filter((activity) => activity.sportType === "Ride")
    .reduce<NormalizedActivity | null>((longest, candidate) => {
      if (!longest || candidate.distanceKm > longest.distanceKm) return candidate;
      return longest;
    }, null);

  if (longestRide) {
    highlights.push({
      label: "Longest Ride",
      description: `${(longestRide.distanceKm * KM_TO_MILES).toFixed(1)} mi • ${longestRide.name}`,
      activityId: longestRide.id,
    });
  }

  const longestRun = activities
    .filter((activity) => activity.sportType === "Run")
    .reduce<NormalizedActivity | null>((longest, candidate) => {
      if (!longest || candidate.distanceKm > longest.distanceKm) return candidate;
      return longest;
    }, null);

  if (longestRun) {
    highlights.push({
      label: "Longest Run",
      description: `${(longestRun.distanceKm * KM_TO_MILES).toFixed(1)} mi • ${longestRun.name}`,
      activityId: longestRun.id,
    });
  }

  const biggestClimb = stats?.biggest_climb_elevation_gain ?? 0;
  if (biggestClimb > 0) {
    highlights.push({
      label: "Biggest Climb",
      description: `${Math.round(biggestClimb * METERS_TO_FEET)} ft elevation in a single activity`,
    });
  }

  const recentRideTotals = stats?.recent_ride_totals?.distance ?? 0;
  if (recentRideTotals > 0) {
    highlights.push({
      label: "Ride Volume (4w)",
      description: `${(recentRideTotals * METERS_TO_MILES).toFixed(1)} mi in the last 4 weeks`,
    });
  }

  return highlights;
};

const sumTotals = (totals?: StravaStatsTotal): number => {
  if (!totals) return 0;
  return totals.distance;
};

const computeRacePortfolio = (activities: NormalizedActivity[]): NormalizedActivity[] => {
  const taggedRaces = activities.filter((activity) => activity.isRace);

  if (taggedRaces.length > 0) return taggedRaces;

  return activities.filter((activity) =>
    /race|marathon|half|10k|5k|gran fondo|event/i.test(activity.name),
  );
};

const computeCommunitySnapshot = (activities: NormalizedActivity[], clubs: StravaClub[]): StravaOverview["community"] => {
  const kudosReceived = activities.reduce((total, activity) => total + (activity.kudosCount ?? 0), 0);
  const commentsReceived = activities.reduce((total, activity) => total + (activity.achievementCount ?? 0), 0);

  const topClubs = clubs
    .map((club) => ({
      id: club.id,
      name: club.name,
      sportType: club.sport_type,
      memberCount: club.member_count,
      url: club.url,
    }))
    .sort((a, b) => (b.memberCount ?? 0) - (a.memberCount ?? 0))
    .slice(0, 4);

  return {
    kudosReceived,
    commentsReceived,
    activityCount: activities.length,
    clubCount: clubs.length,
    topClubs,
  };
};

const computeGearInsights = (gear: StravaGear[], activities: NormalizedActivity[]): StravaOverview["gearInsights"] => {
  const sportByGear = new Map<string, Set<string>>();

  activities.forEach((activity) => {
    if (!activity.gearId) return;
    const set = sportByGear.get(activity.gearId) ?? new Set<string>();
    set.add(activity.sportType);
    sportByGear.set(activity.gearId, set);
  });

  return gear.map((item) => ({
    id: item.id,
    name: item.name,
    brandName: item.brand_name,
    modelName: item.model_name,
    distanceKm: (item.distance ?? 0) / 1000,
    convertedDistanceKm: item.converted_distance,
    description: item.description,
    primary: Boolean(item.primary),
    sportTypes: Array.from(sportByGear.get(item.id) ?? new Set<string>()),
  }));
};

const listActivities = async (context: FetchContext): Promise<StravaActivity[]> => {
  const perPage = 100;
  const max = stravaConfig.maxActivities;
  const cutoff = Date.now() - stravaConfig.activityLookbackDays * 24 * 60 * 60 * 1000;

  const results: StravaActivity[] = [];
  let page = 1;
  let shouldContinue = true;

  while (shouldContinue && results.length < max) {
    const { data, rateLimit } = await stravaFetch<StravaActivity[]>(STRAVA_ACTIVITIES_ENDPOINT, {
      query: {
        per_page: perPage,
        page,
      },
    });

    context.rateLimitUsage = rateLimit?.usage ?? context.rateLimitUsage;
    context.rateLimitLimit = rateLimit?.limit ?? context.rateLimitLimit;

    if (!data.length) break;

    for (const activity of data) {
      const timestamp = new Date(activity.start_date).getTime();
      if (timestamp < cutoff) {
        shouldContinue = false;
        break;
      }
      results.push(activity);
      if (results.length >= max) {
        shouldContinue = false;
        break;
      }
    }

    page += 1;
  }

  return results.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
};

const fetchGearDetails = async (
  gearIds: string[],
  context: FetchContext,
): Promise<StravaGear[]> => {
  const details: StravaGear[] = [];

  for (const gearId of gearIds) {
    try {
      const { data, rateLimit } = await stravaFetch<StravaGear>(`/gear/${gearId}`);
      details.push(data);
      context.rateLimitUsage = rateLimit?.usage ?? context.rateLimitUsage;
      context.rateLimitLimit = rateLimit?.limit ?? context.rateLimitLimit;
    } catch (error) {
      console.warn(`Failed to fetch gear ${gearId}:`, error);
    }
  }

  return details;
};

export const getStravaOverview = async (options?: { forceRefresh?: boolean }): Promise<StravaOverview> => {
  if (!isStravaConfigured) {
    throw new Error(
      "Strava credentials are not configured. Provide STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN.",
    );
  }

  if (!options?.forceRefresh) {
    const cached = getCachedValue<StravaOverview>(CACHE_KEY);
    if (cached) return cached;
  } else {
    clearCachedValue(CACHE_KEY);
  }

  const fetchContext: FetchContext = {};

  const [{ data: athlete, rateLimit: athleteRate }, activitiesRaw] = await Promise.all([
    stravaFetch<StravaAthlete>("/athlete"),
    listActivities(fetchContext),
  ]);

  fetchContext.rateLimitUsage = athleteRate?.usage ?? fetchContext.rateLimitUsage;
  fetchContext.rateLimitLimit = athleteRate?.limit ?? fetchContext.rateLimitLimit;

  const normalizedActivities = activitiesRaw.map(normalizeActivity);

  const [{ data: stats, rateLimit: statsRate }, { data: clubs, rateLimit: clubRate }] = await Promise.all([
    athlete?.id ? stravaFetch<StravaStats>(`/athletes/${athlete.id}/stats`) : Promise.resolve({ data: null, rateLimit: undefined }),
    stravaFetch<StravaClub[]>(STRAVA_CLUBS_ENDPOINT),
  ]);

  fetchContext.rateLimitUsage = statsRate?.usage ?? fetchContext.rateLimitUsage;
  fetchContext.rateLimitLimit = statsRate?.limit ?? fetchContext.rateLimitLimit;
  fetchContext.rateLimitUsage = clubRate?.usage ?? fetchContext.rateLimitUsage;
  fetchContext.rateLimitLimit = clubRate?.limit ?? fetchContext.rateLimitLimit;

  const gearIds = Array.from(
    new Set(normalizedActivities.map((activity) => activity.gearId).filter((gearId): gearId is string => Boolean(gearId))),
  );

  const gearDetails = await fetchGearDetails(gearIds, fetchContext);

  const weeklyTrends = computeWeeklyTrends(normalizedActivities).slice(-12);
  const heatmap = computeHeatmap(normalizedActivities, stravaConfig.activityLookbackDays);
  const crossTraining = computeCrossTraining(normalizedActivities);
  const achievements = computeAchievements(normalizedActivities, stats);
  const goal = computeGoalProgress(normalizedActivities);
  const community = computeCommunitySnapshot(normalizedActivities, clubs ?? []);
  const racePortfolio = computeRacePortfolio(normalizedActivities);
  const gearInsights = computeGearInsights(gearDetails, normalizedActivities);

  const overview: StravaOverview = {
    athlete,
    spotlightActivity: normalizedActivities[0] ?? null,
    recentActivities: normalizedActivities.slice(0, 6),
    weeklyTrends,
    trainingHeatmap: heatmap.slice(-365),
    crossTraining,
    achievements,
    goal,
    community,
    racePortfolio: racePortfolio.slice(0, 10),
    gearInsights,
    stats,
    generatedAt: new Date().toISOString(),
    rateLimit: {
      shortTerm: fetchContext.rateLimitUsage,
      longTerm: fetchContext.rateLimitLimit,
    },
  };

  setCachedValue(CACHE_KEY, overview, stravaConfig.cacheTtlMs);
  return overview;
};

export const getSummaryDistanceKm = (stats: StravaStats | null): number => {
  if (!stats) return 0;
  return (
    formatDistanceKm(sumTotals(stats?.recent_ride_totals)) +
    formatDistanceKm(sumTotals(stats?.recent_run_totals)) +
    formatDistanceKm(sumTotals(stats?.recent_swim_totals))
  );
};
