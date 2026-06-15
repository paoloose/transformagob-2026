import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { STATIONS, MAP_CENTER } from "../data/stations";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
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

export function MapView({ onStationClick, className }: MapViewProps) {
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