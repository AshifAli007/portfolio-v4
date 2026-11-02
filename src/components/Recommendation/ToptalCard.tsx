import { cardClassName } from "./RecommendationCard";
import TopTalentBadge from "./TopTalentBadge";

const ToptalCard = () => (
  <article
    aria-label="Toptal verification"
    className={`${cardClassName} md:max-w-none md:flex-row md:items-center md:justify-between md:gap-8`}
  >
    <div className="flex flex-col gap-3">
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-[#89d3ce]">Toptal</span>
        <span className="text-sm text-white/60">Verified Expert in Engineering</span>
        <span className="text-xs text-white/40">2025</span>
      </div>

      <p className="text-sm leading-relaxed text-slate-300">
        Verified by Toptal as an expert in engineering, and part of its network of the top 3% of
        freelance talent.
      </p>
    </div>

    {/* Scaled down so the card stays close to the height of its neighbours. */}
    <div className="flex flex-shrink-0 justify-center" style={{ zoom: 0.8 }}>
      <TopTalentBadge />
    </div>
  </article>
);

export default ToptalCard;
