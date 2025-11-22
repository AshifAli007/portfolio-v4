import RecommendationCarousel from "./RecommendationCarousel";
import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "./types";
import recommendations from "@/data/recommendations";

const PROFILE_URL = "https://www.linkedin.com/in/mohammad-ashif-cv/";

const Recommendations = () => {
  const hasCarousel = recommendations.length > 2;

  const renderContent = (items: Recommendation[]) => {
    if (hasCarousel) {
      return <RecommendationCarousel recommendations={items} />;
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    );
  };

  return (
    <section aria-label="LinkedIn recommendations" className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Recommendations</h2>
            <p className="text-sm text-white/60">
              What teammates and collaborators say about me.
            </p>
          </div>
        </div>

        <div className="mt-8">{renderContent(recommendations)}</div>

        <div className="mt-10 flex justify-end">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce]"
          >
            View all on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
