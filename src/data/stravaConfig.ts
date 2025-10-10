export type StravaGoalConfig = {
  label: string;
  targetDistanceKm: number;
  period: "weekly" | "monthly" | "custom";
  startDate?: string;
  targetDate?: string;
};

export const stravaGoalConfig: StravaGoalConfig | null = {
  label: "Ride 250 miles this month",
  targetDistanceKm: 402,
  period: "monthly",
};
