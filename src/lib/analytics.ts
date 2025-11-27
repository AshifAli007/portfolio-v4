import { getSupabaseServerClient } from "./supabaseServer";

export type EventType =
  | "page_view"
  | "coffee_click"
  | "contact_submit"
  | "project_click"
  | "resume_click"
  | "social_click"
  | "recommendation_click"
  | "spotify_click"
  | "monkeytype_click";

export type AnalyticsSummary = {
  totalVisits: number;
  coffeeClicks: number;
  emailsSent: number;
  totalProjectClicks: number;
  resumeClicks: number;
  totalSocialClicks: number;
  recommendationClicks: number;
  totalSpotifyClicks: number;
  monkeytypeClicks: number;
  lastEvents: Partial<Record<EventType, string | null>>;
  mostVisitedPage: { page: string; count: number } | null;
  mostClickedProject: { target: string; count: number } | null;
  pageCounts: { page: string; count: number }[];
  projectCounts: { target: string; count: number }[];
  socialCounts: { target: string; count: number }[];
  spotifyCounts: { target: string; count: number }[];
  recommendationCounts: { target: string; count: number }[];
  monkeytypeCounts: { target: string; count: number }[];
};

const mockSummary: AnalyticsSummary = {
  totalVisits: 0,
  coffeeClicks: 0,
  emailsSent: 0,
  totalProjectClicks: 0,
  resumeClicks: 0,
  totalSocialClicks: 0,
  recommendationClicks: 0,
  totalSpotifyClicks: 0,
  monkeytypeClicks: 0,
  lastEvents: {},
  mostVisitedPage: null,
  mostClickedProject: null,
  pageCounts: [],
  projectCounts: [],
  socialCounts: [],
  spotifyCounts: [],
  recommendationCounts: [],
  monkeytypeCounts: [],
};

export async function recordEvent(event: {
  eventType: EventType;
  page?: string | null;
  target?: string | null;
  meta?: Record<string, unknown>;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { ok: true, mocked: true };

  const payload = {
    event_type: event.eventType,
    page: event.page ?? null,
    target: event.target ?? null,
    meta: event.meta ?? null,
  };

  const { error } = await supabase.from("analytics_events").insert(payload);
  if (error) throw error;
  return { ok: true };
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockSummary;

  const [
    totalVisits,
    coffeeClicks,
    emailsSent,
    projectClicksCount,
    resumeClicks,
    socialClicks,
    recommendationClicks,
    spotifyClicks,
    monkeytypeClicks,
    lastPageView,
    lastCoffee,
    lastContact,
    lastProject,
    lastResume,
    lastSocial,
    lastRecommendation,
    lastSpotify,
    lastMonkeytype,
  ] = await Promise.all([
    countByType("page_view"),
    countByType("coffee_click"),
    countByType("contact_submit"),
    countByType("project_click"),
    countByType("resume_click"),
    countByType("social_click"),
    countByType("recommendation_click"),
    countByType("spotify_click"),
    countByType("monkeytype_click"),
    fetchLastTimestamp("page_view"),
    fetchLastTimestamp("coffee_click"),
    fetchLastTimestamp("contact_submit"),
    fetchLastTimestamp("project_click"),
    fetchLastTimestamp("resume_click"),
    fetchLastTimestamp("social_click"),
    fetchLastTimestamp("recommendation_click"),
    fetchLastTimestamp("spotify_click"),
    fetchLastTimestamp("monkeytype_click"),
  ]);

  const pageCounts = await fetchGroupedCounts("page_view", "page");
  const projectCounts = await fetchGroupedCounts("project_click", "target");
  const socialCounts = await fetchGroupedCounts("social_click", "target");
  const spotifyCounts = await fetchGroupedCounts("spotify_click", "target");
  const recommendationCounts = await fetchGroupedCounts("recommendation_click", "target");
  const monkeytypeCounts = await fetchGroupedCounts("monkeytype_click", "target");

  const mostVisitedPage = pageCounts[0] ? { page: pageCounts[0].label, count: pageCounts[0].count } : null;
  const mostClickedProject = projectCounts[0]
    ? { target: projectCounts[0].label, count: projectCounts[0].count }
    : null;

  return {
    totalVisits,
    coffeeClicks,
    emailsSent,
    totalProjectClicks: projectClicksCount,
    resumeClicks,
    totalSocialClicks: socialClicks,
    recommendationClicks,
    totalSpotifyClicks: spotifyClicks,
    monkeytypeClicks,
    lastEvents: {
      page_view: lastPageView,
      coffee_click: lastCoffee,
      contact_submit: lastContact,
      project_click: lastProject,
      resume_click: lastResume,
      social_click: lastSocial,
      recommendation_click: lastRecommendation,
      spotify_click: lastSpotify,
      monkeytype_click: lastMonkeytype,
    },
    mostVisitedPage,
    mostClickedProject,
    pageCounts: pageCounts.map((row) => ({ page: row.label, count: row.count })),
    projectCounts: projectCounts.map((row) => ({ target: row.label, count: row.count })),
    socialCounts: socialCounts.map((row) => ({ target: row.label, count: row.count })),
    spotifyCounts: spotifyCounts.map((row) => ({ target: row.label, count: row.count })),
    recommendationCounts: recommendationCounts.map((row) => ({ target: row.label, count: row.count })),
    monkeytypeCounts: monkeytypeCounts.map((row) => ({ target: row.label, count: row.count })),
  };
}

async function countByType(eventType: EventType): Promise<number> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("analytics_events")
    .select("*", { head: true, count: "exact" })
    .eq("event_type", eventType);
  if (error) throw error;
  return count ?? 0;
}

async function fetchGroupedCounts(
  eventType: EventType,
  field: "page" | "target",
): Promise<{ label: string; count: number }[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("analytics_events")
    .select(field)
    .eq("event_type", eventType)
    .not(field, "is", null);

  if (error) throw error;
  if (!Array.isArray(data)) return [];

  const counts = data.reduce<Map<string, number>>((map, row) => {
    const key = (row as Record<string, string | null>)[field];
    if (!key) return map;
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map());

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

async function fetchLastTimestamp(eventType: EventType): Promise<string | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("analytics_events")
    .select("created_at")
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const ts = data?.created_at;
  return typeof ts === "string" ? ts : null;
}
