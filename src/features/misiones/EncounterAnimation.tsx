import type { Bird } from "../../types/bird";
import { getBirdImage } from "../../data/birds";

interface EncounterAnimationProps {
  bird: Bird;
  onComplete: () => void;
}

export function EncounterAnimation({ bird, onComplete }: EncounterAnimationProps) {
  return (
    <div className="encounter-animation" onClick={onComplete}>
      <div className="encounter-flash" />
      <div className="encounter-card">
        <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
        <h2>¡{bird.common_name}!</h2>
      </div>
    </div>
  );
}