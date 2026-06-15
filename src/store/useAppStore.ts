import { create } from "zustand";
import type { StationId } from "../types/station";
import { getStationFromUrl } from "../data/stations";

export type TabId = "explorar" | "misiones" | "coleccion" | "perfil";

interface AppState {
  currentStation: StationId | null;
  setCurrentStation: (id: StationId | null) => void;
  initStation: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStation: "A",
  setCurrentStation: (id) => set({ currentStation: id }),
  initStation: () => {
    const stationId = getStationFromUrl();
    if (stationId) {
      set({ currentStation: stationId });
    }
  },
}));