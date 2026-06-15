import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { loadBirds } from "../../data/birds";
import { useDiscoveries } from "../../store/useDiscoveries";
import { SpeciesCard } from "../../components/SpeciesCard";
import { SpeciesDetail } from "../../components/SpeciesDetail";
import { useTranslation } from "react-i18next";
import type { Bird } from "../../types/bird";
import { deriveBirdType } from "../../data/birds";

export function SpeciesGrid() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const birdQuery = searchParams.get("bird");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const { isDiscovered } = useDiscoveries();
  const { t } = useTranslation();

  useEffect(() => {
    loadBirds().then(setBirds);
  }, []);

  const filteredBirds = useMemo(() => {
    let result = birds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.common_name.toLowerCase().includes(q) ||
          b.scientific_name.toLowerCase().includes(q)
      );
    }
    if (filterType) {
      result = result.filter((b) => deriveBirdType(b) === filterType);
    }
    return result;
  }, [birds, search, filterType]);

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

  const discovered = filteredBirds.filter((b) => isDiscovered(b.scientific_name));
  const undiscovered = filteredBirds.filter((b) => !isDiscovered(b.scientific_name));

  const typeOptions = [
    { value: "", label: t("coleccion.allTypes") },
    { value: "pato", label: "Patos" },
    { value: "garza", label: "Garzas" },
    { value: "gaviota", label: "Gaviotas" },
    { value: "playero", label: "Playeros" },
    { value: "chorlo", label: "Chorlos" },
    { value: "cormoran", label: "Cormoranes" },
    { value: "pelicano", label: "Pelícanos" },
  ];

  return (
    <div className="species-grid-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder={t("coleccion.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="search-filter"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {discovered.length > 0 && (
        <div className="species-grid-section">
          <h4 className="species-grid-label">{t("coleccion.discovered")}</h4>
          <div className="species-grid">
            {discovered.map((bird) => (
              <SpeciesCard
                key={bird.scientific_name}
                bird={bird}
                discovered
                showInfo
                onClick={() => handleSpeciesClick(bird)}
              />
            ))}
          </div>
        </div>
      )}

      {undiscovered.length > 0 && (
        <div className="species-grid-section">
          <h4 className="species-grid-label undiscovered-label">{t("coleccion.undiscovered")}</h4>
          <div className="species-grid">
            {undiscovered.map((bird) => (
              <SpeciesCard
                key={bird.scientific_name}
                bird={bird}
                discovered={false}
                onClick={() => handleSpeciesClick(bird)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}