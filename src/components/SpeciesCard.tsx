import type { Bird } from "../types/bird";
import { getBirdImage } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";

interface SpeciesCardProps {
  bird: Bird;
  onClick?: () => void;
  discovered?: boolean;
  showInfo?: boolean;
}

export function SpeciesCard({ bird, onClick, discovered = true, showInfo = false }: SpeciesCardProps) {
  return (
    <button
      className={`species-card ${!discovered ? "undiscovered" : ""}`}
      onClick={onClick}
      type="button"
      disabled={!discovered}
    >
      <div className="species-card-image">
        {discovered ? (
          <img src={getBirdImage(bird, 0)} alt={bird.common_name} loading="lazy" />
        ) : (
          <img
            src={getBirdImage(bird, 0)}
            alt=""
            loading="lazy"
            className="species-card-blurred"
          />
        )}
      </div>
      <div className="species-card-info">
        <span className="species-card-name">
          {discovered ? bird.common_name : "???"}
        </span>
        {discovered && showInfo && (
          <div className="species-card-meta">
            <span className="species-card-scientific">{bird.scientific_name}</span>
            <span className="species-card-size">{bird.size}</span>
          </div>
        )}
        {discovered && <ConservationBadge status={bird.iucn_status} />}
      </div>
    </button>
  );
}