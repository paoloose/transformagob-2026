import type { Seasonality } from "../types/bird";
import { useTranslation } from "react-i18next";

interface SeasonalityBadgeProps {
  seasonality: Seasonality;
}

export function SeasonalityBadge({ seasonality }: SeasonalityBadgeProps) {
  const { t } = useTranslation();
  return <span className="seasonality-badge">{t(`seasonality.${seasonality}`)}</span>;
}