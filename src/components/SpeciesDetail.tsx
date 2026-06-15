import type { Bird } from "../types/bird";
import { getBirdImage, getBirdModelPath, getBirdAudioPath } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";
import { SeasonalityBadge } from "./SeasonalityBadge";
import { AudioPlayer } from "./AudioPlayer";
import { ARViewer } from "./ARViewer";
import { BirdCamera } from "../features/misiones/BirdCamera";
import { EncounterAnimation } from "../features/misiones/EncounterAnimation";
import { useDiscoveries } from "../store/useDiscoveries";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface SpeciesDetailProps {
  bird: Bird;
  onBack: () => void;
  birds: Bird[];
}

export function SpeciesDetail({ bird, onBack }: SpeciesDetailProps) {
  const { addDiscovery, isDiscovered } = useDiscoveries();
  const { currentStation } = useAppStore();
  const { t } = useTranslation();
  const discovered = isDiscovered(bird.scientific_name);
  const modelPath = getBirdModelPath(bird);
  const audioPath = getBirdAudioPath(bird);
  const [showAR, setShowAR] = useState(false);
  const [cameraMode, setCameraMode] = useState<null | "photo" | "video">(null);
  const [showEncounter, setShowEncounter] = useState(false);

  const handleCapture = (_photoUrl: string) => {
    setCameraMode(null);
    if (!isDiscovered(bird.scientific_name) && currentStation) {
      addDiscovery(bird.scientific_name, currentStation);
      setShowEncounter(true);
    }
  };

  if (showEncounter) {
    return (
      <EncounterAnimation
        bird={bird}
        onComplete={() => setShowEncounter(false)}
      />
    );
  }

  if (showAR) {
    return <ARViewer modelUrl={modelPath} onClose={() => setShowAR(false)} />;
  }

  if (cameraMode) {
    return (
      <BirdCamera
        onCapture={handleCapture}
        onClose={() => setCameraMode(null)}
        mode={cameraMode}
      />
    );
  }

  return (
    <div className="species-detail">
      <button className="back-btn" onClick={onBack} type="button">
        ← {t("tabs.explorar")}
      </button>

      <div className="species-detail-hero">
        <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
      </div>

      <div className="species-detail-photos">
        {bird.images.slice(1, 5).map((img, i) => (
          <img key={i} src={`/db/images/${img}`} alt="" loading="lazy" />
        ))}
      </div>

      <button
        className="ar-btn"
        onClick={() => setShowAR(true)}
        type="button"
      >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          {t("species.viewModel")}
        </button>

      <div className="species-detail-info">
        <h1>{bird.common_name}</h1>
        <p className="scientific-name">{bird.scientific_name}</p>

        <div className="species-detail-badges">
          <ConservationBadge status={bird.iucn_status} showLabel />
          <SeasonalityBadge seasonality={bird.seasonality} />
          {bird.cites_appendix && (
            <span className="cites-badge">CITES {bird.cites_appendix}</span>
          )}
        </div>

        <div className="species-detail-stats">
          <div><strong>{t("species.size")}:</strong> {bird.size}</div>
          <div><strong>{t("species.weight")}:</strong> {bird.weight}</div>
        </div>

        {bird.distribution && (
          <div className="species-detail-section">
            <h3>{t("species.distribution")}</h3>
            <p>{bird.distribution}</p>
          </div>
        )}

        <div className="species-detail-section">
          <h3>Descripción</h3>
          <p>{bird.description}</p>
        </div>

        {bird.male_plumage && (
          <div className="species-detail-section">
            <h3>{t("species.malePlumage")}</h3>
            <p>{bird.male_plumage}</p>
          </div>
        )}

        {bird.female_plumage && (
          <div className="species-detail-section">
            <h3>{t("species.femalePlumage")}</h3>
            <p>{bird.female_plumage}</p>
          </div>
        )}

        <AudioPlayer src={audioPath} label={t("species.playSound")} />

        {!discovered && (
          <div className="discover-actions">
            <button className="discover-btn discover-btn-photo" type="button" onClick={() => setCameraMode("photo")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              {t("explorar.discoverPhoto")}
            </button>
            <button className="discover-btn discover-btn-record" type="button" onClick={() => setCameraMode("video")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
              {t("explorar.discoverRecord")}
            </button>
          </div>
        )}

        {discovered && (
          <div className="discovered-label">{t("explorar.discovered")}</div>
        )}
      </div>
    </div>
  );
}