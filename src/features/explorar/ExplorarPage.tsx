import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ZoneHeader } from "./ZoneHeader";
import { CameraFeed } from "./CameraFeed";
import { SpottedList } from "./SpottedList";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import { MapView } from "../../components/MapView";
import { loadBirds } from "../../data/birds";
import type { Bird } from "../../types/bird";
import { useAppStore } from "../../store/useAppStore";

export function ExplorarPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const birdQuery = searchParams.get("bird");

  const [birds, setBirds] = useState<Bird[]>([]);
  const { currentStation } = useAppStore();

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  const selectedBird = birds.find(b => b.scientific_name === birdQuery) || null;

  const handleSpeciesClick = (bird: Bird) => {
    navigate(`?bird=${encodeURIComponent(bird.scientific_name)}`);
  };

  if (selectedBird) {
    return <SpeciesDetail bird={selectedBird} onBack={() => navigate(-1)} birds={birds} />;
  }

  return (
    <div className="explorar-page">
      <ZoneHeader />
      <div className="explorar-scroll">
        <MapView />
        {currentStation && <CameraFeed />}
        <SpottedList onSpeciesClick={handleSpeciesClick} />
      </div>
    </div>
  );
}