# Arenilla Go Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first interactive web app where visitors at the HCPA scan QR codes, watch live camera feeds, discover bird species via photo missions, and build a digital collection.

**Architecture:** Single-page React app with tab-based navigation. Zustand for state management. Local mock JSON for all data. Clerk for auth. React Three Fiber for 3D viewers. Leaflet for maps. i18next for translations.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, @clerk/clerk-react, Three.js / @react-three/fiber / @react-three/drei, Leaflet / react-leaflet, react-i18next, i18next

---

## File Structure

```
src/
  main.tsx                          # Entry point with ClerkProvider + i18n
  App.tsx                           # AppShell with tab routing
  index.css                         # Global styles + Tailwind

  types/
    bird.ts                         # Bird interface
    station.ts                      # Station, StationId types
    discovery.ts                    # Discovery interface
    badge.ts                        # Badge interface

  data/
    stations.ts                     # Station definitions + species assignments
    detections.ts                   # Mock AI detection generator
    badges.ts                       # Badge definitions

  store/
    useAppStore.ts                  # Zustand: active tab, current station, language
    useDiscoveries.ts               # Zustand: user discoveries (persisted to Clerk metadata)

  i18n/
    index.ts                        # i18next config
    es.ts                           # Spanish strings
    en.ts                           # English strings

  components/
    AppShell.tsx                    # Layout + bottom tab bar
    TabBar.tsx                      # Bottom navigation icons
    SpeciesCard.tsx                 # Bird thumbnail card (reused across tabs)
    SpeciesDetail.tsx               # Full species detail overlay/card
    ConservationBadge.tsx           # IUCN status color badge
    SeasonalityBadge.tsx            # Seasonality label badge
    Model3DViewer.tsx               # React Three Fiber bird viewer
    AudioPlayer.tsx                 # Play bird sound button
    MapView.tsx                     # Leaflet map centered on HCPA

  features/
    explorar/
      ExplorarPage.tsx              # Explorar tab: zone header + camera + spotted list
      ZoneHeader.tsx                # Station name, label, tide indicator
      CameraFeed.tsx                # Prerecorded video with species overlay badges
      SpottedList.tsx               # Horizontal scroll of currently spotted species

    misiones/
      MisionesPage.tsx              # Misiones tab: two modes
      ModoExplorador.tsx            # Camera-based discovery flow
      BuscaTuAve.tsx                # Trait selector + species matching
      BirdCamera.tsx                # Phone camera capture component
      EncounterAnimation.tsx        # Discovery celebration animation

    coleccion/
      ColeccionPage.tsx             # Coleccion tab: grid + badges + progress
      SpeciesGrid.tsx               # Grid of all 63 species (discovered/locked)
      BadgesSection.tsx             # Earned/locked badges
      ProgressTracker.tsx           # "X de 63 especies descubiertas"

    perfil/
      PerfilPage.tsx                # Perfil tab: auth, language, stats, about
      AuthControls.tsx              # Clerk sign-in/up/user button
      LanguageToggle.tsx            # ES/EN switch
      StatsSection.tsx              # User stats display

public/
  db/
    birds.json                      # Already exists (63 species)
    stations.json                   # To create
    images/                         # Already exists (315 images)
    models/                         # To create (10 .glb files)
    audio/                          # To create
    videos/                         # To create (4 prerecorded videos)
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install core dependencies**

```bash
bun add zustand react-router-dom @clerk/clerk-react react-i18next i18next i18next-browser-languagedetector
```

- [ ] **Step 2: Install 3D and map dependencies**

```bash
bun add three @react-three/fiber @react-three/drei leaflet react-leaflet @types/three @types/leaflet
```

- [ ] **Step 3: Verify installation**

```bash
bun run dev
```

Expected: Vite dev server starts without errors.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock
git commit -m "feat: install core dependencies"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/bird.ts`
- Create: `src/types/station.ts`
- Create: `src/types/discovery.ts`
- Create: `src/types/badge.ts`

- [ ] **Step 1: Create bird types**

```typescript
// src/types/bird.ts
export type IucnStatus = "LC" | "NT" | "VU" | "EN" | "CR" | "DD" | "NE";
export type Seasonality = "RE" | "MB" | "MA" | "MS" | "ML" | "ACC";
export type CitesAppendix = "I" | "II" | "III";

export interface Bird {
  scientific_name: string;
  common_name: string;
  iucn_status: IucnStatus;
  seasonality: Seasonality;
  cites_appendix: CitesAppendix | null;
  size: string;
  weight: string;
  juvenile_noted: boolean;
  distribution: string | null;
  vocalization: string | null;
  male_plumage: string | null;
  female_plumage: string | null;
  zone_in_humedal: string | null;
  description: string;
  page: number;
  images: string[];
}
```

- [ ] **Step 2: Create station types**

```typescript
// src/types/station.ts
export type StationId = "A" | "B" | "C" | "D";

export interface Station {
  id: StationId;
  label: string;
  lat: number;
  lng: number;
  videoSrc: string;
  speciesIds: string[];
}

export const STATIONS: Station[] = [
  {
    id: "A",
    label: "Estación A - Mirador Oeste",
    lat: -12.074006,
    lng: -77.162610,
    videoSrc: "/db/videos/station_a.mp4",
    speciesIds: [
      "Spatula cyanoptera",
      "Anas bahamensis",
      "Phalacrocorax brasilianus",
      "Phalacrocorax bougainvillii",
      "Pelecanus thagus",
      "Larus dominicanus",
      "Larus belcheri",
      "Leucophaeus pipixcan",
      "Sula variegata",
      "Sula nebouxii",
      "Nycticorax nycticorax",
      "Ardea alba",
      "Egretta thula",
      "Egretta caerulea",
      "Egretta tricolor",
      "Ardea cocoi",
    ],
  },
  {
    id: "B",
    label: "Estación B - Pérgola Norte",
    lat: -12.072702,
    lng: -77.160723,
    videoSrc: "/db/videos/station_b.mp4",
    speciesIds: [
      "Phoenicopterus chilensis",
      "Plegadis ridgwayi",
      "Bubulcus ibis",
      "Nycticorax nycticorax",
      "Ardea alba",
      "Egretta thula",
      "Charadrius vociferus",
      "Haematopus palliatus",
      "Haematopus ater",
      "Burhinus superciliaris",
      "Numenius phaeopus",
      "Tringa melanoleuca",
      "Tringa semipalmata",
    ],
  },
  {
    id: "C",
    label: "Estación C - Pérgola Sur",
    lat: -12.070789,
    lng: -77.159469,
    videoSrc: "/db/videos/station_c.mp4",
    speciesIds: [
      "Pluvialis squatarola",
      "Charadrius semipalmatus",
      "Charadrius vociferus",
      "Arenaria interpres",
      "Calidris virgata",
      "Calidris canutus",
      "Calidris alba",
      "Calidris pusilla",
      "Calidris mauri",
      "Calidris minutilla",
      "Phalaropus tricolor",
      "Actitis macularius",
      "Haematopus palliatus",
    ],
  },
  {
    id: "D",
    label: "Estación D - Mirador Este",
    lat: -12.069619,
    lng: -77.158699,
    videoSrc: "/db/videos/station_d.mp4",
    speciesIds: [
      "Zenaida meloda",
      "Zenaida auriculata",
      "Cathartes aura",
      "Coragyps atratus",
      "Parabuteo unicinctus",
      "Chroicocephalus serranus",
      "Chroicocephalus cirrocephalus",
      "Leucophaeus modestus",
      "Leucophaeus pipixcan",
      "Larus belcheri",
      "Larus dominicanus",
      "Sula variegata",
      "Sula nebouxii",
    ],
  },
];

export const MAP_CENTER: [number, number] = [-12.071228, -77.160295];
```

- [ ] **Step 3: Create discovery types**

