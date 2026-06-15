import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { loadBirds } from "../../data/birds";
import { getSpottedBirds } from "../../data/detections";
import { SpeciesCard } from "../../components/SpeciesCard";
import type { Bird } from "../../types/bird";
import { useTranslation } from "react-i18next";

interface SpottedListProps {
  onSpeciesClick: (bird: Bird) => void;
}

export function SpottedList({ onSpeciesClick }: SpottedListProps) {
  const { currentStation } = useAppStore();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [spotted, setSpotted] = useState<Bird[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then((allBirds) => {
      setBirds(allBirds);
      if (currentStation) {
        setSpotted(getSpottedBirds(currentStation, allBirds));
      }
    });
  }, [currentStation]);

  if (!currentStation) {
    return <p className="spotted-empty">{t("explorar.noSpecies")}</p>;
  }

  return (
    <div className="spotted-section">
      <h3 className="spotted-title">{t("explorar.spottedNow")}</h3>
      <div className="spotted-list">
        {spotted.map((bird) => (
          <SpeciesCard
            key={bird.scientific_name}
            bird={bird}
            onClick={() => onSpeciesClick(bird)}
          />
        ))}
      </div>
    </div>
  );
}