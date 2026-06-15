import { useAppStore } from "../../store/useAppStore";
import { STATIONS } from "../../data/stations";
import { useTranslation } from "react-i18next";
import type { StationId } from "../../types/station";

function getTideStatus() {
  const hour = new Date().getHours();
  if (hour < 6 || hour > 18) return "low";
  if (hour % 6 < 3) return "high";
  return "medium";
}

export function ZoneHeader() {
  const { currentStation, setCurrentStation } = useAppStore();
  const { t } = useTranslation();

  const station = STATIONS.find((s) => s.id === currentStation);
  const tide = getTideStatus();

  const handleStationSelect = (id: StationId) => {
    setCurrentStation(id);
    const url = new URL(window.location.href);
    url.searchParams.set("zone", id);
    window.history.replaceState({}, "", url.toString());
  };

  if (!station) {
    return (
      <div className="zone-header">
        <h2>{t("explorar.selectStation")}</h2>
        <div className="zone-selector">
          {STATIONS.map((s) => (
            <button
              key={s.id}
              className="zone-selector-btn"
              onClick={() => handleStationSelect(s.id)}
              type="button"
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="zone-header">
      <div className="zone-header-station">
        <div className="zone-header-title-row">
          <h2>{station.label}</h2>
          <button
            className="zone-change-btn"
            onClick={() => setCurrentStation(null)}
            type="button"
          >
            {t("explorar.changeStation")}
          </button>
        </div>
        <span className="zone-header-tide">
          🌊 {t(`explorar.tide${tide.charAt(0).toUpperCase() + tide.slice(1)}`)}
        </span>
      </div>
    </div>
  );
}