```typescript
// src/types/discovery.ts
import type { StationId } from "./station";

export interface Discovery {
  birdId: string;
  stationId: StationId;
  discoveredAt: string;
  photoUrl?: string;
}
```

- [ ] **Step 4: Create badge types**

```typescript
// src/types/badge.ts
export interface Badge {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string;
  condition: (discoveries: string[]) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: "explorador-costero",
    nameEs: "Explorador Costero",
    nameEn: "Coastal Explorer",
    descriptionEs: "Descubre 5 especies",
    descriptionEn: "Discover 5 species",
    icon: "🌊",
    condition: (d) => d.length >= 5,
  },
  {
    id: "observador-migratorias",
    nameEs: "Observador de Migratorias",
    nameEn: "Migratory Observer",
    descriptionEs: "Descubre 5 especies migratorias",
    descriptionEn: "Discover 5 migratory species",
    icon: "🦅",
    condition: (d) => d.length >= 5,
  },
  {
    id: "guardian-biodiversidad",
    nameEs: "Guardián de la Biodiversidad",
    nameEn: "Biodiversity Guardian",
    descriptionEs: "Descubre especies de todos los tipos de estacionalidad",
    descriptionEn: "Discover species from all seasonality types",
    icon: "🛡️",
    condition: (d) => d.length >= 10,
  },
  {
    id: "maestro-humedal",
    nameEs: "Maestro del Humedal",
    nameEn: "Wetland Master",
    descriptionEs: "Descubre 20 especies",
    descriptionEn: "Discover 20 species",
    icon: "🏆",
    condition: (d) => d.length >= 20,
  },
];
```

- [ ] **Step 5: Verify types compile**

```bash
bun run build
```

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add src/types/
git commit -m "feat: add type definitions for bird, station, discovery, badge"
```

---

### Task 3: Data Layer

**Files:**
- Create: `src/data/stations.ts`
- Create: `src/data/birds.ts`
- Create: `src/data/detections.ts`

- [ ] **Step 1: Create bird data loader**

```typescript
// src/data/birds.ts
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

export function getBirdModelPath(bird: Bird): string | null {
  const modelSpecies = [
    "Spatula cyanoptera",
    "Phoenicopterus chilensis",
    "Sula variegata",
    "Phalacrocorax brasilianus",
    "Pelecanus thagus",
    "Ardea alba",
    "Egretta thula",
    "Larus belcheri",
    "Numenius phaeopus",
    "Calidris pusilla",
  ];
  if (modelSpecies.includes(bird.scientific_name)) {
    const slug = bird.scientific_name.toLowerCase().replace(/\s+/g, "_");
    return `/db/models/${slug}.glb`;
  }
  return null;
}

