import { create } from "zustand";
import type { Discovery } from "../types/discovery";
import type { StationId } from "../types/station";

interface DiscoveriesState {
  discoveries: Discovery[];
  addDiscovery: (birdId: string, stationId: StationId, photoUrl?: string) => void;
  isDiscovered: (birdId: string) => boolean;
  getDiscoveredBirdIds: () => string[];
  clearDiscoveries: () => void;
}

const STORAGE_KEY = "arenilla-go-discoveries";

function loadFromStorage(): Discovery[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(discoveries: Discovery[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveries));
}

export const useDiscoveries = create<DiscoveriesState>((set, get) => ({
  discoveries: loadFromStorage(),

  addDiscovery: (birdId, stationId, photoUrl) => {
    const state = get();
    if (state.isDiscovered(birdId)) return;
    const newDiscovery: Discovery = {
      birdId,
      stationId,
      discoveredAt: new Date().toISOString(),
      photoUrl,
    };
    const updated = [...state.discoveries, newDiscovery];
    saveToStorage(updated);
    set({ discoveries: updated });
  },

  isDiscovered: (birdId) => {
    return get().discoveries.some((d) => d.birdId === birdId);
  },

  getDiscoveredBirdIds: () => {
    return get().discoveries.map((d) => d.birdId);
  },

  clearDiscoveries: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ discoveries: [] });
  },
}));