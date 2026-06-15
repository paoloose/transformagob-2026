import { useAppStore } from "../../store/useAppStore";
import { STATIONS } from "../../data/stations";
import { useTranslation } from "react-i18next";

function getTideStatus() {
  const hour = new Date().getHours();
  if (hour < 6 || hour > 18) return "low";
  if (hour % 6 < 3) return "high";
  return "medium";
}

export function ZoneHeader() {
  const { currentStation } = useAppStore();
  const { t } = useTranslation();

  const station = STATIONS.find((s) => s.id === currentStation);

  if (!station) {
    return (
      <div className="zone-header">
        <p className="zone-header-label">Escanea un código QR para comenzar</p>
      </div>
    );
  }

  const tide = getTideStatus();

  return (
    <div className="zone-header">
      <div className="zone-header-station">
        <h2>{station.label}</h2>
        <span className="zone-header-tide">
          🌊 {t(`explorar.tide${tide.charAt(0).toUpperCase() + tide.slice(1)}`)}
        </span>
      </div>
    </div>
  );
}