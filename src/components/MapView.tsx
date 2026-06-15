import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { STATIONS, MAP_CENTER } from "../data/stations";
import type { StationId } from "../types/station";
import { useAppStore } from "../store/useAppStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1/dist/images/marker-shadow.png",
});

const stationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1/dist/images/marker-shadow.png",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
});

const activeStationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1/dist/images/marker-shadow.png",
  iconSize: [34, 48],
  iconAnchor: [17, 48],
  popupAnchor: [0, -48],
});

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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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