import type { IucnStatus } from "../types/bird";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<IucnStatus, string> = {
  LC: "var(--iucn-lc)",
  NT: "var(--iucn-nt)",
  VU: "var(--iucn-vu)",
  EN: "var(--iucn-en)",
  CR: "var(--iucn-cr)",
  DD: "var(--gray-500)",
  NE: "var(--gray-500)",
};

interface ConservationBadgeProps {
  status: IucnStatus;
  showLabel?: boolean;
}

export function ConservationBadge({ status, showLabel = false }: ConservationBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className="conservation-badge"
      style={{ backgroundColor: STATUS_COLORS[status] }}
      title={t(`iucn.${status}`)}
    >
      {status}
      {showLabel && <span className="badge-label">{t(`iucn.${status}`)}</span>}
    </span>
  );
}