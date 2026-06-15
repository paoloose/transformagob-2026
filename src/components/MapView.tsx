import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { STATIONS, MAP_CENTER } from "../data/stations";
import type { StationId } from "../types/station";
import { useAppStore } from "../store/useAppStore";
const TELESCOPE_ICON = "/telescope.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function createStationIcon(size: number, active: boolean) {
  return L.divIcon({
    className: "station-marker-icon",
    html: `<div class="station-marker${active ? " station-marker-active" : ""}" style="width:${size}px;height:${size}px;">
      <img src="${TELESCOPE_ICON}" width="${size}" height="${size}" alt="" />
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

const stationIcon = createStationIcon(36, false);
const activeStationIcon = createStationIcon(44, true);

interface MapViewProps {
  className?: string;
}

export function MapView({ className }: MapViewProps) {
  const { currentStation, setCurrentStation } = useAppStore();

  const handleStationClick = (id: StationId) => {
    setCurrentStation(id);
    const url = new URL(window.location.href);
    url.searchParams.set("zone", id);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={16}
      className={className ?? "map-view-full"}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {STATIONS.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={currentStation === station.id ? activeStationIcon : stationIcon}
        >
          <Popup>
            <button
              onClick={() => handleStationClick(station.id)}
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
            >
              {station.label}
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}