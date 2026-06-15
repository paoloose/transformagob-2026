import { useDiscoveries } from "../../store/useDiscoveries";
import { BADGES } from "../../types/badge";
import { useTranslation } from "react-i18next";

export function StatsSection() {
  const { getDiscoveredBirdIds } = useDiscoveries();
  const { t } = useTranslation();
  const discoveredIds = getDiscoveredBirdIds();
  const earnedBadges = BADGES.filter((b) => b.condition(discoveredIds));

  return (
    <div className="stats-section">
      <h3>{t("perfil.stats")}</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{discoveredIds.length}</span>
          <span className="stat-label">{t("perfil.speciesDiscovered")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{earnedBadges.length}</span>
          <span className="stat-label">{t("perfil.badgesEarned")}</span>
        </div>
      </div>
    </div>
  );
}