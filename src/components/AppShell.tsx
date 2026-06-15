import { useAppStore } from "../store/useAppStore";
import { TabBar } from "./TabBar";
import { ExplorarPage } from "../features/explorar/ExplorarPage";
import { MisionesPage } from "../features/misiones/MisionesPage";
import { ColeccionPage } from "../features/coleccion/ColeccionPage";
import { PerfilPage } from "../features/perfil/PerfilPage";
import { useEffect } from "react";

const TAB_PAGES: Record<string, React.ComponentType> = {
  explorar: ExplorarPage,
  misiones: MisionesPage,
  coleccion: ColeccionPage,
  perfil: PerfilPage,
};

export function AppShell() {
  const { activeTab, tabKey, setActiveTab, initStation } = useAppStore();

  useEffect(() => {
    initStation();
  }, [initStation]);

  const PageComponent = TAB_PAGES[activeTab] || ExplorarPage;

  return (
    <div className="app-shell">
      <main className="app-content">
        <PageComponent key={`${activeTab}-${tabKey}`} />
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}