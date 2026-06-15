# Arenilla Go — Design Spec

> **Note:** This spec is intentionally loose and subject to modification. Details will evolve during implementation as we learn what works. Nothing here is set in stone — iterate freely.

## Overview

Arenilla Go is a mobile-first interactive web platform for the Humedal Costero Poza de la Arenilla (HCPA) in La Punta, Callao. Visitors scan QR codes placed along the walking path to discover and learn about bird species in real time. The experience is inspired by nature exploration games like Pokemon GO — visitors use their phone camera to "find" birds, build a digital collection, and learn about wetland biodiversity.

## App Name

**Arenilla Go**

## Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Design**: Use the `frontend-design` skill during implementation
- **Auth**: Clerk (Google sign-in)
- **3D**: Three.js / React Three Fiber for interactive 3D bird viewers (species detail cards only, no AR camera overlay)
- **i18n**: Spanish (primary) + English, from day one
- **Data**: Local mock JSON (`public/db/birds.json`, 63 species)
- **Camera feed**: Prerecorded video per station (mocked)
- **AI detection**: Mock data simulating species detection per station
- **Future**: PWA support (not in prototype)

## QR Stations

Four stations along the Urbana zone of the HCPA walking path:

| Station | Coordinates | Label |
|---------|------------|-------|
| A | -12.074006, -77.162610 | Estacion A - Mirador Oeste |
| B | -12.072702, -77.160723 | Estacion B - Pergola Norte |
| C | -12.070789, -77.159469 | Estacion C - Pergola Sur |
| D | -12.069619, -77.158699 | Estacion D - Mirador Este |

URL format: `arenilla.go?zone=A` (opens in mobile browser, loads Explorar tab with that station context).

Map center: -12.071228, -77.160295

Each station has its own prerecorded camera video and a subset of species assigned to it.

## Visual Direction

Color palette inspired by La Punta's ocean and coast: deep blues, sandy beiges, seafoam greens, warm sunset oranges. Think wetland water, rocky shore, golden sand, and the birds themselves. The UI should feel like the place — coastal, natural, alive.

## App Shell

4-tab bottom navigation:

| Tab | Icon | Purpose |
|-----|------|---------|
| Explorar | Magnifying glass | Current station, live camera feed, species spotted now |
| Misiones | Star | Discovery missions (camera photo) + Busca tu Ave |
| Coleccion | Book | Digital guide, discovered species, badges |
| Perfil | Person | Clerk auth, language toggle (ES/EN), settings |

## Screens

### 1. Explorar Tab

**Zone Header** — Station name (A/B/C/D), location label, tide status indicator.

**Camera Feed** — Prerecorded video for that station with AI-detected species appearing as overlay badges on the feed.

**"Avistadas ahora" List** — Horizontal scrollable cards of species currently detected by (mock) AI at this station. Each card shows: photo thumbnail, common name, IUCN status color dot.

**Species Detail** (tap a species card):

- Hero image (from `images` array)
- 3D interactive model (if available for this species, fallback to photo carousel)
- Play sound button (if `vocalization` exists)
- Common name + scientific name
- Size / Weight
- Seasonality badge (RE / MB / MA / MS / ML)
- IUCN conservation status (with color coding)
- CITES appendix (if applicable)
- Distribution text
- Description
- Male/female plumage notes (if available)
- "Descubierta" button — adds to user's collection (requires login prompt if not authenticated)

### 2. Misiones Tab

**Modo Explorador**:

- Shows which species are "nearby" at your station as photo thumbnails
- Opens phone camera — visitor points it at the wetland to find birds
- Visitor takes a photo of a bird
- Mock AI "identifies" the species from the photo
- Encounter animation plays
- Species detail card appears
- Species marked as "descubierta" (discovered) and added to collection

**Busca tu Ave**:

- Feature selector: visitor picks traits to narrow down what bird they're looking for
  - Tamano (size category derived from `size` field): pequeno, mediano, grande
  - Plumaje (plumage color/pattern derived from `description` + `male_plumage`/`female_plumage`): blanco, negro, gris, cafe, colorido, etc.
  - Tipo (beak/behavior class derived from species data): pato, garza, gaviota, chorlo, playero, cormoran, pelicano, etc.
  - Estacionalidad (from `seasonality`): residente, migratorio boreal, migratorio austral
- App shows best-matching species with a match score (simple trait-match: each selected filter that matches a species counts as +1, displayed as a percentage of max possible matches)
- Visitor taps a match to open its detail card, then can find it with camera (same photo -> identify flow as Modo Explorador)

