import { useState, useEffect } from "react";
import { ZoneHeader } from "./ZoneHeader";
import { CameraFeed } from "./CameraFeed";
import { SpottedList } from "./SpottedList";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import { MapView } from "../../components/MapView";
import { loadBirds } from "../../data/birds";
import type { Bird } from "../../types/bird";

export function ExplorarPage() {
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  if (selectedBird) {
    return <SpeciesDetail bird={selectedBird} onBack={() => setSelectedBird(null)} birds={birds} />;
  }

  return (
    <div className="page explorar-page">
      <ZoneHeader />
      <CameraFeed />
      <MapView />
      <SpottedList onSpeciesClick={setSelectedBird} />
    </div>
  );
}