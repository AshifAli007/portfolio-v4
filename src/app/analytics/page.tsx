import { fetchAnalyticsSummary, type AnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const StatCard = ({
  label,
  value,
  accent = "#89d3ce",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-lg backdrop-blur">
    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
      {label}
    </p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
  </div>
);

const ListCard = ({
  title,
  items,
  labelKey,
  countKey,
  accent = "#89d3ce",
}: {
  title: string;
  items: { [k: string]: string | number }[];
  labelKey: string;
  countKey: string;
  accent?: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-lg backdrop-blur">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
          {title}
        </p>
      </div>
    </div>
    <ul className="mt-4 space-y-3">
      {items.length === 0 && <li className="text-sm text-slate-400">No data yet.</li>}
      {items.map((item, idx) => (
        <li key={`${item[labelKey]}-${idx}`} className="flex items-center justify-between text-sm text-slate-100">
          <span className="truncate">{String(item[labelKey]) || "—"}</span>
          <span className="text-slate-300">{item[countKey]}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default async function AnalyticsPage() {
  const empty: AnalyticsSummary = {
    totalVisits: 0,
    coffeeClicks: 0,
    emailsSent: 0,
    totalProjectClicks: 0,
    mostVisitedPage: null,
    mostClickedProject: null,
    pageCounts: [],
    projectCounts: [],
  };

  let summary: AnalyticsSummary = empty;
  let note: string | null = null;
  try {
    summary = await fetchAnalyticsSummary();
  } catch (error) {
    console.error("Analytics page failed to load data", error);
    note = "Analytics backend not configured yet. Add Supabase env vars to enable live data.";
  }
  const accent = "#89d3ce";

  return (
    <div className="min-h-screen px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-white">Analytics</h1>
          <p className="text-sm text-slate-300">
            Traffic, engagement, and interaction stats pulled from Supabase events.
          </p>
          {note && <p className="text-xs text-amber-300">{note}</p>}
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total visits" value={summary.totalVisits} accent={accent} />
          <StatCard label="Coffee clicks" value={summary.coffeeClicks} accent={accent} />
          <StatCard label="Emails sent" value={summary.emailsSent} accent={accent} />
          <StatCard label="Project clicks" value={summary.totalProjectClicks} accent={accent} />
          <StatCard
            label="Top page"
            value={
              summary.mostVisitedPage
                ? `${summary.mostVisitedPage.page} (${summary.mostVisitedPage.count})`
                : "No data"
            }
            accent={accent}
          />
          <StatCard
            label="Top project"
            value={
              summary.mostClickedProject
                ? `${summary.mostClickedProject.target} (${summary.mostClickedProject.count})`
                : "No data"
            }
            accent={accent}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ListCard
            title="Page visits"
            items={summary.pageCounts}
            labelKey="page"
            countKey="count"
            accent={accent}
          />
          <ListCard
            title="Project clicks"
            items={summary.projectCounts}
            labelKey="target"
            countKey="count"
            accent={accent}
          />
        </div>
      </div>
    </div>
  );
}
