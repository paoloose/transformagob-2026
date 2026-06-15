import { create } from "zustand";
import type { StationId } from "../types/station";
import { getStationFromUrl } from "../data/stations";

export type TabId = "explorar" | "misiones" | "coleccion" | "perfil";

interface AppState {
  activeTab: TabId;
  currentStation: StationId | null;
  setActiveTab: (tab: TabId) => void;
  setCurrentStation: (id: StationId | null) => void;
  initStation: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "explorar",
  currentStation: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentStation: (id) => set({ currentStation: id }),
  initStation: () => {
    const stationId = getStationFromUrl();
    if (stationId) {
      set({ currentStation: stationId, activeTab: "explorar" });
    }
  },
}));