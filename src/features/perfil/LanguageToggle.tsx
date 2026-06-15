import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-toggle">
      <label>{t("perfil.language")}</label>
      <div className="toggle-group">
        <button
          className={`toggle-opt ${i18n.language === "es" || (i18n.language !== "en") ? "active" : ""}`}
          onClick={() => i18n.changeLanguage("es")}
          type="button"
        >
          ES
        </button>
        <button
          className={`toggle-opt ${i18n.language === "en" ? "active" : ""}`}
          onClick={() => i18n.changeLanguage("en")}
          type="button"
        >
          EN
        </button>
      </div>
    </div>
  );
}