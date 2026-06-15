import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useDiscoveries } from "../../store/useDiscoveries";
import { loadBirds, getBirdImage } from "../../data/birds";
import { getSpottedBirds } from "../../data/detections";
import { BirdCamera } from "./BirdCamera";
import { EncounterAnimation } from "./EncounterAnimation";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import type { Bird } from "../../types/bird";
import { useTranslation } from "react-i18next";

export function ModoExplorador() {
  const { currentStation } = useAppStore();
  const { addDiscovery, isDiscovered } = useDiscoveries();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [nearby, setNearby] = useState<Bird[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [encounterBird, setEncounterBird] = useState<Bird | null>(null);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then((allBirds) => {
      setBirds(allBirds);
      if (currentStation) {
        setNearby(getSpottedBirds(currentStation, allBirds));
      }
    });
  }, [currentStation]);

  const handleCapture = () => {
    setCameraOpen(false);
    setIdentifying(true);
    setTimeout(() => {
      const randomBird = nearby[Math.floor(Math.random() * nearby.length)];
      if (randomBird) {
        setEncounterBird(randomBird);
        if (!isDiscovered(randomBird.scientific_name) && currentStation) {
          addDiscovery(randomBird.scientific_name, currentStation);
        }
      }
      setIdentifying(false);
    }, 2000);
  };

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => setSelectedBird(null)}
        birds={birds}
      />
    );
  }

  if (cameraOpen) {
    return <BirdCamera onCapture={handleCapture} onClose={() => setCameraOpen(false)} />;
  }

  if (identifying) {
    return (
      <div className="identifying-screen">
        <div className="identifying-spinner" />
        <p>{t("misiones.identifying")}</p>
      </div>
    );
  }

  if (encounterBird) {
    return (
      <EncounterAnimation
        bird={encounterBird}
        onComplete={() => {
          setSelectedBird(encounterBird);
          setEncounterBird(null);
        }}
      />
    );
  }

  return (
    <div className="modo-explorador">
      <h3>{t("misiones.nearbySpecies")}</h3>
      <div className="nearby-grid">
        {nearby.map((bird) => (
          <button
            key={bird.scientific_name}
            className="nearby-thumb"
            onClick={() => setSelectedBird(bird)}
            type="button"
          >
            <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
            <span>{bird.common_name}</span>
          </button>
        ))}
      </div>
      <button
        className="open-camera-btn"
        onClick={() => setCameraOpen(true)}
        type="button"
      >
        📷 {t("misiones.openCamera")}
      </button>
    </div>
  );
}