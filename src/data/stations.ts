export { STATIONS, MAP_CENTER } from "../types/station";
export type { Station, StationId } from "../types/station";

import { STATIONS } from "../types/station";
import type { Station, StationId } from "../types/station";

export function getStationById(id: StationId): Station | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function getStationFromUrl(): StationId | null {
  const params = new URLSearchParams(window.location.search);
  const zone = params.get("zone");
  if (zone && ["A", "B", "C", "D"].includes(zone.toUpperCase())) {
    return zone.toUpperCase() as StationId;
  }
  return null;
}