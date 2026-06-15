import { useAppStore } from "../store/useAppStore";
import { TabBar } from "./TabBar";
import { ExplorarPage } from "../features/explorar/ExplorarPage";
import { MisionesPage } from "../features/misiones/MisionesPage";
import { ColeccionPage } from "../features/coleccion/ColeccionPage";
import { PerfilPage } from "../features/perfil/PerfilPage";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

export function AppShell() {
  const { initStation } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initStation();
  }, [initStation]);

  const activeTab = location.pathname === "/" 
    ? "explorar" 
    : (location.pathname.substring(1) as "explorar" | "misiones" | "coleccion" | "perfil");

  const handleTabChange = (tab: string) => {
    navigate(tab === "explorar" ? "/" : `/${tab}`);
  };

  return (
    <div className="app-shell">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<ExplorarPage />} />
          <Route path="/misiones" element={<MisionesPage />} />
          <Route path="/coleccion" element={<ColeccionPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Routes>
      </main>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}