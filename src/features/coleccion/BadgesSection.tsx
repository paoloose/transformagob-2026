import { BADGES } from "../../types/badge";
import { useDiscoveries } from "../../store/useDiscoveries";
import { useTranslation } from "react-i18next";

export function BadgesSection() {
  const { getDiscoveredBirdIds } = useDiscoveries();
  const { t, i18n } = useTranslation();
  const discoveredIds = getDiscoveredBirdIds();
  const isEn = i18n.language === "en";

  return (
    <div className="badges-section">
      <h3>{t("coleccion.badges")}</h3>
      <div className="badges-grid">
        {BADGES.map((badge) => {
          const earned = badge.condition(discoveredIds);
          return (
            <div key={badge.id} className={`badge-item ${earned ? "earned" : "locked"}`}>
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">
                {isEn ? badge.nameEn : badge.nameEs}
              </span>
              <span className="badge-desc">
                {isEn ? badge.descriptionEn : badge.descriptionEs}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}