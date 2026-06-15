import type { Bird } from "../types/bird";
import type { StationId } from "../types/station";
import { STATIONS } from "../types/station";

export interface Detection {
  birdId: string;
  confidence: number;
  lastSeen: string;
}

export function generateMockDetections(stationId: StationId, _birds: Bird[]): Detection[] {
  const station = STATIONS.find((s) => s.id === stationId);
  if (!station) return [];

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 19;
  const isMorning = hour >= 6 && hour < 12;

  const detectedCount = isMorning
    ? Math.floor(station.speciesIds.length * 0.7)
    : isDaytime
      ? Math.floor(station.speciesIds.length * 0.4)
      : Math.floor(station.speciesIds.length * 0.15);

  const shuffled = [...station.speciesIds].sort(() => Math.random() - 0.5);
  const detected = shuffled.slice(0, Math.max(detectedCount, 3));

  return detected.map((id) => ({
    birdId: id,
    confidence: 0.6 + Math.random() * 0.39,
    lastSeen: new Date(Date.now() - Math.random() * 600000).toISOString(),
  }));
}

export function getSpottedBirds(stationId: StationId, birds: Bird[]): Bird[] {
  const detections = generateMockDetections(stationId, birds);
  return detections
    .map((d) => birds.find((b) => b.scientific_name === d.birdId))
    .filter((b): b is Bird => b !== undefined);
}