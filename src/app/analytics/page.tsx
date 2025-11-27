import { fetchAnalyticsSummary, type AnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const accent = "#89d3ce";

type StatCardProps = {
  label: string;
  value: string | number;
  className?: string;
  footnote?: string;
};

const StatCard = ({ label, value, className, footnote }: StatCardProps) => (
  <div
    className={[
      "rounded-2xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-lg backdrop-blur",
      "flex flex-col gap-2",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
      {label}
    </p>
    <p className="text-3xl font-semibold text-white leading-none">{value}</p>
    {footnote ? <p className="text-xs text-slate-400">{footnote}</p> : null}
  </div>
);

type ListCardProps = {
  title: string;
  items: { [k: string]: string | number }[];
  labelKey: string;
  countKey: string;
  className?: string;
};

const ListCard = ({ title, items, labelKey, countKey, className }: ListCardProps) => (
  <div
    className={[
      "rounded-2xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-lg backdrop-blur",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
      {title}
    </p>
    <ul className="mt-3 space-y-3">
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

  let summary: AnalyticsSummary = empty;
  let note: string | null = null;
  try {
    summary = await fetchAnalyticsSummary();
  } catch (error) {
    console.error("Analytics page failed to load data", error);
    note = "Analytics backend not configured yet. Add Supabase env vars to enable live data.";
  }

  const formatAgo = (iso?: string | null) => {
    if (!iso) return "—";
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    if (Number.isNaN(diff) || diff < 0) return "just now";
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
    return `${years} year${years === 1 ? "" : "s"} ago`;
  };

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

        <div className="grid gap-4 md:grid-cols-6">
          <StatCard
            label="Total visits"
            value={summary.totalVisits}
            footnote={`Last: ${formatAgo(summary.lastEvents.page_view)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Emails sent"
            value={summary.emailsSent}
            footnote={`Last: ${formatAgo(summary.lastEvents.contact_submit)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Top page"
            value={
              summary.mostVisitedPage
                ? `${summary.mostVisitedPage.page} (${summary.mostVisitedPage.count})`
                : "No data"
            }
            footnote={`Last: ${formatAgo(summary.lastEvents.page_view)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Coffee clicks"
            value={summary.coffeeClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.coffee_click)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Resume clicks"
            value={summary.resumeClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.resume_click)}`}
            className="md:col-span-1"
          />
          <StatCard
            label="Social clicks"
            value={summary.totalSocialClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.social_click)}`}
            className="md:col-span-1"
          />
          <StatCard
            label="Project clicks"
            value={summary.totalProjectClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.project_click)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Top project"
            value={
              summary.mostClickedProject
                ? `${summary.mostClickedProject.target} (${summary.mostClickedProject.count})`
                : "No data"
            }
            footnote={`Last: ${formatAgo(summary.lastEvents.project_click)}`}
            className="md:col-span-2"
          />
          <StatCard
            label="Recommendations"
            value={summary.recommendationClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.recommendation_click)}`}
            className="md:col-span-1"
          />
          <StatCard
            label="Spotify clicks"
            value={summary.totalSpotifyClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.spotify_click)}`}
            className="md:col-span-1"
          />
          <StatCard
            label="Monkeytype clicks"
            value={summary.monkeytypeClicks}
            footnote={`Last: ${formatAgo(summary.lastEvents.monkeytype_click)}`}
            className="md:col-span-1"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <ListCard
            title="Page visits"
            items={summary.pageCounts}
            labelKey="page"
            countKey="count"
            className="lg:col-span-6"
          />
          <ListCard
            title="Project clicks"
            items={summary.projectCounts}
            labelKey="target"
            countKey="count"
            className="lg:col-span-6"
          />
          <ListCard
            title="Social icon clicks"
            items={summary.socialCounts}
            labelKey="target"
            countKey="count"
            className="lg:col-span-4"
          />
          <ListCard
            title="Spotify clicks"
            items={summary.spotifyCounts}
            labelKey="target"
            countKey="count"
            className="lg:col-span-4"
          />
          <ListCard
            title="Recommendations"
            items={summary.recommendationCounts}
            labelKey="target"
            countKey="count"
            className="lg:col-span-4"
          />
          <ListCard
            title="Monkeytype"
            items={summary.monkeytypeCounts}
            labelKey="target"
            countKey="count"
            className="lg:col-span-4"
          />
        </div>
      </div>
    </div>
  );
}
