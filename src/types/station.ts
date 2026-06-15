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