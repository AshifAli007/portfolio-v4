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

  const [
    totalVisits,
    coffeeClicks,
    emailsSent,
    pageCountsRes,
    projectCountsRes,
    projectClicksCount,
  ] = await Promise.all([
    countByType("page_view"),
    countByType("coffee_click"),
    countByType("contact_submit"),
    supabase
      .from("analytics_events")
      .select("page, count:count()")
      .eq("event_type", "page_view")
      .not("page", "is", null)
      .group("page")
      .order("count", { ascending: false }),
    supabase
      .from("analytics_events")
      .select("target, count:count()")
      .eq("event_type", "project_click")
      .not("target", "is", null)
      .group("target")
      .order("count", { ascending: false }),
    countByType("project_click"),
  ]);

  if (pageCountsRes.error) throw pageCountsRes.error;
  if (projectCountsRes.error) throw projectCountsRes.error;

  const pageCounts = pageCountsRes.data ?? [];
  const projectCounts = projectCountsRes.data ?? [];

  return {
    totalVisits,
    coffeeClicks,
    emailsSent,
    totalProjectClicks: projectClicksCount,
    mostVisitedPage: pageCounts[0] ? { page: pageCounts[0].page, count: pageCounts[0].count } : null,
    mostClickedProject: projectCounts[0]
      ? { target: projectCounts[0].target, count: projectCounts[0].count }
      : null,
    pageCounts: pageCounts.map((row) => ({ page: row.page, count: row.count })),
    projectCounts: projectCounts.map((row) => ({ target: row.target, count: row.count })),
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
