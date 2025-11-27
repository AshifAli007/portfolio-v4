import { getSupabaseServerClient } from "./supabaseServer";

export type EventType = "page_view" | "coffee_click" | "contact_submit" | "project_click";

export type AnalyticsSummary = {
  totalVisits: number;
  coffeeClicks: number;
  emailsSent: number;
  totalProjectClicks: number;
  mostVisitedPage: { page: string; count: number } | null;
  mostClickedProject: { target: string; count: number } | null;
  pageCounts: { page: string; count: number }[];
  projectCounts: { target: string; count: number }[];
};

const mockSummary: AnalyticsSummary = {
  totalVisits: 0,
  coffeeClicks: 0,
  emailsSent: 0,
  totalProjectClicks: 0,
  mostVisitedPage: null,
  mostClickedProject: null,
  pageCounts: [],
  projectCounts: [],
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

  const [totalVisits, coffeeClicks, emailsSent, projectClicksCount] = await Promise.all([
    countByType("page_view"),
    countByType("coffee_click"),
    countByType("contact_submit"),
    countByType("project_click"),
  ]);

  const pageCounts = await fetchGroupedCounts("page_view", "page");
  const projectCounts = await fetchGroupedCounts("project_click", "target");

  const mostVisitedPage = pageCounts[0] ? { page: pageCounts[0].label, count: pageCounts[0].count } : null;
  const mostClickedProject = projectCounts[0]
    ? { target: projectCounts[0].label, count: projectCounts[0].count }
    : null;

  return {
    totalVisits,
    coffeeClicks,
    emailsSent,
    totalProjectClicks: projectClicksCount,
    mostVisitedPage,
    mostClickedProject,
    pageCounts: pageCounts.map((row) => ({ page: row.label, count: row.count })),
    projectCounts: projectCounts.map((row) => ({ target: row.label, count: row.count })),
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
