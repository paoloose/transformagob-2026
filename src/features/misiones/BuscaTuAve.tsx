import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
  const [searched, setSearched] = useState(false);
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const birdQuery = searchParams.get("bird");

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

  const selectedBird = birds.find(b => b.scientific_name === birdQuery) || null;

  const handleSpeciesClick = (bird: Bird) => {
    navigate(`${location.pathname}?bird=${encodeURIComponent(bird.scientific_name)}`);
  };

  if (selectedBird) {
    return (
      <SpeciesDetail
        bird={selectedBird}
        onBack={() => navigate(-1)}
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
                  sizeCategory: f.sizeCategory === opt.value ? "" : (opt.value as FilterState["sizeCategory"]),
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
                  seasonality: f.seasonality === opt.value ? "" : (opt.value as Seasonality),
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
                onClick={() => handleSpeciesClick(bird)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}