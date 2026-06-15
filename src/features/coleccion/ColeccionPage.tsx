import { SpeciesGrid } from "./SpeciesGrid";
import { BadgesSection } from "./BadgesSection";
import { ProgressTracker } from "./ProgressTracker";
import { useTranslation } from "react-i18next";

export function ColeccionPage() {
  const { t } = useTranslation();

  return (
    <div className="page coleccion-page">
      <h2 className="coleccion-title">{t("coleccion.title")}</h2>
      <ProgressTracker />
      <SpeciesGrid />
      <BadgesSection />
    </div>
  );
}