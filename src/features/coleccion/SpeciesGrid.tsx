import { useState, useEffect } from "react";
import { loadBirds } from "../../data/birds";
import { useDiscoveries } from "../../store/useDiscoveries";
import { SpeciesCard } from "../../components/SpeciesCard";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import type { Bird } from "../../types/bird";

export function SpeciesGrid() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const { isDiscovered } = useDiscoveries();

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => setSelectedBird(null)}
        birds={birds}
      />
    );
  }

  return (
    <div className="species-grid">
      {birds.map((bird) => (
        <SpeciesCard
          key={bird.scientific_name}
          bird={bird}
          discovered={isDiscovered(bird.scientific_name)}
          onClick={() => isDiscovered(bird.scientific_name) && setSelectedBird(bird)}
        />
      ))}
    </div>
  );
}