import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "./types";

type RecommendationCarouselProps = {
  recommendations: Recommendation[];
};

const RecommendationCarousel = ({ recommendations }: RecommendationCarouselProps) => {
  const loopedRecommendations = [...recommendations, ...recommendations];

  return (
    <div className="group relative overflow-hidden">
      <div className="flex gap-6 marquee-animate group-hover:[animation-play-state:paused]">
        {loopedRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={`${recommendation.id}-${index}`}
            recommendation={recommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationCarousel;