### 3. Coleccion Tab

**Species Grid** — All 63 species as cards:
- Discovered species: full color photo, common name
- Undiscovered species: silhouette, locked, common name hidden or shown as "???"

**Species Detail** (tap discovered species) — Same detail card as Explorar.

**Badges Section**:
- Explorador Costero (discover 5 species)
- Observador de Migratorias (discover 5 migratory species)
- Guardián de la Biodiversidad (discover species from all seasonality types)
- Additional badges as discovered

**Progress Tracker** — "X de 63 especies descubiertas"

### 4. Perfil Tab

- Clerk Google sign-in/sign-up
- Language toggle: Espanol / English
- Stats: species discovered, missions completed, badges earned
- About the HCPA (brief educational blurb from the PDF context)

## Data Model

### Station

```typescript
interface Station {
  id: "A" | "B" | "C" | "D";
  label: string;           // e.g. "Estacion A - Mirador Oeste"
  lat: number;
  lng: number;
  videoSrc: string;        // prerecorded video path
  speciesIds: string[];    // subset of bird scientific_name values spotted here
}
```

### Bird (from existing birds.json)

```typescript
interface Bird {
  scientific_name: string;
  common_name: string;
  iucn_status: string;      // LC, NT, VU, EN, CR
  seasonality: string;       // RE, MB, MA, MS, ML, ACC
  cites_appendix: string | null;
  size: string;              // e.g. "38-45 CM"
  weight: string;            // e.g. "350-400 GR"
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

### Discovery (per user)

```typescript
interface Discovery {
  birdId: string;           // scientific_name
  stationId: string;         // station where discovered
  discoveredAt: string;         // ISO timestamp
  photoUrl?: string;         // user's photo from mission
}
```

### Badge

```typescript
interface Badge {
  id: string;
  name: string;              // e.g. "Explorador Costero"
  description: string;
  icon: string;
  condition: string;         // e.g. "discover 5 species"
}
```

## Mock Data Strategy

- `birds.json` already exists with 63 species
- `stations.json` — 4 stations with coordinates, video refs, and assigned species subsets
- `detections.json` — mock per-station AI detections (which species are "spotted now"), varying by simulated time/season
- Images: referenced in `images` array per bird (e.g. `spatula_cyanoptera_1.jpg`) — stored in `public/db/images/`
- 3D models: ~10 species, stored in `public/db/models/` — species with missing models show photo carousel fallback
- Audio: 23 species with vocalizations, stored in `public/db/audio/`
- Prerecorded videos: stored in `public/db/videos/`

## Clerk Auth Setup

Clerk app ID: `app_3EQKUf5EQ92WR1YtRRb0wI6eGo3`

Setup steps:
1. Install Clerk CLI: `npm install -g clerk`
2. Sign in: `clerk auth login`
3. Initialize in project: `clerk init --app app_3EQKUf5EQ92WR1YtRRb0wI6eGo3`
4. Since this is a React + Vite project, use `@clerk/clerk-react` package
5. Verify with `clerk doctor`
6. Ensure sign-in/sign-up controls are visible in the Perfil tab
7. Use `SignInButton`, `SignUpButton`, `UserButton` components from `@clerk/clerk-react`

## Auth Flow

- Browsing (Explorar, Misiones view) is free — no auth required
- "Descubierta" button (add to collection) triggers Clerk sign-in modal
- After auth, discoveries are persisted to user's collection
- Coleccion tab shows discovered species after auth, or prompts sign-in if anonymous

## i18n

- All UI strings in Spanish with English translations
- Bird common names have both ES and EN (EN names to be added to data or derived)
- URL route unchanged across languages; language preference stored in Clerk user metadata
- Seeded with Spanish as default

## Key Technical Notes

- Mobile-first responsive design (primary target: phone browsers)
- No AR camera overlay — camera is for taking photos that trigger mock identification
- 3D models rendered as interactive viewers on species detail cards only (not in camera view)
- Camera API: use `navigator.mediaDevices.getUserMedia` for live camera, then capture frame for "identification"
- Mock AI identification: after photo capture, randomly select from station's species list with a short delay animation
- Clerk integration: use `@clerk/clerk-react` package
- Map: use Leaflet or similar lightweight map library, centered on HCPA coordinates
- No offline support in prototype (future PWA)

## Scope Exclusions (Not in Prototype)

- PWA / offline mode
- Real camera feeds (prerecorded videos instead)
- Real AI species detection (mock data)
- AR overlay on camera view
- Social / sharing features
- Admin dashboard
- Backend API (all local mock data)
- Payment / monetization