export function getBirdAudioPath(bird: Bird): string | null {
  if (!bird.vocalization) return null;
  const slug = bird.scientific_name.toLowerCase().replace(/\s+/g, "_");
  return `/db/audio/${slug}.mp3`;
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
```

- [ ] **Step 2: Create station data re-export**

```typescript
// src/data/stations.ts
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
```

- [ ] **Step 3: Create mock detection generator**

```typescript
// src/data/detections.ts
import type { Bird } from "../types/bird";
import type { StationId } from "../types/station";
import { STATIONS } from "../types/station";

export interface Detection {
  birdId: string;
  confidence: number;
  lastSeen: string;
}

export function generateMockDetections(stationId: StationId, birds: Bird[]): Detection[] {
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
```

- [ ] **Step 4: Verify data layer compiles**

```bash
bun run build
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add data layer - bird loader, station helpers, mock detections"
```

---

### Task 4: Zustand Stores

**Files:**
- Create: `src/store/useAppStore.ts`
- Create: `src/store/useDiscoveries.ts`

- [ ] **Step 1: Create app store**

```typescript
// src/store/useAppStore.ts
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
```

- [ ] **Step 2: Create discoveries store**

```typescript
// src/store/useDiscoveries.ts
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
```

- [ ] **Step 3: Verify stores compile**

```bash
bun run build
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand stores for app state and discoveries"
```

---

### Task 5: i18n Setup

**Files:**
- Create: `src/i18n/es.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/index.ts`

- [ ] **Step 1: Create Spanish translations**

```typescript
// src/i18n/es.ts
export const es = {
  tabs: {
    explorar: "Explorar",
    misiones: "Misiones",
    coleccion: "Colección",
    perfil: "Perfil",
  },
  explorar: {
    spottedNow: "Avistadas ahora",
    noSpecies: "No se detectaron especies en este momento",
    tideHigh: "Marea alta",
    tideLow: "Marea baja",
    tideMedium: "Marea media",
    discovered: "¡Descubierta!",
    discover: "Descubrir",
    signInToSave: "Inicia sesión para guardar",
  },
  misiones: {
    modoExplorador: "Modo Explorador",
    buscaTuAve: "Busca tu Ave",
    nearbySpecies: "Especies cercanas",
    openCamera: "Abrir cámara",
    takePhoto: "Tomar foto",
    identifying: "Identificando...",
    found: "¡Encontraste un {{name}}!",
    selectTraits: "Selecciona las características",
    size: "Tamaño",
    plumage: "Plumaje",
    type: "Tipo",
    seasonality: "Estacionalidad",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    resident: "Residente",
    migratoryBoreal: "Migratorio boreal",
    migratoryAustral: "Migratorio austral",
    search: "Buscar",
    matchesFound: "{{count}} coincidencias",
    noMatches: "No se encontraron coincidencias",
    goFind: "Ir a buscarla",
  },
  coleccion: {
    title: "Guía Digital de la Arenilla",
    progress: "{{discovered}} de {{total}} especies descubiertas",
    badges: "Logros",
    locked: "???",
  },
  perfil: {
    signIn: "Iniciar sesión",
    signUp: "Crear cuenta",
    signOut: "Cerrar sesión",
    language: "Idioma",
    stats: "Estadísticas",
    speciesDiscovered: "Especies descubiertas",
    missionsCompleted: "Misiones completadas",
    badgesEarned: "Logros obtenidos",
    about: "Sobre el HCPA",
    aboutText:
      "El Humedal Costero Poza de la Arenilla es un ecosistema de 18.2 hectáreas ubicado en La Punta, Callao. Refugio de aves residentes y migratorias, declarado Zona Reservada de Protección Municipal en 1999.",
  },
  species: {
    size: "Tamaño",
    weight: "Peso",
    distribution: "Distribución",
    conservation: "Conservación",
    seasonality: "Estacionalidad",
    cites: "CITES",
    plumage: "Plumaje",
    malePlumage: "Plumaje macho",
    femalePlumage: "Plumaje hembra",
    vocalization: "Vocalización",
    playSound: "Reproducir sonido",
    viewModel: "Ver modelo 3D",
    viewPhotos: "Ver fotos",
    juvenile: "Juvenil",
  },
  seasonality: {
    RE: "Residente",
    MB: "Migratorio boreal",
    MA: "Migratorio austral",
    MS: "Migratorio austral",
    ML: "Migratorio local",
    ACC: "Accidental",
  },
  iucn: {
    LC: "Preocupación menor",
    NT: "Casi amenazado",
    VU: "Vulnerable",
    EN: "En peligro",
    CR: "En peligro crítico",
    DD: "Datos insuficientes",
    NE: "No evaluado",
  },
};
```

- [ ] **Step 2: Create English translations**

```typescript
// src/i18n/en.ts
export const en = {
  tabs: {
    explorar: "Explore",
    misiones: "Missions",
    coleccion: "Collection",
    perfil: "Profile",
  },
  explorar: {
    spottedNow: "Spotted now",
    noSpecies: "No species detected at this time",
    tideHigh: "High tide",
    tideLow: "Low tide",
    tideMedium: "Medium tide",
    discovered: "Discovered!",
    discover: "Discover",
    signInToSave: "Sign in to save",
  },
  misiones: {
    modoExplorador: "Explorer Mode",
    buscaTuAve: "Find Your Bird",
    nearbySpecies: "Nearby species",
    openCamera: "Open camera",
    takePhoto: "Take photo",
    identifying: "Identifying...",
    found: "You found a {{name}}!",
    selectTraits: "Select characteristics",
    size: "Size",
    plumage: "Plumage",
    type: "Type",
    seasonality: "Seasonality",
    small: "Small",
    medium: "Medium",
    large: "Large",
    resident: "Resident",
    migratoryBoreal: "Boreal migratory",
    migratoryAustral: "Austral migratory",
    search: "Search",
    matchesFound: "{{count}} matches",
    noMatches: "No matches found",
    goFind: "Go find it",
  },
  coleccion: {
    title: "Arenilla Digital Guide",
    progress: "{{discovered}} of {{total}} species discovered",
    badges: "Achievements",
    locked: "???",
  },
  perfil: {
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    language: "Language",
    stats: "Statistics",
    speciesDiscovered: "Species discovered",
    missionsCompleted: "Missions completed",
    badgesEarned: "Badges earned",
    about: "About the HCPA",
    aboutText:
      "The Humedal Costero Poza de la Arenilla is an 18.2-hectare ecosystem in La Punta, Callao. A refuge for resident and migratory birds, declared a Municipal Protection Reserved Zone in 1999.",
  },
  species: {
    size: "Size",
    weight: "Weight",
    distribution: "Distribution",
    conservation: "Conservation",
    seasonality: "Seasonality",
    cites: "CITES",
    plumage: "Plumage",
    malePlumage: "Male plumage",
    femalePlumage: "Female plumage",
    vocalization: "Vocalization",
    playSound: "Play sound",
    viewModel: "View 3D model",
    viewPhotos: "View photos",
    juvenile: "Juvenile",
  },
  seasonality: {
    RE: "Resident",
    MB: "Boreal migratory",
    MA: "Austral migratory",
    MS: "Austral migratory",
    ML: "Local migratory",
    ACC: "Accidental",
  },
  iucn: {
    LC: "Least concern",
    NT: "Near threatened",
    VU: "Vulnerable",
    EN: "Endangered",
    CR: "Critically endangered",
    DD: "Data deficient",
    NE: "Not evaluated",
  },
};
```

- [ ] **Step 3: Create i18next config**

```typescript
// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { es } from "./es";
import { en } from "./en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });

export default i18n;
```

- [ ] **Step 4: Verify i18n compiles**

```bash
bun run build
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n setup with Spanish and English translations"
```

---

### Task 6: App Shell and Routing

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/TabBar.tsx`

- [ ] **Step 1: Update main.tsx with i18n import**

```typescript
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 2: Create TabBar component**

```typescript
// src/components/TabBar.tsx
import { useTranslation } from "react-i18next";
import type { TabId } from "../store/useAppStore";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; iconPath: string }[] = [
  {
    id: "explorar",
    iconPath:
      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    id: "misiones",
    iconPath:
      "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  {
    id: "coleccion",
    iconPath:
      "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    id: "perfil",
    iconPath:
      "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.182-.405-7.499-1.132z",
  },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
          </svg>
          <span>{t(`tabs.${tab.id}`)}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Create AppShell component**

```typescript
// src/components/AppShell.tsx
import { useAppStore } from "../store/useAppStore";
import { TabBar } from "./TabBar";
import { ExplorarPage } from "../features/explorar/ExplorarPage";
import { MisionesPage } from "../features/misiones/MisionesPage";
import { ColeccionPage } from "../features/coleccion/ColeccionPage";
import { PerfilPage } from "../features/perfil/PerfilPage";
import { useEffect } from "react";

const TAB_PAGES: Record<string, React.ComponentType> = {
  explorar: ExplorarPage,
  misiones: MisionesPage,
  coleccion: ColeccionPage,
  perfil: PerfilPage,
};

export function AppShell() {
  const { activeTab, setActiveTab, initStation } = useAppStore();

  useEffect(() => {
    initStation();
  }, [initStation]);

  const PageComponent = TAB_PAGES[activeTab] || ExplorarPage;

  return (
    <div className="app-shell">
      <main className="app-content">
        <PageComponent />
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
```

- [ ] **Step 4: Create placeholder page components**

```typescript
// src/features/explorar/ExplorarPage.tsx
export function ExplorarPage() {
  return <div className="page"><h1>Explorar</h1><p>Coming soon</p></div>;
}
```

```typescript
// src/features/misiones/MisionesPage.tsx
export function MisionesPage() {
  return <div className="page"><h1>Misiones</h1><p>Coming soon</p></div>;
}
```

```typescript
// src/features/coleccion/ColeccionPage.tsx
export function ColeccionPage() {
  return <div className="page"><h1>Colección</h1><p>Coming soon</p></div>;
}
```

```typescript
// src/features/perfil/PerfilPage.tsx
export function PerfilPage() {
  return <div className="page"><h1>Perfil</h1><p>Coming soon</p></div>;
}
```

- [ ] **Step 5: Update App.tsx**

```typescript
// src/App.tsx
import { AppShell } from "./components/AppShell";
import "./App.css";

function App() {
  return <AppShell />;
}

export default App;
```

- [ ] **Step 6: Update index.css with base app styles**

```css
/* src/index.css */
:root {
  --ocean-deep: #0c2d48;
  --ocean-mid: #145374;
  --ocean-light: #2e8bc0;
  --seafoam: #4dbfa0;
  --sand: #d4b483;
  --sand-light: #f0e4cf;
  --sunset: #e07a3a;
  --sunset-light: #f4a261;
  --white: #ffffff;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-500: #737373;
  --gray-800: #262626;
  --iucn-lc: #4caf50;
  --iucn-nt: #ff9800;
  --iucn-vu: #ff5722;
  --iucn-en: #f44336;
  --iucn-cr: #9c27b0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--sand-light);
  color: var(--gray-800);
  -webkit-font-smoothing: antialiased;
}

.app-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 0;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  border: none;
  background: none;
  color: var(--gray-500);
  font-size: 0.65rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}

.tab-item.active {
  color: var(--ocean-light);
}

.tab-item svg {
  width: 22px;
  height: 22px;
}

.page {
  padding: 1rem;
  min-height: 100%;
}
```

- [ ] **Step 7: Verify app runs with tab navigation**

```bash
bun run dev
```

Expected: App renders with bottom tab bar, switching between placeholder pages.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add AppShell with tab navigation, placeholder pages, base styles"
```

---

### Task 7: Shared Components (SpeciesCard, ConservationBadge, SeasonalityBadge)

**Files:**
- Create: `src/components/SpeciesCard.tsx`
- Create: `src/components/ConservationBadge.tsx`
- Create: `src/components/SeasonalityBadge.tsx`

- [ ] **Step 1: Create ConservationBadge**

```typescript
// src/components/ConservationBadge.tsx
import type { IucnStatus } from "../types/bird";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<IucnStatus, string> = {
  LC: "var(--iucn-lc)",
  NT: "var(--iucn-nt)",
  VU: "var(--iucn-vu)",
  EN: "var(--iucn-en)",
  CR: "var(--iucn-cr)",
  DD: "var(--gray-500)",
  NE: "var(--gray-500)",
};

interface ConservationBadgeProps {
  status: IucnStatus;
  showLabel?: boolean;
}

export function ConservationBadge({ status, showLabel = false }: ConservationBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className="conservation-badge"
      style={{ backgroundColor: STATUS_COLORS[status] }}
      title={t(`iucn.${status}`)}
    >
      {status}
      {showLabel && <span className="badge-label">{t(`iucn.${status}`)}</span>}
    </span>
  );
}
```

- [ ] **Step 2: Create SeasonalityBadge**

```typescript
// src/components/SeasonalityBadge.tsx
import type { Seasonality } from "../types/bird";
import { useTranslation } from "react-i18next";

interface SeasonalityBadgeProps {
  seasonality: Seasonality;
}

export function SeasonalityBadge({ seasonality }: SeasonalityBadgeProps) {
  const { t } = useTranslation();
  return <span className="seasonality-badge">{t(`seasonality.${seasonality}`)}</span>;
}
```

- [ ] **Step 3: Create SpeciesCard**

```typescript
// src/components/SpeciesCard.tsx
import type { Bird } from "../types/bird";
import { getBirdImage } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";

interface SpeciesCardProps {
  bird: Bird;
  onClick?: () => void;
  discovered?: boolean;
}

export function SpeciesCard({ bird, onClick, discovered = true }: SpeciesCardProps) {
  return (
    <button className="species-card" onClick={onClick} type="button">
      <div className="species-card-image">
        {discovered ? (
          <img src={getBirdImage(bird, 0)} alt={bird.common_name} loading="lazy" />
        ) : (
          <div className="species-card-silhouette">?</div>
        )}
      </div>
      <div className="species-card-info">
        <span className="species-card-name">
          {discovered ? bird.common_name : "???"}
        </span>
        {discovered && <ConservationBadge status={bird.iucn_status} />}
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Add component styles to index.css**

Append to `src/index.css`:

```css
.species-card {
  display: flex;
  flex-direction: column;
  border: none;
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  width: 100%;
}

.species-card:active {
  transform: scale(0.97);
}

.species-card-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--gray-100);
}

.species-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.species-card-silhouette {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-200);
  color: var(--gray-500);
  font-size: 2rem;
  font-weight: bold;
}

.species-card-info {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.species-card-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ocean-deep);
}

.conservation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
}

.badge-label {
  font-size: 0.55rem;
}

.seasonality-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: var(--seafoam);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
}
```

- [ ] **Step 5: Verify components render**

```bash
bun run build
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/SpeciesCard.tsx src/components/ConservationBadge.tsx src/components/SeasonalityBadge.tsx src/index.css
git commit -m "feat: add shared components - SpeciesCard, ConservationBadge, SeasonalityBadge"
```

---

### Task 8: Explorar Tab

**Files:**
- Modify: `src/features/explorar/ExplorarPage.tsx`
- Create: `src/features/explorar/ZoneHeader.tsx`
- Create: `src/features/explorar/CameraFeed.tsx`
- Create: `src/features/explorar/SpottedList.tsx`

- [ ] **Step 1: Create ZoneHeader**

```typescript
// src/features/explorar/ZoneHeader.tsx
import { useAppStore } from "../../store/useAppStore";
import { STATIONS } from "../../data/stations";
import { useTranslation } from "react-i18next";

function getTideStatus() {
  const hour = new Date().getHours();
  if (hour < 6 || hour > 18) return "low";
  if (hour % 6 < 3) return "high";
  return "medium";
}

export function ZoneHeader() {
  const { currentStation } = useAppStore();
  const { t } = useTranslation();

  const station = STATIONS.find((s) => s.id === currentStation);

  if (!station) {
    return (
      <div className="zone-header">
        <p className="zone-header-label">Escanea un código QR para comenzar</p>
      </div>
    );
  }

  const tide = getTideStatus();

  return (
    <div className="zone-header">
      <div className="zone-header-station">
        <h2>{station.label}</h2>
        <span className="zone-header-tide">
          🌊 {t(`explorar.tide${tide.charAt(0).toUpperCase() + tide.slice(1)}`)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CameraFeed**

```typescript
// src/features/explorar/CameraFeed.tsx
import { useAppStore } from "../../store/useAppStore";
import { STATIONS } from "../../data/stations";

export function CameraFeed() {
  const { currentStation } = useAppStore();
  const station = STATIONS.find((s) => s.id === currentStation);

  if (!station) return null;

  return (
    <div className="camera-feed">
      <video
        src={station.videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="camera-feed-video"
      />
      <div className="camera-feed-label">
        <span className="camera-live-dot" /> Cámara en vivo
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create SpottedList**

```typescript
// src/features/explorar/SpottedList.tsx
import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { loadBirds } from "../../data/birds";
import { getSpottedBirds } from "../../data/detections";
import { SpeciesCard } from "../../components/SpeciesCard";
import type { Bird } from "../../types/bird";
import { useTranslation } from "react-i18next";

interface SpottedListProps {
  onSpeciesClick: (bird: Bird) => void;
}

export function SpottedList({ onSpeciesClick }: SpottedListProps) {
  const { currentStation } = useAppStore();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [spotted, setSpotted] = useState<Bird[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then((allBirds) => {
      setBirds(allBirds);
      if (currentStation) {
        setSpotted(getSpottedBirds(currentStation, allBirds));
      }
    });
  }, [currentStation]);

  if (!currentStation) {
    return <p className="spotted-empty">{t("explorar.noSpecies")}</p>;
  }

  return (
    <div className="spotted-section">
      <h3 className="spotted-title">{t("explorar.spottedNow")}</h3>
      <div className="spotted-list">
        {spotted.map((bird) => (
          <SpeciesCard
            key={bird.scientific_name}
            bird={bird}
            onClick={() => onSpeciesClick(bird)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update ExplorarPage with full layout**

```typescript
// src/features/explorar/ExplorarPage.tsx
import { useState, useEffect } from "react";
import { ZoneHeader } from "./ZoneHeader";
import { CameraFeed } from "./CameraFeed";
import { SpottedList } from "./SpottedList";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import { loadBirds } from "../../data/birds";
import type { Bird } from "../../types/bird";

export function ExplorarPage() {
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  if (selectedBird) {
    return <SpeciesDetail bird={selectedBird} onBack={() => setSelectedBird(null)} birds={birds} />;
  }

  return (
    <div className="page explorar-page">
      <ZoneHeader />
      <CameraFeed />
      <SpottedList onSpeciesClick={setSelectedBird} />
    </div>
  );
}
```

- [ ] **Step 5: Add explorar styles to index.css**

Append to `src/index.css`:

```css
.zone-header {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--ocean-deep), var(--ocean-mid));
  color: white;
}

.zone-header-station h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

.zone-header-tide {
  font-size: 0.8rem;
  opacity: 0.9;
}

.zone-header-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.camera-feed {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: black;
}

.camera-feed-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-feed-label {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.camera-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f44336;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.spotted-section {
  padding: 0.75rem 1rem;
}

.spotted-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ocean-deep);
  margin-bottom: 0.5rem;
}

.spotted-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}

.spotted-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--gray-500);
}
```

- [ ] **Step 6: Verify Explorar tab renders**

```bash
bun run dev
```

Expected: Explorar tab shows zone header, camera feed area, spotted species list.

- [ ] **Step 7: Commit**

```bash
git add src/features/explorar/ src/index.css
git commit -m "feat: add Explorar tab with zone header, camera feed, spotted list"
```

---

### Task 9: Species Detail Component

**Files:**
- Create: `src/components/SpeciesDetail.tsx`
- Create: `src/components/AudioPlayer.tsx`
- Create: `src/components/Model3DViewer.tsx`

- [ ] **Step 1: Create AudioPlayer**

```typescript
// src/components/AudioPlayer.tsx
import { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  label: string;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="audio-player">
      <button className="audio-player-btn" onClick={toggle} type="button">
        {playing ? "⏸" : "🔊"} {label}
      </button>
      <audio ref={ref} src={src} onEnded={() => setPlaying(false)} preload="none" />
    </div>
  );
}
```

- [ ] **Step 2: Create Model3DViewer**

```typescript
// src/components/Model3DViewer.tsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url) as GLTF;
  return <primitive object={scene} scale={1.5} />;
}

