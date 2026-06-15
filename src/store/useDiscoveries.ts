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

const SEED_SPECIES = [
  "Larus belcheri",
  "Chroicocephalus cirrocephalus",
  "Sula variegata",
  "Phalacrocorax brasilianus",
  "Pelecanus thagus",
  "Ardea alba",
  "Egretta thula",
  "Numenius phaeopus",
  "Charadrius vociferus",
  "Calidris pusilla",
  "Zenaida meloda",
  "Haematopus palliatus",
];

function loadFromStorage(): Discovery[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch {
    // ignore
  }

  const seed: Discovery[] = SEED_SPECIES.map((birdId, i) => ({
    birdId,
    stationId: (["A", "B", "C", "D"] as const)[i % 4] as StationId,
    discoveredAt: new Date(Date.now() - (SEED_SPECIES.length - i) * 86400000).toISOString(),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
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