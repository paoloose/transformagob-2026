import { useDiscoveries } from "../../store/useDiscoveries";
import { useTranslation } from "react-i18next";

const TOTAL_SPECIES = 63;

export function ProgressTracker() {
  const { discoveries } = useDiscoveries();
  const { t } = useTranslation();
  const count = discoveries.length;
  const pct = Math.round((count / TOTAL_SPECIES) * 100);

  return (
    <div className="progress-tracker">
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p>
        {t("coleccion.progress", { discovered: count, total: TOTAL_SPECIES })}
      </p>
    </div>
  );
}