interface Model3DViewerProps {
  modelUrl: string;
}

export function Model3DViewer({ modelUrl }: Model3DViewerProps) {
  return (
    <div className="model-3d-viewer">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Create SpeciesDetail**

```typescript
// src/components/SpeciesDetail.tsx
import type { Bird } from "../types/bird";
import { getBirdImage, getBirdModelPath, getBirdAudioPath } from "../data/birds";
import { ConservationBadge } from "./ConservationBadge";
import { SeasonalityBadge } from "./SeasonalityBadge";
import { AudioPlayer } from "./AudioPlayer";
import { Model3DViewer } from "./Model3DViewer";
import { useDiscoveries } from "../store/useDiscoveries";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface SpeciesDetailProps {
  bird: Bird;
  onBack: () => void;
  birds: Bird[];
}

export function SpeciesDetail({ bird, onBack }: SpeciesDetailProps) {
  const { addDiscovery, isDiscovered } = useDiscoveries();
  const { currentStation } = useAppStore();
  const { t } = useTranslation();
  const discovered = isDiscovered(bird.scientific_name);
  const modelPath = getBirdModelPath(bird);
  const audioPath = getBirdAudioPath(bird);
  const [showModel, setShowModel] = useState(false);

  const handleDiscover = () => {
    if (!discovered && currentStation) {
      addDiscovery(bird.scientific_name, currentStation);
    }
  };

  return (
    <div className="species-detail">
      <button className="back-btn" onClick={onBack} type="button">
        ← {t("tabs.explorar")}
      </button>

      <div className="species-detail-hero">
        <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
      </div>

      {modelPath && (
        <div className="species-detail-model-toggle">
          <button
            className="toggle-btn"
            onClick={() => setShowModel(!showModel)}
            type="button"
          >
            {showModel ? t("species.viewPhotos") : t("species.viewModel")}
          </button>
        </div>
      )}

      {showModel && modelPath ? (
        <Model3DViewer modelUrl={modelPath} />
      ) : (
        <div className="species-detail-photos">
          {bird.images.slice(1, 5).map((img, i) => (
            <img key={i} src={`/db/images/${img}`} alt="" loading="lazy" />
          ))}
        </div>
      )}

      <div className="species-detail-info">
        <h1>{bird.common_name}</h1>
        <p className="scientific-name">{bird.scientific_name}</p>

        <div className="species-detail-badges">
          <ConservationBadge status={bird.iucn_status} showLabel />
          <SeasonalityBadge seasonality={bird.seasonality} />
          {bird.cites_appendix && (
            <span className="cites-badge">CITES {bird.cites_appendix}</span>
          )}
        </div>

        <div className="species-detail-stats">
          <div><strong>{t("species.size")}:</strong> {bird.size}</div>
          <div><strong>{t("species.weight")}:</strong> {bird.weight}</div>
        </div>

        {bird.distribution && (
          <div className="species-detail-section">
            <h3>{t("species.distribution")}</h3>
            <p>{bird.distribution}</p>
          </div>
        )}

        <div className="species-detail-section">
          <h3>Descripción</h3>
          <p>{bird.description}</p>
        </div>

        {bird.male_plumage && (
          <div className="species-detail-section">
            <h3>{t("species.malePlumage")}</h3>
            <p>{bird.male_plumage}</p>
          </div>
        )}

        {bird.female_plumage && (
          <div className="species-detail-section">
            <h3>{t("species.femalePlumage")}</h3>
            <p>{bird.female_plumage}</p>
          </div>
        )}

        {audioPath && (
          <AudioPlayer src={audioPath} label={t("species.playSound")} />
        )}

        {!discovered && (
          <button className="discover-btn" onClick={handleDiscover} type="button">
            {t("explorar.discover")}
          </button>
        )}

        {discovered && (
          <div className="discovered-label">{t("explorar.discovered")}</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add species detail styles to index.css**

Append to `src/index.css`:

```css
.species-detail {
  padding: 0;
}

.back-btn {
  display: block;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--ocean-light);
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
}

.species-detail-hero {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.species-detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.species-detail-photos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
}

.species-detail-photos img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.model-3d-viewer {
  width: 100%;
  aspect-ratio: 1;
  background: var(--gray-100);
}

.species-detail-info {
  padding: 1rem;
}

.species-detail-info h1 {
  font-size: 1.3rem;
  color: var(--ocean-deep);
}

.scientific-name {
  font-style: italic;
  color: var(--gray-500);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.species-detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.cites-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: var(--sunset);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
}

.species-detail-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.species-detail-section {
  margin-bottom: 0.75rem;
}

.species-detail-section h3 {
  font-size: 0.9rem;
  color: var(--ocean-mid);
  margin-bottom: 0.25rem;
}

.species-detail-section p {
  font-size: 0.85rem;
  line-height: 1.5;
}

.audio-player {
  margin: 0.75rem 0;
}

.audio-player-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--seafoam);
  background: var(--white);
  color: var(--ocean-deep);
  cursor: pointer;
  font-size: 0.85rem;
}

