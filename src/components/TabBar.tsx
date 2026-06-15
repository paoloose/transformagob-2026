import { useTranslation } from "react-i18next";
import type { TabId } from "../store/useAppStore";
import telescopeIcon from "../../public/telescope.png";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const svgTabs: { id: TabId; iconPath: string }[] = [
  {
    id: "misiones",
    iconPath:
      "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  {
    id: "coleccion",
    iconPath:
      "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    id: "perfil",
    iconPath:
      "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.182-.405-7.499-1.132z",
  },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <nav className="tab-bar">
      <button
        className={`tab-item ${activeTab === "explorar" ? "active" : ""}`}
        onClick={() => onTabChange("explorar")}
      >
        <img src={telescopeIcon} alt="" width="22" height="22" />
        <span>{t("tabs.explorar")}</span>
      </button>
      {svgTabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width="22"
            height="22"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
          </svg>
          <span>{t(`tabs.${tab.id}`)}</span>
        </button>
      ))}
    </nav>
  );
}