import { AuthControls } from "./AuthControls";
import { LanguageToggle } from "./LanguageToggle";
import { StatsSection } from "./StatsSection";
import { useTranslation } from "react-i18next";

export function PerfilPage() {
  const { t } = useTranslation();

  return (
    <div className="page perfil-page">
      <AuthControls />
      <LanguageToggle />
      <StatsSection />
      <div className="about-section">
        <h3>{t("perfil.about")}</h3>
        <p>{t("perfil.aboutText")}</p>
      </div>
    </div>
  );
}