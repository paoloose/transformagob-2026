import type { StationId } from "./station";

export interface Discovery {
  birdId: string;
  stationId: StationId;
  discoveredAt: string;
  photoUrl?: string;
}