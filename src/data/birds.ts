import type { Bird } from "../types/bird";

let _birds: Bird[] | null = null;

export async function loadBirds(): Promise<Bird[]> {
  if (_birds) return _birds;
  const resp = await fetch("/db/birds.json");
  _birds = await resp.json();
  return _birds!;
}

export function getBirdByScientificName(birds: Bird[], name: string): Bird | undefined {
  return birds.find((b) => b.scientific_name === name);
}

export function getBirdImage(bird: Bird, index: number = 0): string {
  return `/db/images/${bird.images[index]}`;
}

export function getBirdModelPath(_bird: Bird): string {
  return "/db/models/seagull.glb";
}

export function getBirdAudioPath(_bird: Bird): string {
  return "/db/audio/larus_belcheri.mp3";
}

export function deriveSizeCategory(bird: Bird): "pequeno" | "mediano" | "grande" {
  const sizeStr = bird.size;
  const match = sizeStr.match(/(\d+)/);
  if (!match) return "mediano";
  const cm = parseInt(match[1], 10);
  if (cm < 30) return "pequeno";
  if (cm < 70) return "mediano";
  return "grande";
}

export type BirdType =
  | "pato"
  | "garza"
  | "gaviota"
  | "chorlo"
  | "playero"
  | "cormoran"
  | "pelicano"
  | "gallinazo"
  | "falaropo"
  | "ostrero"
  | "ibis"
  | "paloma"
  | "gavilan"
  | "piquero"
  | "parihuana"
  | "alcarravan";

export function deriveBirdType(bird: Bird): BirdType {
  const name = bird.common_name.toUpperCase();
  if (name.includes("PATO")) return "pato";
  if (name.includes("GARZA") || name.includes("GARCITA")) return "garza";
  if (name.includes("GAVIOTA")) return "gaviota";
  if (name.includes("CHORLO")) return "chorlo";
  if (name.includes("PLAYER")) return "playero";
  if (name.includes("CORMORÁN")) return "cormoran";
  if (name.includes("PELICANO")) return "pelicano";
  if (name.includes("GALLINAZO")) return "gallinazo";
  if (name.includes("FALÁROPO")) return "falaropo";
  if (name.includes("OSTRERO")) return "ostrero";
  if (name.includes("IBIS")) return "ibis";
  if (name.includes("CUCULÍ") || name.includes("TÓRTOLA")) return "paloma";
  if (name.includes("GAVILÁN")) return "gavilan";
  if (name.includes("PIQUERO")) return "piquero";
  if (name.includes("PARIHUANA")) return "parihuana";
  if (name.includes("ALCARAVÁN")) return "alcarravan";
  return "playero";
}