.discover-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--seafoam), var(--ocean-light));
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
}

.discovered-label {
  text-align: center;
  padding: 0.75rem;
  color: var(--seafoam);
  font-weight: 700;
  font-size: 1rem;
}

.toggle-btn {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: var(--ocean-deep);
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
}
```

- [ ] **Step 5: Verify species detail renders**

```bash
bun run build
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/SpeciesDetail.tsx src/components/AudioPlayer.tsx src/components/Model3DViewer.tsx src/index.css
git commit -m "feat: add SpeciesDetail with 3D viewer, audio player, conservation badges"
```

---

### Task 10: Misiones Tab — Modo Explorador

**Files:**
- Modify: `src/features/misiones/MisionesPage.tsx`
- Create: `src/features/misiones/ModoExplorador.tsx`
- Create: `src/features/misiones/BirdCamera.tsx`
- Create: `src/features/misiones/EncounterAnimation.tsx`

- [ ] **Step 1: Create BirdCamera component**

```typescript
// src/features/misiones/BirdCamera.tsx
import { useRef, useCallback, useState } from "react";

interface BirdCameraProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

export function BirdCamera({ onCapture, onClose }: BirdCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      onClose();
    }
  }, [onClose]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  }, [onCapture]);

  return (
    <div className="bird-camera">
      <video ref={videoRef} autoPlay playsInline onLoadedMetadata={startCamera} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="bird-camera-controls">
        <button onClick={onClose} type="button">✕</button>
        <button onClick={capture} className="capture-btn" type="button" disabled={!streaming}>
          📷
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create EncounterAnimation component**

```typescript
// src/features/misiones/EncounterAnimation.tsx
import type { Bird } from "../../types/bird";
import { getBirdImage } from "../../data/birds";

interface EncounterAnimationProps {
  bird: Bird;
  onComplete: () => void;
}

export function EncounterAnimation({ bird, onComplete }: EncounterAnimationProps) {
  return (
    <div className="encounter-animation" onClick={onComplete}>
      <div className="encounter-flash" />
      <div className="encounter-card">
        <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
        <h2>¡{bird.common_name}!</h2>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ModoExplorador component**

```typescript
// src/features/misiones/ModoExplorador.tsx
import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useDiscoveries } from "../../store/useDiscoveries";
import { loadBirds, getBirdImage } from "../../data/birds";
import { getSpottedBirds } from "../../data/detections";
import { BirdCamera } from "./BirdCamera";
import { EncounterAnimation } from "./EncounterAnimation";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import type { Bird } from "../../types/bird";
import { useTranslation } from "react-i18next";

