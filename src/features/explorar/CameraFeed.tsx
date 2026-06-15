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