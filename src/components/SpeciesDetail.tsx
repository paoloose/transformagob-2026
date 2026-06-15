import type { Bird } from "../types/bird";
import { getBirdImage, getBirdModelPath, getBirdAudioPath } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";
import { SeasonalityBadge } from "./SeasonalityBadge";
import { AudioPlayer } from "./AudioPlayer";
import { Model3DViewer } from "./Model3DViewer";
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
  const [showModel, setShowModel] = useState(false);

  const handleDiscover = () => {
    if (!discovered && currentStation) {
      addDiscovery(bird.scientific_name, currentStation);
    }
  };

  return (
    <div className="species-detail">
      <button className="back-btn" onClick={onBack} type="button">
        ← {t("tabs.explorar")}
      </button>

      <div className="species-detail-hero">
        <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
      </div>

      {modelPath && (
        <div className="species-detail-model-toggle">
          <button
            className="toggle-btn"
            onClick={() => setShowModel(!showModel)}
            type="button"
          >
            {showModel ? t("species.viewPhotos") : t("species.viewModel")}
          </button>
        </div>
      )}

      {showModel && modelPath ? (
        <Model3DViewer modelUrl={modelPath} />
      ) : (
        <div className="species-detail-photos">
          {bird.images.slice(1, 5).map((img, i) => (
            <img key={i} src={`/db/images/${img}`} alt="" loading="lazy" />
          ))}
        </div>
      )}

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

        {audioPath && (
          <AudioPlayer src={audioPath} label={t("species.playSound")} />
        )}

        {!discovered && (
          <button className="discover-btn" onClick={handleDiscover} type="button">
            {t("explorar.discover")}
          </button>
        )}

        {discovered && (
          <div className="discovered-label">{t("explorar.discovered")}</div>
        )}
      </div>
    </div>
  );
}