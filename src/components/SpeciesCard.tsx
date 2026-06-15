import type { Bird } from "../types/bird";
import { getBirdImage } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";

interface SpeciesCardProps {
  bird: Bird;
  onClick?: () => void;
  discovered?: boolean;
}

export function SpeciesCard({ bird, onClick, discovered = true }: SpeciesCardProps) {
  return (
    <button className="species-card" onClick={onClick} type="button">
      <div className="species-card-image">
        {discovered ? (
          <img src={getBirdImage(bird, 0)} alt={bird.common_name} loading="lazy" />
        ) : (
          <div className="species-card-silhouette">?</div>
        )}
      </div>
      <div className="species-card-info">
        <span className="species-card-name">
          {discovered ? bird.common_name : "???"}
        </span>
        {discovered && <ConservationBadge status={bird.iucn_status} />}
      </div>
    </button>
  );
}