export function ModoExplorador() {
  const { currentStation } = useAppStore();
  const { addDiscovery, isDiscovered } = useDiscoveries();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [nearby, setNearby] = useState<Bird[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [encounterBird, setEncounterBird] = useState<Bird | null>(null);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then((allBirds) => {
      setBirds(allBirds);
      if (currentStation) {
        setNearby(getSpottedBirds(currentStation, allBirds));
      }
    });
  }, [currentStation]);

  const handleCapture = (_photoDataUrl: string) => {
    setCameraOpen(false);
    setIdentifying(true);
    setTimeout(() => {
      const randomBird = nearby[Math.floor(Math.random() * nearby.length)];
      if (randomBird) {
        setEncounterBird(randomBird);
        if (!isDiscovered(randomBird.scientific_name) && currentStation) {
          addDiscovery(randomBird.scientific_name, currentStation);
        }
      }
      setIdentifying(false);
    }, 2000);
  };

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => setSelectedBird(null)}
        birds={birds}
      />
    );
  }

  if (cameraOpen) {
    return <BirdCamera onCapture={handleCapture} onClose={() => setCameraOpen(false)} />;
  }

  if (identifying) {
    return (
      <div className="identifying-screen">
        <div className="identifying-spinner" />
        <p>{t("misiones.identifying")}</p>
      </div>
    );
  }

  if (encounterBird) {
    return (
      <EncounterAnimation
        bird={encounterBird}
        onComplete={() => {
          setSelectedBird(encounterBird);
          setEncounterBird(null);
        }}
      />
    );
  }

  return (
    <div className="modo-explorador">
      <h3>{t("misiones.nearbySpecies")}</h3>
      <div className="nearby-grid">
        {nearby.map((bird) => (
          <button
            key={bird.scientific_name}
            className="nearby-thumb"
            onClick={() => setSelectedBird(bird)}
            type="button"
          >
            <img src={getBirdImage(bird, 0)} alt={bird.common_name} />
            <span>{bird.common_name}</span>
          </button>
        ))}
      </div>
      <button
        className="open-camera-btn"
        onClick={() => setCameraOpen(true)}
        type="button"
      >
        📷 {t("misiones.openCamera")}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Add mission styles to index.css**

Append to `src/index.css`:

```css
.modo-explorador {
  padding: 1rem;
}

.modo-explorador h3 {
  font-size: 1rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.nearby-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.nearby-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
  border: none;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
}

.nearby-thumb img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.nearby-thumb span {
  font-size: 0.65rem;
  padding: 0.25rem;
  text-align: center;
  color: var(--ocean-deep);
}

.open-camera-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--sunset), var(--sunset-light));
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.bird-camera {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.bird-camera video {
  flex: 1;
  object-fit: cover;
}

.bird-camera-controls {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background: rgba(0,0,0,0.7);
}

.bird-camera-controls button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.capture-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white !important;
  background: rgba(255,255,255,0.3) !important;
  font-size: 1.5rem !important;
}

.identifying-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 1rem;
  color: var(--ocean-deep);
}

.identifying-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--ocean-light);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.encounter-animation {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.encounter-card {
  text-align: center;
  animation: encounter-pop 0.5s ease-out;
}

.encounter-card img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1rem;
}

.encounter-card h2 {
  color: white;
  font-size: 1.5rem;
}

@keyframes encounter-pop {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
```

- [ ] **Step 5: Verify missions compiles**

```bash
bun run build
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/misiones/ src/index.css
git commit -m "feat: add Modo Explorador with camera capture, encounter animation"
```

---

### Task 11: Misiones Tab — Busca tu Ave

**Files:**
- Create: `src/features/misiones/BuscaTuAve.tsx`
- Modify: `src/features/misiones/MisionesPage.tsx`

- [ ] **Step 1: Create BuscaTuAve component**

```typescript
// src/features/misiones/BuscaTuAve.tsx
import { useState, useEffect } from "react";
import { loadBirds, deriveSizeCategory, deriveBirdType, type BirdType } from "../../data/birds";
import { useAppStore } from "../../store/useAppStore";
import { SpeciesCard } from "../../components/SpeciesCard";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import type { Bird } from "../../types/bird";
import type { Seasonality } from "../../types/bird";
import { useTranslation } from "react-i18next";
import { STATIONS } from "../../data/stations";

type PlumageColor = "blanco" | "negro" | "gris" | "cafe" | "colorido";

const PLUMAGE_KEYWORDS: Record<PlumageColor, string[]> = {
  blanco: ["blanco", "blanca", "claro"],
  negro: ["negro", "negra", "oscuro", "oscura", "marrón oscuro"],
  gris: ["gris", "plomizo", "plomiza"],
  cafe: ["café", "parda", "pardo", "marrón", "castaña"],
  colorido: ["rojo", "verde", "azul", "anaranjado", "colorido", "iridiscente"],
};

interface FilterState {
  sizeCategory: "" | "pequeno" | "mediano" | "grande";
  plumage: "" | PlumageColor;
  birdType: "" | BirdType;
  seasonality: "" | Seasonality;
}

function matchBird(bird: Bird, filters: FilterState): number {
  let score = 0;
  let maxScore = 0;

  if (filters.sizeCategory) {
    maxScore++;
    if (deriveSizeCategory(bird) === filters.sizeCategory) score++;
  }
  if (filters.birdType) {
    maxScore++;
    if (deriveBirdType(bird) === filters.birdType) score++;
  }
  if (filters.seasonality) {
    maxScore++;
    if (bird.seasonality === filters.seasonality) score++;
  }
  if (filters.plumage) {
    maxScore++;
    const desc = bird.description.toLowerCase();
    const keywords = PLUMAGE_KEYWORDS[filters.plumage];
    if (keywords.some((kw) => desc.includes(kw))) score++;
  }

  return maxScore > 0 ? score : 0;
}

export function BuscaTuAve() {
  const { currentStation } = useAppStore();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    sizeCategory: "",
    plumage: "",
    birdType: "",
    seasonality: "",
  });
  const [results, setResults] = useState<Bird[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [searched, setSearched] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  const handleSearch = () => {
    const station = STATIONS.find((s) => s.id === currentStation);
    const stationBirds = station
      ? birds.filter((b) => station.speciesIds.includes(b.scientific_name))
      : birds;

    const matched = stationBirds
      .map((b) => ({ bird: b, score: matchBird(b, filters) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((m) => m.bird);

    setResults(matched);
    setSearched(true);
  };

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => setSelectedBird(null)}
        birds={birds}
      />
    );
  }

  const sizeOptions = [
    { value: "pequeno", label: t("misiones.small") },
    { value: "mediano", label: t("misiones.medium") },
    { value: "grande", label: t("misiones.large") },
  ];

  const plumageOptions: { value: PlumageColor; label: string }[] = [
    { value: "blanco", label: "Blanco" },
    { value: "negro", label: "Negro" },
    { value: "gris", label: "Gris" },
    { value: "cafe", label: "Café" },
    { value: "colorido", label: "Colorido" },
  ];

  const typeOptions: { value: BirdType; label: string }[] = [
    { value: "pato", label: "Pato" },
    { value: "garza", label: "Garza" },
    { value: "gaviota", label: "Gaviota" },
    { value: "chorlo", label: "Chorlo" },
    { value: "playero", label: "Playero" },
    { value: "cormoran", label: "Cormorán" },
    { value: "pelicano", label: "Pelícano" },
    { value: "gallinazo", label: "Gallinazo" },
  ];

  const seasonOptions = [
    { value: "RE", label: t("misiones.resident") },
    { value: "MB", label: t("misiones.migratoryBoreal") },
    { value: "MA", label: t("misiones.migratoryAustral") },
  ];

  return (
    <div className="busca-tu-ave">
      <h3>{t("misiones.selectTraits")}</h3>

      <div className="trait-group">
        <label>{t("misiones.size")}</label>
        <div className="trait-options">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`trait-btn ${filters.sizeCategory === opt.value ? "active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  sizeCategory: f.sizeCategory === opt.value ? "" : opt.value,
                }))
              }
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="trait-group">
        <label>{t("misiones.plumage")}</label>
        <div className="trait-options">
          {plumageOptions.map((opt) => (
            <button
              key={opt.value}
              className={`trait-btn ${filters.plumage === opt.value ? "active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  plumage: f.plumage === opt.value ? "" : opt.value,
                }))
              }
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="trait-group">
        <label>{t("misiones.type")}</label>
        <div className="trait-options">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`trait-btn ${filters.birdType === opt.value ? "active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  birdType: f.birdType === opt.value ? "" : opt.value,
                }))
              }
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="trait-group">
        <label>{t("misiones.seasonality")}</label>
        <div className="trait-options">
          {seasonOptions.map((opt) => (
            <button
              key={opt.value}
              className={`trait-btn ${filters.seasonality === opt.value ? "active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  seasonality: f.seasonality === opt.value ? "" : opt.value as Seasonality,
                }))
              }
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button className="search-btn" onClick={handleSearch} type="button">
        {t("misiones.search")}
      </button>

      {searched && (
        <div className="search-results">
          <h4>
            {results.length > 0
              ? t("misiones.matchesFound", { count: results.length })
              : t("misiones.noMatches")}
          </h4>
          <div className="results-grid">
            {results.map((bird) => (
              <SpeciesCard
                key={bird.scientific_name}
                bird={bird}
                onClick={() => setSelectedBird(bird)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update MisionesPage with both modes**

```typescript
// src/features/misiones/MisionesPage.tsx
import { useState } from "react";
import { ModoExplorador } from "./ModoExplorador";
import { BuscaTuAve } from "./BuscaTuAve";
import { useTranslation } from "react-i18next";

type MissionMode = "explorador" | "busca";

export function MisionesPage() {
  const [mode, setMode] = useState<MissionMode>("explorador");
  const { t } = useTranslation();

  return (
    <div className="page misiones-page">
      <div className="mission-tabs">
        <button
          className={`mission-tab ${mode === "explorador" ? "active" : ""}`}
          onClick={() => setMode("explorador")}
          type="button"
        >
          🔍 {t("misiones.modoExplorador")}
        </button>
        <button
          className={`mission-tab ${mode === "busca" ? "active" : ""}`}
          onClick={() => setMode("busca")}
          type="button"
        >
          🦜 {t("misiones.buscaTuAve")}
        </button>
      </div>
      {mode === "explorador" ? <ModoExplorador /> : <BuscaTuAve />}
    </div>
  );
}
```

- [ ] **Step 3: Add busca tu ave styles to index.css**

Append to `src/index.css`:

```css
.mission-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
}

.mission-tab {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: var(--gray-100);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-500);
  transition: all 0.2s;
}

.mission-tab.active {
  background: var(--ocean-light);
  color: white;
}

.busca-tu-ave {
  padding: 0;
}

.busca-tu-ave h3 {
  font-size: 1rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.trait-group {
  margin-bottom: 1rem;
}

.trait-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ocean-mid);
  margin-bottom: 0.4rem;
}

.trait-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.trait-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-800);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.trait-btn.active {
  background: var(--ocean-light);
  border-color: var(--ocean-light);
  color: white;
}

.search-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: var(--seafoam);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin: 0.5rem 0 1rem;
}

