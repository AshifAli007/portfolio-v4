export type StravaAthlete = {
  id: number;
  username?: string;
  firstname: string;
  lastname: string;
  city?: string;
  country?: string;
  bio?: string;
  profile?: string;
  follower_count?: number;
  friend_count?: number;
  measurement_preference?: "feet" | "meters";
  weight?: number;
};

export type StravaMap = {
  id?: string;
  summary_polyline?: string;
};

export type StravaActivity = {
  id: number;
  name: string;
  type?: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset?: number;
  map?: StravaMap;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  average_watts?: number;
  max_watts?: number;
  weighted_average_watts?: number;
  kudos_count?: number;
  comment_count?: number;
  achievement_count?: number;
  pr_count?: number;
  vanity_metrics?: unknown;
  workout_type?: number | null;
  gear_id?: string | null;
  calories?: number;
  has_heartrate?: boolean;
};

export type StravaStatsTotal = {
  count: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  achievement_count?: number;
};

export type StravaStats = {
  biggest_ride_distance?: number;
  biggest_climb_elevation_gain?: number;
  recent_ride_totals?: StravaStatsTotal;
  recent_run_totals?: StravaStatsTotal;
  recent_swim_totals?: StravaStatsTotal;
  ytd_ride_totals?: StravaStatsTotal;
  ytd_run_totals?: StravaStatsTotal;
  ytd_swim_totals?: StravaStatsTotal;
  all_ride_totals?: StravaStatsTotal;
  all_run_totals?: StravaStatsTotal;
  all_swim_totals?: StravaStatsTotal;
};

export type StravaClub = {
  id: number;
  name: string;
  sport_type: string;
  city?: string;
  country?: string;
  member_count?: number;
  url?: string;
  profile?: string;
  profile_medium?: string;
};

export type StravaGear = {
  id: string;
  name: string;
  resource_state?: number;
  distance?: number;
  converted_distance?: number;
  brand_name?: string;
  model_name?: string;
  description?: string;
  primary?: boolean;
  retired?: boolean;
};

export type NormalizedActivity = {
  id: number;
  name: string;
  sportType: string;
  startDate: string;
  startDateLocal: string;
  distanceKm: number;
  movingTimeSec: number;
  elapsedTimeSec: number;
  elevationGainM: number;
  averageSpeedMps?: number;
  averagePaceSecPerKm?: number;
  averageHeartrate?: number;
  maxHeartrate?: number;
  kudosCount?: number;
  achievementCount?: number;
  mapPolyline?: string;
  isRace: boolean;
  gearId?: string | null;
  externalUrl: string;
  calories?: number;
};

export type ActivityTrendPoint = {
  weekStart: string;
  totalDistanceKm: number;
  totalMovingTimeSec: number;
  totalElevationGainM: number;
  activityCount: number;
};

export type TrainingDay = {
  date: string;
  distanceKm: number;
  movingTimeSec: number;
  activityCount: number;
};

export type CrossTrainingBreakdown = {
  sportType: string;
  totalDistanceKm: number;
  totalMovingTimeSec: number;
  activityCount: number;
  percentage: number;
};

export type AchievementHighlight = {
  label: string;
  description: string;
  activityId?: number;
  metric?: string;
};

export type GoalProgress = {
  label: string;
  targetDistanceKm: number;
  period: "weekly" | "monthly" | "custom";
  startDate: string;
  targetDate?: string;
  currentDistanceKm: number;
  remainingDistanceKm: number;
  percentage: number;
  averagePaceForPeriodSec?: number;
};

export type GearInsight = {
  id: string;
  name: string;
  brandName?: string;
  modelName?: string;
  distanceKm: number;
  convertedDistanceKm?: number;
  description?: string;
  primary: boolean;
  sportTypes: string[];
};

export type CommunitySnapshot = {
  kudosReceived: number;
  commentsReceived: number;
  activityCount: number;
  clubCount: number;
  topClubs: Array<{
    id: number;
    name: string;
    sportType: string;
    memberCount?: number;
    url?: string;
  }>;
};

export type StravaOverview = {
  athlete: StravaAthlete | null;
  spotlightActivity: NormalizedActivity | null;
  recentActivities: NormalizedActivity[];
  weeklyTrends: ActivityTrendPoint[];
  trainingHeatmap: TrainingDay[];
  crossTraining: CrossTrainingBreakdown[];
  achievements: AchievementHighlight[];
  goal: GoalProgress | null;
  community: CommunitySnapshot;
  racePortfolio: NormalizedActivity[];
  gearInsights: GearInsight[];
  stats: StravaStats | null;
  generatedAt: string;
  rateLimit?: {
    shortTerm?: string;
    longTerm?: string;
  };
};
