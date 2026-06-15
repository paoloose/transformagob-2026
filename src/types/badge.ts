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