.search-results h4 {
  font-size: 0.9rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
```

- [ ] **Step 4: Verify missions tab works**

```bash
bun run build
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/misiones/ src/index.css
git commit -m "feat: add Busca tu Ave with trait filtering and species matching"
```

---

### Task 12: Coleccion Tab

**Files:**
- Modify: `src/features/coleccion/ColeccionPage.tsx`
- Create: `src/features/coleccion/SpeciesGrid.tsx`
- Create: `src/features/coleccion/BadgesSection.tsx`
- Create: `src/features/coleccion/ProgressTracker.tsx`

- [ ] **Step 1: Create ProgressTracker**

```typescript
// src/features/coleccion/ProgressTracker.tsx
import { useDiscoveries } from "../../store/useDiscoveries";
import { useTranslation } from "react-i18next";

const TOTAL_SPECIES = 63;

export function ProgressTracker() {
  const { discoveries } = useDiscoveries();
  const { t } = useTranslation();
  const count = discoveries.length;
  const pct = Math.round((count / TOTAL_SPECIES) * 100);

  return (
    <div className="progress-tracker">
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p>
        {t("coleccion.progress", { discovered: count, total: TOTAL_SPECIES })}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create BadgesSection**

```typescript
// src/features/coleccion/BadgesSection.tsx
import { BADGES } from "../../types/badge";
import { useDiscoveries } from "../../store/useDiscoveries";
import { useTranslation } from "react-i18next";

export function BadgesSection() {
  const { getDiscoveredBirdIds } = useDiscoveries();
  const { t, i18n } = useTranslation();
  const discoveredIds = getDiscoveredBirdIds();
  const isEn = i18n.language === "en";

  return (
    <div className="badges-section">
      <h3>{t("coleccion.badges")}</h3>
      <div className="badges-grid">
        {BADGES.map((badge) => {
          const earned = badge.condition(discoveredIds);
          return (
            <div key={badge.id} className={`badge-item ${earned ? "earned" : "locked"}`}>
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">
                {isEn ? badge.nameEn : badge.nameEs}
              </span>
              <span className="badge-desc">
                {isEn ? badge.descriptionEn : badge.descriptionEs}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create SpeciesGrid**

```typescript
// src/features/coleccion/SpeciesGrid.tsx
import { useState, useEffect } from "react";
import { loadBirds } from "../../data/birds";
import { useDiscoveries } from "../../store/useDiscoveries";
import { SpeciesCard } from "../../components/SpeciesCard";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import type { Bird } from "../../types/bird";

export function SpeciesGrid() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const { isDiscovered } = useDiscoveries();

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => setSelectedBird(null)}
        birds={birds}
      />
    );
  }

  return (
    <div className="species-grid">
      {birds.map((bird) => (
        <SpeciesCard
          key={bird.scientific_name}
          bird={bird}
          discovered={isDiscovered(bird.scientific_name)}
          onClick={() => isDiscovered(bird.scientific_name) && setSelectedBird(bird)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Update ColeccionPage**

```typescript
// src/features/coleccion/ColeccionPage.tsx
import { SpeciesGrid } from "./SpeciesGrid";
import { BadgesSection } from "./BadgesSection";
import { ProgressTracker } from "./ProgressTracker";
import { useTranslation } from "react-i18next";

export function ColeccionPage() {
  const { t } = useTranslation();

  return (
    <div className="page coleccion-page">
      <h2 className="coleccion-title">{t("coleccion.title")}</h2>
      <ProgressTracker />
      <SpeciesGrid />
      <BadgesSection />
    </div>
  );
}
```

- [ ] **Step 5: Add coleccion styles to index.css**

Append to `src/index.css`:

```css
.coleccion-title {
  font-size: 1.2rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.progress-tracker {
  margin-bottom: 1rem;
}

.progress-bar-bg {
  height: 8px;
  background: var(--gray-200);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--seafoam), var(--ocean-light));
  border-radius: 999px;
  transition: width 0.5s;
}

.progress-tracker p {
  font-size: 0.8rem;
  color: var(--gray-500);
}

.species-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.badges-section h3 {
  font-size: 1rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  border-radius: 12px;
  background: var(--white);
  text-align: center;
  gap: 0.3rem;
}

.badge-item.locked {
  opacity: 0.4;
  filter: grayscale(1);
}

.badge-icon {
  font-size: 2rem;
}

.badge-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ocean-deep);
}

.badge-desc {
  font-size: 0.65rem;
  color: var(--gray-500);
}
```

- [ ] **Step 6: Verify coleccion tab works**

```bash
bun run build
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/coleccion/ src/index.css
git commit -m "feat: add Coleccion tab with species grid, badges, progress tracker"
```

---

### Task 13: Perfil Tab + Clerk Auth

**Files:**
- Modify: `src/features/perfil/PerfilPage.tsx`
- Create: `src/features/perfil/AuthControls.tsx`
- Create: `src/features/perfil/LanguageToggle.tsx`
- Create: `src/features/perfil/StatsSection.tsx`

- [ ] **Step 1: Initialize Clerk in project**

```bash
clerk auth login && clerk init --app app_3EQKUf5EQ92WR1YtRRb0wI6eGo3
```

Follow the CLI prompts. This will install `@clerk/clerk-react` and create `.env.local` with your publishable key.

- [ ] **Step 2: Update main.tsx with ClerkProvider**

```typescript
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

- [ ] **Step 3: Create AuthControls**

```typescript
// src/features/perfil/AuthControls.tsx
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export function AuthControls() {
  const { isSignedIn } = useUser();
  const { t } = useTranslation();

  if (isSignedIn) {
    return (
      <div className="auth-controls signed-in">
        <UserButton />
      </div>
    );
  }

  return (
    <div className="auth-controls signed-out">
      <SignInButton mode="modal">
        <button className="auth-btn" type="button">{t("perfil.signIn")}</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="auth-btn secondary" type="button">{t("perfil.signUp")}</button>
      </SignUpButton>
    </div>
  );
}
```

- [ ] **Step 4: Create LanguageToggle**

```typescript
// src/features/perfil/LanguageToggle.tsx
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-toggle">
      <label>{t("perfil.language")}</label>
      <div className="toggle-group">
        <button
          className={`toggle-opt ${i18n.language === "es" ? "active" : ""}`}
          onClick={() => i18n.changeLanguage("es")}
          type="button"
        >
          ES
        </button>
        <button
          className={`toggle-opt ${i18n.language === "en" ? "active" : ""}`}
          onClick={() => i18n.changeLanguage("en")}
          type="button"
        >
          EN
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create StatsSection**

```typescript
// src/features/perfil/StatsSection.tsx
import { useDiscoveries } from "../../store/useDiscoveries";
import { BADGES } from "../../types/badge";
import { useTranslation } from "react-i18next";

export function StatsSection() {
  const { getDiscoveredBirdIds } = useDiscoveries();
  const { t } = useTranslation();
  const discoveredIds = getDiscoveredBirdIds();
  const earnedBadges = BADGES.filter((b) => b.condition(discoveredIds));

  return (
    <div className="stats-section">
      <h3>{t("perfil.stats")}</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{discoveredIds.length}</span>
          <span className="stat-label">{t("perfil.speciesDiscovered")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{earnedBadges.length}</span>
          <span className="stat-label">{t("perfil.badgesEarned")}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Update PerfilPage**

```typescript
// src/features/perfil/PerfilPage.tsx
import { AuthControls } from "./AuthControls";
import { LanguageToggle } from "./LanguageToggle";
import { StatsSection } from "./StatsSection";
import { useTranslation } from "react-i18next";

export function PerfilPage() {
  const { t } = useTranslation();

  return (
    <div className="page perfil-page">
      <AuthControls />
      <LanguageToggle />
      <StatsSection />
      <div className="about-section">
        <h3>{t("perfil.about")}</h3>
        <p>{t("perfil.aboutText")}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Add perfil styles to index.css**

Append to `src/index.css`:

```css
.perfil-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.auth-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: var(--ocean-light);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.auth-btn.secondary {
  background: var(--white);
  border: 1px solid var(--ocean-light);
  color: var(--ocean-light);
}

.language-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-toggle label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ocean-deep);
}

.toggle-group {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--gray-200);
}

.toggle-opt {
  padding: 0.4rem 1rem;
  border: none;
  background: var(--white);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-500);
}

.toggle-opt.active {
  background: var(--ocean-light);
  color: white;
}

.stats-section h3 {
  font-size: 1rem;
  color: var(--ocean-deep);
  margin-bottom: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: var(--white);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--ocean-light);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.about-section h3 {
  font-size: 1rem;
  color: var(--ocean-deep);
  margin-bottom: 0.5rem;
}

.about-section p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--gray-800);
}
```

- [ ] **Step 8: Verify Clerk integration works**

```bash
bun run dev
```

Expected: Perfil tab shows sign-in/sign-up buttons. Sign-in flow opens Clerk modal.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Perfil tab with Clerk auth, language toggle, stats"
```

---

### Task 14: MapView Component

**Files:**
- Create: `src/components/MapView.tsx`

- [ ] **Step 1: Create MapView**

```typescript
// src/components/MapView.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { STATIONS, MAP_CENTER } from "../data/stations";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1/dist/images/marker-shadow.png",
});

interface MapViewProps {
  activeStationId?: string;
  onStationClick?: (id: string) => void;
  className?: string;
}

export function MapView({ activeStationId, onStationClick, className }: MapViewProps) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={16}
      className={className ?? "map-view"}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {STATIONS.map((station) => (
        <Marker key={station.id} position={[station.lat, station.lng]}>
          <Popup>
            <button
              onClick={() => onStationClick?.(station.id)}
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              {station.label}
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

- [ ] **Step 2: Add map styles to index.css**

Append to `src/index.css`:

```css
.map-view {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}
```

- [ ] **Step 3: Integrate map into ExplorarPage — add MapView above SpottedList**

Update `src/features/explorar/ExplorarPage.tsx` to import and render `<MapView activeStationId={currentStation ?? undefined} />` between CameraFeed and SpottedList.

- [ ] **Step 4: Verify map renders**

```bash
bun run dev
```

Expected: Map shows centered on HCPA with 4 station markers.

- [ ] **Step 5: Commit**

```bash
git add src/components/MapView.tsx src/features/explorar/ExplorarPage.tsx src/index.css
git commit -m "feat: add MapView with station markers"
```

---

### Task 15: Placeholder Assets

**Files:**
- Create: `public/db/videos/station_a.mp4` (placeholder)
- Create: `public/db/models/` directory
- Create: `public/db/audio/` directory

- [ ] **Step 1: Create placeholder directories**

```bash
mkdir -p public/db/models public/db/audio public/db/videos
```

- [ ] **Step 2: Create a short placeholder video for testing**

Download or create a minimal MP4 for each station. For prototype, a 10-second loop of ocean/wetland footage works. Place as:
- `public/db/videos/station_a.mp4`
- `public/db/videos/station_b.mp4`
- `public/db/videos/station_c.mp4`
- `public/db/videos/station_d.mp4`

If no video files available yet, the camera feed section will show empty — the app still works.

- [ ] **Step 3: Commit**

```bash
git add public/db/models/ public/db/audio/ public/db/videos/
git commit -m "feat: add placeholder asset directories"
```

---

### Task 16: Integration Test and Polish

**Files:**
- Modify: `src/App.css` (clear Vite template styles)
- Various minor fixes

- [ ] **Step 1: Clear App.css of Vite template styles**

Replace `src/App.css` content with empty file or minimal overrides only.

- [ ] **Step 2: Run full build**

```bash
bun run build
```

Expected: Clean build with no errors.

- [ ] **Step 3: Test full flow manually**

1. Open app with `?zone=A` query param
2. Verify Explorar tab shows Station A header, camera feed, spotted birds
3. Tap a species — verify detail card opens with all fields
4. Switch to Misiones tab — verify Modo Explorador and Busca tu Ave modes work
5. Switch to Coleccion tab — verify species grid with locked/unlocked states
6. Switch to Perfil tab — verify language toggle, auth controls

- [ ] **Step 4: Fix any issues found during manual test**

Address any rendering, routing, or data issues.

- [ ] **Step 5: Run lint**

```bash
bun run lint
```

Fix any lint errors.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: integration test and polish pass"
```
