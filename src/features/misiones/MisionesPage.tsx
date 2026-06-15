import { useState } from "react";
import { ModoExplorador } from "./ModoExplorador";
import { BuscaTuAve } from "./BuscaTuAve";
import { useTranslation } from "react-i18next";

type MissionMode = "explorador" | "busca";

export function MisionesPage() {
  const [mode, setMode] = useState<MissionMode>("explorador");
  const { t } = useTranslation();

  return (
    <div className="page misiones-page">
      <div className="mission-tabs">
        <button
          className={`mission-tab ${mode === "explorador" ? "active" : ""}`}
          onClick={() => setMode("explorador")}
          type="button"
        >
          🔍 {t("misiones.modoExplorador")}
        </button>
        <button
          className={`mission-tab ${mode === "busca" ? "active" : ""}`}
          onClick={() => setMode("busca")}
          type="button"
        >
          🦜 {t("misiones.buscaTuAve")}
        </button>
      </div>
      {mode === "explorador" ? <ModoExplorador /> : <BuscaTuAve />}
    </div>
  );
}