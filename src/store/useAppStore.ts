import { create } from "zustand";
import type { StationId } from "../types/station";
import { getStationFromUrl } from "../data/stations";

export type TabId = "explorar" | "misiones" | "coleccion" | "perfil";

interface AppState {
  activeTab: TabId;
  currentStation: StationId | null;
  tabKey: number;
  setActiveTab: (tab: TabId) => void;
  setCurrentStation: (id: StationId | null) => void;
  initStation: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "explorar",
  currentStation: "A",
  tabKey: 0,
  setActiveTab: (tab) => set((state) => ({
    activeTab: tab,
    tabKey: state.activeTab === tab ? state.tabKey + 1 : state.tabKey,
  })),
  setCurrentStation: (id) => set({ currentStation: id }),
  initStation: () => {
    const stationId = getStationFromUrl();
    if (stationId) {
      set({ currentStation: stationId, activeTab: "explorar" });
    }
  },
}));